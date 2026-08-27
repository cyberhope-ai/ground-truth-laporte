"""PCOS Veritas Engine — pipeline stage contracts.

Each stage is a pure-ish function with an explicit input and output type. The
point of writing them this way is that the *gates* between stages are
type-level, not conventions someone can forget:

    Artifact  -> (custody seals it) ->  SealedArtifact
    SealedArtifact -> (render) -> Rendition          # machine text, NOT quotable
    Rendition -> (resolve) -> Utterance              # speaker + mode resolved
    Utterance -> (gate) -> VerdictEligible           # only assertions by known speakers
    VerdictEligible -> (extract/retrieve/reason) -> Verdict
    Verdict + Reply -> (publish) -> Publication

You cannot construct a Verdict without a VerdictEligible, and you cannot
construct a VerdictEligible from an unresolved speaker or a non-assertion.
Every failure mode found in the Vigo pilot is blocked by one of these types.

Implementations live in sibling modules; this file is the contract.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum
from typing import Optional, Protocol, Sequence


# ─────────────────────────── enums ───────────────────────────

class SpeechMode(str, Enum):
    ASSERTION = "assertion"        # the only verdict-eligible mode
    QUESTION = "question"
    QUOTATION = "quotation"
    HYPOTHETICAL = "hypothetical"
    SATIRE = "satire"              # character voice — inverts meaning
    SARCASM = "sarcasm"
    UNCLASSIFIED = "unclassified"


class SpeakerConfidence(str, Enum):
    CONFIRMED = "confirmed"
    PROBABLE = "probable"
    UNRESOLVED = "unresolved"


class Verdict(str, Enum):
    VERIFIED = "VERIFIED"
    CORROBORATED = "CORROBORATED"
    UNSUPPORTED = "UNSUPPORTED"
    DISPUTED = "DISPUTED"
    FALSE = "FALSE"
    OPINION = "OPINION"
    NOT_COVERED = "NOT_COVERED"          # source out of scope != "none"
    PENDING_RESPONSE = "PENDING_RESPONSE"


class Congruence(str, Enum):
    CONGRUENT = "CONGRUENT"
    EMPHASIS_SHIFT = "EMPHASIS_SHIFT"    # normal politics, not dishonesty
    INCOMPLETE = "INCOMPLETE"
    INCONGRUENT = "INCONGRUENT"
    CONTRADICTED_BY_RECORD = "CONTRADICTED_BY_RECORD"
    EVOLVED = "EVOLVED"                  # changed and said so = a virtue


class Tier(int, Enum):
    PRIMARY_RECORD = 1
    OFFICIAL_STATEMENT = 2
    ON_RECORD_INTERVIEW = 3
    ESTABLISHED_MEDIA = 4
    SOCIAL = 5                           # proves a claim was MADE, not that it's TRUE


# ─────────────────────────── custody ───────────────────────────

@dataclass(frozen=True)
class RawFetch:
    source_url: str
    resolved_url: str
    body: bytes
    mime: str
    fetched_at: datetime


@dataclass(frozen=True)
class SealedArtifact:
    """Nothing enters analysis unsealed. Construct only via CustodyStage."""
    id: str
    sha256: str
    source_url: str
    resolved_url: str
    captured_at: datetime
    storage_uri: str
    archive_url: Optional[str]
    mime: str
    parent_id: Optional[str] = None
    page_no: Optional[int] = None
    t_start_s: Optional[float] = None
    t_end_s: Optional[float] = None
    jurisdiction_scope: Optional[str] = None
    seal_id: Optional[str] = None
    seal_hash: Optional[str] = None

    @property
    def anchor(self) -> str:
        if self.page_no is not None:
            return f"p.{self.page_no}"
        if self.t_start_s is not None:
            m, s = divmod(int(self.t_start_s), 60)
            h, m = divmod(m, 60)
            return f"{h}:{m:02d}:{s:02d}"
        return "whole"


class CustodyStage(Protocol):
    def seal(self, fetch: RawFetch, *, jurisdiction_scope: str | None = None) -> SealedArtifact:
        """Hash, store, snapshot to an external archive, and seal to the Q chain.

        MUST run before any analysis touches the bytes. The archive snapshot is
        taken at capture time because pages get edited or deleted once coverage
        is known.
        """
        ...


# ─────────────────────────── render ───────────────────────────

@dataclass(frozen=True)
class Rendition:
    """Machine-derived text. A search index — NEVER a quotation source."""
    artifact: SealedArtifact
    method: str               # 'ocr' | 'asr' | 'html-extract' | 'pdf-text'
    engine: str               # tool + version, for reproducible replay
    text: str
    confidence: Optional[float] = None
    is_machine_text: bool = True


class RenderStage(Protocol):
    def render(self, artifact: SealedArtifact) -> Sequence[Rendition]:
        """OCR / ASR / extract, emitting page- or timestamp-anchored renditions.

        Public records are routinely public-but-unreadable: in the Vigo pilot
        all 25 council PDFs returned zero extractable characters and required
        OCR. This stage is core infrastructure, not a fallback.
        """
        ...


# ─────────────────────────── resolve ───────────────────────────

@dataclass(frozen=True)
class Subject:
    id: str
    display_name: str
    kind: str
    disambiguators: dict = field(default_factory=dict)


class RoleRegistry(Protocol):
    def holder_on(self, office: str, jurisdiction: str, on: date) -> Optional[Subject]:
        """Who held this office on this date.

        Blocks the Vigo failure where 'threats by the Council president' sat
        four words from a subject who did not hold that office at the time.
        """
        ...

    def match(self, name: str, hints: dict) -> Optional[Subject]:
        """Two-identifier rule: name alone is never sufficient."""
        ...


@dataclass(frozen=True)
class Utterance:
    id: str
    artifact: SealedArtifact
    said_on: date
    channel: str
    text: str
    anchor: str
    speaker: Optional[Subject]
    speaker_conf: SpeakerConfidence
    speaker_basis: str
    mode: SpeechMode
    mode_basis: str
    audience: Optional[str] = None


class DiarizeStage(Protocol):
    def split_speakers(self, artifact: SealedArtifact, rendition: Rendition) -> Sequence[Utterance]:
        """Attribute each span to a speaker.

        Mandatory for multi-speaker media. In the pilot, 'I voted against a 0.75
        tax' on the subject's own channel belonged to his interviewee. Where
        diarization is unavailable or low-confidence, emit UNRESOLVED — never
        guess from channel ownership.
        """
        ...


class ModeStage(Protocol):
    def classify(self, u: Utterance) -> Utterance:
        """Assertion / question / quotation / hypothetical / satire / sarcasm.

        Diarization does NOT catch character voice: in the pilot the subject
        performed a two-character skit alone, and the extracted position was
        the exact inverse of his real one. Distinct stage, cannot be merged.
        """
        ...


# ─────────────────────────── the gate ───────────────────────────

class GateError(RuntimeError):
    pass


@dataclass(frozen=True)
class VerdictEligible:
    """An utterance cleared for claim extraction. Construct only via gate()."""
    utterance: Utterance


def gate(u: Utterance) -> VerdictEligible:
    """The single chokepoint. Everything downstream requires this type."""
    if u.speaker_conf is not SpeakerConfidence.CONFIRMED:
        raise GateError(
            f"speaker {u.speaker_conf.value} at {u.anchor}: cannot attribute to a named person"
        )
    if u.mode is not SpeechMode.ASSERTION:
        raise GateError(
            f"mode={u.mode.value} at {u.anchor}: only plain assertions receive verdicts"
        )
    return VerdictEligible(utterance=u)


# ─────────────────────────── claims & evidence ───────────────────────────

@dataclass(frozen=True)
class Claim:
    id: str
    source: VerdictEligible
    subject: Subject
    atomic_text: str          # self-contained; pronouns resolved
    topic: str
    checkworthy: float


class ExtractStage(Protocol):
    def atomize(self, e: VerdictEligible) -> Sequence[Claim]:
        """Decompose into self-contained atomic claims, score check-worthiness.

        Decompose-then-verify per SAFE/FActScore; triage scoring per the
        ClaimBuster methodology (reimplemented — the reference code is GPL-3.0).
        """
        ...


@dataclass(frozen=True)
class Evidence:
    claim_id: str
    artifact: SealedArtifact
    excerpt: str
    anchor: str
    stance: str               # supports | refutes | neutral | mitigates
    tier: Tier
    weight: float
    extracted_by: str         # 'deterministic-parse' | 'llm'


class RetrieveStage(Protocol):
    def gather(self, claim: Claim) -> Sequence[Evidence]:
        """Hunt evidence across the sealed corpus first, then the live web.

        Sealed-corpus-first is what makes the system cheaper over time: a claim
        checked once never needs re-fetching.
        """
        ...


class NumberExtractor(Protocol):
    def figures(self, artifact: SealedArtifact) -> dict:
        """Parse numbers mechanically from the sealed source.

        HARD RULE: figures never pass through an LLM summarizer. In the pilot a
        summarizer produced three different budget figures and three different
        bed counts from the SAME article.
        """
        ...


# ─────────────────────────── reason & adversary ───────────────────────────

@dataclass(frozen=True)
class VerdictRecord:
    claim_id: str
    value: Verdict
    confidence: float
    rationale: str
    evidence: Sequence[Evidence]
    adversary_ran: bool
    adversary_note: str
    model_ref: str
    inputs_hash: str          # deterministic replay key
    reply_id: Optional[str] = None


class ReasonStage(Protocol):
    def adjudicate(self, claim: Claim, evidence: Sequence[Evidence]) -> VerdictRecord:
        """Evidence graph + probabilistic aggregation over conflicting evidence.

        FactReasoner-style: NLI-derived entailment/contradiction edges over a
        graphical model yielding a calibrated posterior, not a coin flip.

        Probabilistic MODEL, deterministic EXECUTION: identical evidence set and
        model_ref must reproduce an identical verdict, and inputs_hash proves it.
        """
        ...


class AdversaryStage(Protocol):
    def refute(self, claim: Claim, draft: VerdictRecord) -> VerdictRecord:
        """Actively hunt the strongest case AGAINST our own finding.

        In the pilot this stage found three legitimate defenses sitting in the
        same minutes as the apparent contradiction, turning 'hypocrite' into
        'DISPUTED — pending response'. Without it the engine manufactures
        scandals. Sets stance='mitigates' evidence and may downgrade the verdict.
        """
        ...


# ─────────────────────────── congruence ───────────────────────────

@dataclass(frozen=True)
class Position:
    subject_id: str
    topic: str
    utterance_id: str
    said_on: date
    channel: str
    stance_summary: str
    embedding: Sequence[float]


class CongruenceStage(Protocol):
    def index(self, e: VerdictEligible, topic: str) -> Position:
        """Add a position to the pre-built index. Realtime congruence depends
        on this being precomputed — the live query is a lookup, not a search."""
        ...

    def compare(self, subject_id: str, topic: str) -> "CongruenceFinding":
        """Compare a subject against themselves across channels and time.

        Must distinguish EMPHASIS_SHIFT (different priorities for different
        audiences — normal) and EVOLVED (changed and said so — a virtue) from
        genuine INCONGRUENT. CONTRADICTED_BY_RECORD requires a primary-record
        citation (document + page) naming the vote.
        """
        ...


@dataclass(frozen=True)
class CongruenceFinding:
    subject_id: str
    topic: str
    value: Congruence
    summary: str
    voter_meaning: str
    said: Sequence[Utterance]
    did: Sequence[dict]        # vote rows
    adversary_ran: bool
    reply_id: Optional[str] = None


# ─────────────────────────── publish ───────────────────────────

class PublishError(RuntimeError):
    pass


class PublishStage(Protocol):
    def publish(self, title: str, body_md: str,
                findings: Sequence[VerdictRecord | CongruenceFinding],
                editor: str) -> str:
        """Blocks unless every finding carries a right-of-reply record.

        Enforced again at the database layer (publication_reply_gate trigger) so
        neither path can be bypassed. Right of reply is a pipeline stage, not a
        courtesy.
        """
        ...
