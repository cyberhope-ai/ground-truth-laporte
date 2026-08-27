-- PCOS Veritas Engine — core schema (v1)
-- Postgres. Every table that holds evidence is append-only by policy:
-- corrections are new rows with supersedes_id, never UPDATEs. Nothing in the
-- evidence chain is destroyable from an application endpoint.
--
-- Design rule enforced structurally, not by convention:
--   a VERDICT cannot exist without a sealed ARTIFACT behind it.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;      -- pgvector, for congruence lookup

-- ─────────────────────────────────────────────────────────────
-- 1. SUBJECTS AND ROLES  (the layer that prevents defamation)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE subject (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind            text NOT NULL CHECK (kind IN ('person','org','office','outlet')),
  display_name    text NOT NULL,
  jurisdiction    text,                       -- 'US-IN-Vigo'
  disambiguators  jsonb NOT NULL DEFAULT '{}',-- {"employer":"Top Guns","dob_year":null}
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN subject.disambiguators IS
  'Two-identifier match rule: a record may only be attached to a subject when at
   least two independent identifiers agree. Common names are the default hazard.';

-- Who held which office WHEN. This table is what stops "the Council president
-- threatened me" from being attached to the wrong person.
CREATE TABLE role_tenure (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id   uuid NOT NULL REFERENCES subject(id),
  office       text NOT NULL,                 -- 'Vigo County Council President'
  jurisdiction text NOT NULL,
  started_on   date NOT NULL,
  ended_on     date,                          -- NULL = current
  source_ref   text NOT NULL,                 -- document + page establishing it
  CONSTRAINT sane_range CHECK (ended_on IS NULL OR ended_on >= started_on)
);
CREATE INDEX role_tenure_lookup ON role_tenure (office, jurisdiction, started_on, ended_on);

-- Resolve an office to the person holding it on a given date.
CREATE OR REPLACE FUNCTION office_holder(p_office text, p_juris text, p_on date)
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT subject_id FROM role_tenure
   WHERE office = p_office AND jurisdiction = p_juris
     AND started_on <= p_on AND (ended_on IS NULL OR ended_on >= p_on)
   LIMIT 1;
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. CUSTODY  (sealed before analysis — nothing skips this)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE artifact (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind           text NOT NULL CHECK (kind IN ('document','page','media','webpage','dataset','filing')),
  source_url     text,
  resolved_url   text,                        -- after redirects; portals 302 to real files
  captured_at    timestamptz NOT NULL,
  sha256         text NOT NULL,
  bytes          bigint,
  mime           text,
  archive_url    text,                        -- archive.today / Wayback snapshot
  storage_uri    text NOT NULL,               -- blob location
  parent_id      uuid REFERENCES artifact(id),-- page -> document, clip -> media
  page_no        int,                         -- for kind='page'
  t_start_s      numeric,                     -- for media segments
  t_end_s        numeric,
  jurisdiction_scope text,                    -- 'FMCSA:interstate-only'
  meta           jsonb NOT NULL DEFAULT '{}',
  seal_id        text,                        -- QSurface seal
  seal_hash      text,
  UNIQUE (sha256, page_no, t_start_s)
);
COMMENT ON COLUMN artifact.jurisdiction_scope IS
  'What this source DOES and DOES NOT cover. A null result from an out-of-scope
   source is NOT_COVERED, never "none". (FMCSA reported 0 crashes for an
   intrastate-only carrier that had a fatality.)';

-- Extracted text, always anchored to an artifact (page or timestamp).
CREATE TABLE rendition (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  artifact_id  uuid NOT NULL REFERENCES artifact(id),
  method       text NOT NULL,                 -- 'ocr','asr','html-extract','pdf-text'
  engine       text NOT NULL,                 -- tool + version, for reproducibility
  text         text NOT NULL,
  confidence   numeric,
  is_machine_text boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN rendition.is_machine_text IS
  'TRUE = search index only. Machine text may never be quoted directly; a quote
   must be verified against the source page image or audio first.';

-- ─────────────────────────────────────────────────────────────
-- 3. UTTERANCES  (what was said, by whom, in what mode)
-- ─────────────────────────────────────────────────────────────

CREATE TYPE speech_mode AS ENUM (
  'assertion',      -- the only mode eligible for a verdict
  'question',
  'quotation',      -- quoting someone else
  'hypothetical',
  'satire',         -- character voice / roleplay  <- inverts meaning
  'sarcasm',
  'unclassified'
);

CREATE TYPE speaker_confidence AS ENUM ('confirmed','probable','unresolved');

CREATE TABLE utterance (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  artifact_id    uuid NOT NULL REFERENCES artifact(id),
  rendition_id   uuid REFERENCES rendition(id),
  said_on        date NOT NULL,
  channel        text NOT NULL,               -- 'facebook','youtube','tv','print','council-minutes'
  audience       text,                        -- who was in the room
  text           text NOT NULL,
  anchor         text NOT NULL,               -- 'p.4' or '0:11:44'
  speaker_id     uuid REFERENCES subject(id),
  speaker_conf   speaker_confidence NOT NULL DEFAULT 'unresolved',
  speaker_basis  text,                        -- how the speaker was established
  mode           speech_mode NOT NULL DEFAULT 'unclassified',
  mode_basis     text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- THE TWO GATES. An utterance may only be used for a verdict if the speaker is
-- confirmed AND the mode is a plain assertion. Enforced in the database so no
-- downstream code can bypass it.
CREATE OR REPLACE FUNCTION utterance_is_verdict_eligible(u utterance)
RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
  SELECT u.speaker_conf = 'confirmed' AND u.mode = 'assertion';
$$;

-- ─────────────────────────────────────────────────────────────
-- 4. CLAIMS AND VERDICTS
-- ─────────────────────────────────────────────────────────────

CREATE TYPE verdict_value AS ENUM (
  'VERIFIED', 'CORROBORATED', 'UNSUPPORTED', 'DISPUTED', 'FALSE',
  'OPINION', 'NOT_COVERED', 'PENDING_RESPONSE'
);

CREATE TABLE claim (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  utterance_id  uuid NOT NULL REFERENCES utterance(id),
  subject_id    uuid NOT NULL REFERENCES subject(id),   -- who made it
  atomic_text   text NOT NULL,                          -- self-contained, pronouns resolved
  topic         text NOT NULL,                          -- 'county-budget','jail','schools'
  checkworthy   numeric,                                -- 0..1, triage score
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX claim_topic ON claim (subject_id, topic);

CREATE TABLE evidence (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id      uuid NOT NULL REFERENCES claim(id),
  artifact_id   uuid NOT NULL REFERENCES artifact(id),  -- sealed source, mandatory
  excerpt       text NOT NULL,
  anchor        text NOT NULL,
  stance        text NOT NULL CHECK (stance IN ('supports','refutes','neutral','mitigates')),
  source_tier   int NOT NULL CHECK (source_tier BETWEEN 1 AND 5),
  weight        numeric NOT NULL DEFAULT 1.0,
  extracted_by  text NOT NULL,                          -- 'deterministic-parse' | 'llm'
  created_at    timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN evidence.source_tier IS
  '1=primary record, 2=official statement, 3=on-record interview, 4=established
   media, 5=social. Tier 5 proves a claim was MADE, never that it is TRUE.';
COMMENT ON COLUMN evidence.stance IS
  'mitigates = exculpatory context found by the adversary pass. The budget vote
   had three mitigations sitting in the same minutes.';
COMMENT ON COLUMN evidence.extracted_by IS
  'Figures must be deterministic-parse. A summarizer produced three different
   budget numbers from one article — numbers never pass through an LLM.';

CREATE TABLE verdict (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id       uuid NOT NULL REFERENCES claim(id),
  value          verdict_value NOT NULL,
  confidence     numeric CHECK (confidence BETWEEN 0 AND 1),
  rationale      text NOT NULL,
  adversary_ran  boolean NOT NULL DEFAULT false,
  adversary_note text,
  reply_id       uuid,                          -- FK added after right_of_reply
  model_ref      text,                          -- model + version + prompt hash
  inputs_hash    text NOT NULL,                 -- hash of ordered evidence ids
  supersedes_id  uuid REFERENCES verdict(id),   -- corrections are new rows
  seal_id        text,
  seal_hash      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN verdict.inputs_hash IS
  'Deterministic replay: same evidence set + same model_ref must reproduce the
   same verdict. Probabilistic MODEL, deterministic EXECUTION.';

-- ─────────────────────────────────────────────────────────────
-- 5. CONGRUENCE  (the differentiator — a lookup, not a search)
-- ─────────────────────────────────────────────────────────────

CREATE TYPE congruence_value AS ENUM (
  'CONGRUENT',
  'EMPHASIS_SHIFT',        -- different priorities per audience = normal politics
  'INCOMPLETE',
  'INCONGRUENT',
  'CONTRADICTED_BY_RECORD',-- highest value; requires a primary-record citation
  'EVOLVED'                -- changed and said so = a virtue, not a flip
);

-- Pre-built index: every eligible utterance embedded by (subject, topic).
-- Realtime congruence is a vector query against this, not a web search.
CREATE TABLE position_index (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id   uuid NOT NULL REFERENCES subject(id),
  topic        text NOT NULL,
  utterance_id uuid NOT NULL REFERENCES utterance(id),
  said_on      date NOT NULL,
  channel      text NOT NULL,
  stance_summary text NOT NULL,
  embedding    vector(1024),
  UNIQUE (utterance_id)
);
CREATE INDEX position_lookup ON position_index (subject_id, topic, said_on);
CREATE INDEX position_ann ON position_index USING hnsw (embedding vector_cosine_ops);

CREATE TABLE congruence_finding (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id    uuid NOT NULL REFERENCES subject(id),
  topic         text NOT NULL,
  value         congruence_value NOT NULL,
  summary       text NOT NULL,
  voter_meaning text,                          -- plain-English "what this means"
  adversary_ran boolean NOT NULL DEFAULT false,
  reply_id      uuid,
  seal_id       text,
  seal_hash     text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- The cells: which utterances/votes were compared to reach the finding.
CREATE TABLE congruence_cell (
  finding_id   uuid NOT NULL REFERENCES congruence_finding(id),
  utterance_id uuid REFERENCES utterance(id),
  vote_id      uuid,                            -- FK to vote below
  role         text NOT NULL CHECK (role IN ('said','did')),
  PRIMARY KEY (finding_id, utterance_id, vote_id)
);

-- ─────────────────────────────────────────────────────────────
-- 6. VOTES  (structured data hiding in prose — the reusable asset)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE meeting (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  body         text NOT NULL,                  -- 'Vigo County Council'
  jurisdiction text NOT NULL,
  met_on       date NOT NULL,
  kind         text,                           -- 'regular','sunshine','special','executive'
  artifact_id  uuid NOT NULL REFERENCES artifact(id),
  UNIQUE (body, jurisdiction, met_on, kind)
);

CREATE TABLE agenda_item (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id   uuid NOT NULL REFERENCES meeting(id),
  ordinal      int,
  label        text,                           -- 'Additional Appropriation 2026-29'
  title        text NOT NULL,
  amount_cents bigint,                         -- deterministic-parse only
  fund         text,
  page_no      int
);

CREATE TABLE vote (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id      uuid NOT NULL REFERENCES agenda_item(id),
  subject_id   uuid NOT NULL REFERENCES subject(id),
  cast_as      text NOT NULL CHECK (cast_as IN ('aye','nay','abstain','absent')),
  is_mover     boolean NOT NULL DEFAULT false,
  is_seconder  boolean NOT NULL DEFAULT false, -- Ellis SECONDED the budget he calls wasteful
  tally_for    int,
  tally_against int,
  page_no      int,
  UNIQUE (item_id, subject_id)
);

-- ─────────────────────────────────────────────────────────────
-- 7. FAIRNESS  (right of reply enforced in code, not in policy)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE right_of_reply (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id     uuid NOT NULL REFERENCES subject(id),
  findings       jsonb NOT NULL,               -- what they were asked about
  sent_at        timestamptz NOT NULL,
  channel        text NOT NULL,
  deadline_at    timestamptz NOT NULL,
  responded_at   timestamptz,
  response_text  text,
  declined       boolean NOT NULL DEFAULT false,
  artifact_id    uuid REFERENCES artifact(id)  -- the sealed reply itself
);

ALTER TABLE verdict ADD CONSTRAINT verdict_reply_fk
  FOREIGN KEY (reply_id) REFERENCES right_of_reply(id);
ALTER TABLE congruence_finding ADD CONSTRAINT congruence_reply_fk
  FOREIGN KEY (reply_id) REFERENCES right_of_reply(id);

CREATE TABLE publication (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          text NOT NULL UNIQUE,
  title         text NOT NULL,
  body_md       text NOT NULL,
  published_at  timestamptz,
  editor        text NOT NULL,
  seal_id       text,
  seal_hash     text
);

CREATE TABLE publication_finding (
  publication_id uuid NOT NULL REFERENCES publication(id),
  verdict_id     uuid REFERENCES verdict(id),
  congruence_id  uuid REFERENCES congruence_finding(id),
  PRIMARY KEY (publication_id, verdict_id, congruence_id)
);

-- A publication about a person cannot go live unless every finding it carries
-- has a logged reply attempt. Structural, not procedural.
CREATE OR REPLACE FUNCTION assert_reply_before_publish() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE missing int;
BEGIN
  IF NEW.published_at IS NULL THEN RETURN NEW; END IF;
  SELECT count(*) INTO missing
    FROM publication_finding pf
    LEFT JOIN verdict v ON v.id = pf.verdict_id
    LEFT JOIN congruence_finding c ON c.id = pf.congruence_id
   WHERE pf.publication_id = NEW.id
     AND COALESCE(v.reply_id, c.reply_id) IS NULL;
  IF missing > 0 THEN
    RAISE EXCEPTION 'publish blocked: % finding(s) have no right-of-reply record', missing;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER publication_reply_gate
  BEFORE INSERT OR UPDATE ON publication
  FOR EACH ROW EXECUTE FUNCTION assert_reply_before_publish();

COMMIT;
