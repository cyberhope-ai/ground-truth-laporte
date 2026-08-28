-- PCOS Veritas Engine — Promise Ledger (v1)
-- Extends 001_core.sql with the TEMPORAL accountability axis.
--
-- WHY THIS EXISTS
-- 001_core answers "is this statement true *now*?" That is the wrong question for
-- infrastructure projects, where nearly every public statement is a promise about
-- the future: jobs, tax revenue, water use, megawatts, road improvements.
-- A promise is not false when made. It becomes true or false LATER.
--
-- So: CLAIM (what was said) -> COMMITMENT (measurable, with a deadline)
--     -> OUTCOME (what independently happened) -> a status anyone can audit.
--
-- Design rule: an OUTCOME may never be authored by the promising party alone.
-- Its evidence must come from an independent tier-1/2 source.

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. PROJECTS  (the object the public actually cares about)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE project (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           text NOT NULL UNIQUE,          -- 'microsoft-laporte'
  display_name   text NOT NULL,
  kind           text NOT NULL,                 -- 'data-center','manufacturing','school'
  jurisdiction   text NOT NULL,                 -- 'US-IN-LaPorte'
  operator_id    uuid REFERENCES subject(id),   -- the org running it
  -- Data-center projects are routinely announced under an LLC shell and later
  -- revealed. Aliases are first-class so the historical record stays connected.
  aliases        text[] NOT NULL DEFAULT '{}',  -- {'Project Bumblebee','XYZ Holdings LLC'}
  status         text NOT NULL DEFAULT 'announced'
                 CHECK (status IN ('rumored','announced','approved','under-construction',
                                   'operating','paused','cancelled')),
  announced_on   date,
  site_desc      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN project.aliases IS
  'Shell-company and codename history. Without this, promises made under the
   codename detach from the operator once the real name is revealed.';

-- ─────────────────────────────────────────────────────────────
-- 2. COMMITMENTS  (a claim that is measurable and dated)
-- ─────────────────────────────────────────────────────────────

CREATE TYPE commitment_kind AS ENUM (
  'jobs_permanent',      -- ALWAYS distinguish from construction jobs; the #1 conflation
  'jobs_construction',
  'investment_usd',
  'tax_revenue_usd',
  'tax_abatement_usd',   -- what the public GIVES UP — belongs in the ledger too
  'pilot_payment_usd',   -- payment in lieu of taxes
  'water_gpd',
  'power_mw',
  'renewable_pct',
  'local_hire_pct',
  'training_seats',
  'infrastructure',      -- roads, sewer, fiber
  'community_benefit',
  'other'
);

CREATE TYPE commitment_status AS ENUM (
  'open',                -- deadline in the future, no outcome yet
  'on_track',
  'met',
  'partially_met',
  'missed',
  'superseded',          -- renegotiated; the original stays in the record
  'unverifiable',        -- no independent measurement exists (a finding in itself)
  'withdrawn'
);

CREATE TABLE commitment (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id     uuid REFERENCES project(id),
  claim_id       uuid NOT NULL REFERENCES claim(id),   -- the sourced statement
  promisor_id    uuid NOT NULL REFERENCES subject(id), -- who is on the hook
  kind           commitment_kind NOT NULL,
  metric_label   text NOT NULL,                        -- 'permanent full-time positions'
  target_value   numeric,                              -- 600
  target_unit    text,                                 -- 'jobs','USD','gal/day','MW'
  target_low     numeric,                              -- ranges: "500 to 700"
  target_high    numeric,
  geography      text,                                 -- 'La Porte County'
  promised_on    date NOT NULL,
  deadline_on    date,                                 -- NULL = no date given
  deadline_stated boolean NOT NULL DEFAULT false,      -- did they actually give one?
  conditions     text,                                 -- "if phase 2 proceeds"
  status         commitment_status NOT NULL DEFAULT 'open',
  supersedes_id  uuid REFERENCES commitment(id),
  seal_id        text,
  seal_hash      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN commitment.deadline_stated IS
  'FALSE means no date was ever given. Publish that as its own finding — an
   undated promise cannot be missed, which is often the point.';
COMMENT ON COLUMN commitment.kind IS
  'jobs_permanent vs jobs_construction is the most commonly blurred distinction
   in economic-development announcements. Never merge them.';

-- ─────────────────────────────────────────────────────────────
-- 3. OUTCOMES  (what independently happened)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE outcome (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  commitment_id  uuid NOT NULL REFERENCES commitment(id),
  observed_value numeric,
  observed_unit  text,
  as_of          date NOT NULL,
  artifact_id    uuid NOT NULL REFERENCES artifact(id),  -- sealed source, mandatory
  source_tier    int NOT NULL CHECK (source_tier BETWEEN 1 AND 5),
  authored_by_promisor boolean NOT NULL DEFAULT false,
  method         text NOT NULL,      -- 'state employment report','utility filing','FOIA'
  caveat         text,               -- scope limits of the measurement
  seal_id        text,
  seal_hash      text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  -- An outcome from the promising party is not independent verification.
  CONSTRAINT independent_or_flagged CHECK (
    authored_by_promisor = false OR source_tier >= 2
  )
);
COMMENT ON TABLE outcome IS
  'Self-reported numbers are recorded but flagged. A commitment can only reach
   status=met on the strength of an independent (tier 1-2, not promisor-authored)
   outcome. Enforced in commitment_status_for().';

-- Deterministic status computation. Same inputs -> same status, always.
CREATE OR REPLACE FUNCTION commitment_status_for(p_commitment uuid, p_asof date)
RETURNS commitment_status LANGUAGE plpgsql STABLE AS $$
DECLARE
  c commitment%ROWTYPE;
  best numeric;
  independent boolean;
BEGIN
  SELECT * INTO c FROM commitment WHERE id = p_commitment;
  IF c.status IN ('superseded','withdrawn') THEN RETURN c.status; END IF;

  SELECT o.observed_value,
         (o.authored_by_promisor = false AND o.source_tier <= 2)
    INTO best, independent
    FROM outcome o
   WHERE o.commitment_id = p_commitment AND o.as_of <= p_asof
   ORDER BY o.as_of DESC, o.source_tier ASC
   LIMIT 1;

  IF best IS NULL THEN
    IF c.deadline_on IS NOT NULL AND p_asof > c.deadline_on THEN
      RETURN 'unverifiable';   -- deadline passed with nothing measurable
    END IF;
    RETURN 'open';
  END IF;

  IF NOT independent THEN RETURN 'unverifiable'; END IF;
  IF c.target_value IS NULL THEN RETURN 'open'; END IF;

  IF best >= c.target_value THEN RETURN 'met';
  ELSIF c.deadline_on IS NULL OR p_asof <= c.deadline_on THEN
    RETURN CASE WHEN best >= c.target_value * 0.8 THEN 'on_track' ELSE 'open' END;
  ELSIF best >= c.target_value * 0.8 THEN RETURN 'partially_met';
  ELSE RETURN 'missed';
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 4. SUBMISSIONS  (public evidence intake, quarantined by default)
-- ─────────────────────────────────────────────────────────────

CREATE TYPE authenticity AS ENUM (
  'authenticated','likely_authentic','insufficient_information',
  'questionable','manipulated','source_not_confirmed'
);

CREATE TABLE submission (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_ref   text,                    -- pseudonymous by default
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  original_url    text,
  original_filename text,
  artifact_id     uuid REFERENCES artifact(id),
  claimed_date    date,
  claimed_location text,
  claimed_org     text,
  statement       text,                    -- "this is where they promised 500 jobs"
  authenticity    authenticity NOT NULL DEFAULT 'insufficient_information',
  authenticity_notes text,
  released_at     timestamptz,             -- NULL = still quarantined
  rejected_at     timestamptz,
  rejection_reason text,
  raw_purged_at   timestamptz              -- retention policy applied
);
COMMENT ON COLUMN submission.statement IS
  'The submitter''s statement is a HYPOTHESIS to investigate, never evidence.
   It must never be published as a finding.';
COMMENT ON COLUMN submission.released_at IS
  'Quarantine is the default. Nothing submitted becomes public without passing
   authenticity review. Rejected items keep hash + timestamp + reason for
   repeat-manipulation detection even after the raw file is purged.';

-- ─────────────────────────────────────────────────────────────
-- 5. VERIFICATION RECORDS  (versioned, never overwritten)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE verification_record (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_type    text NOT NULL CHECK (object_type IN
                   ('claim','evidence','commitment','outcome','submission','project')),
  object_id      uuid NOT NULL,
  version        int NOT NULL,
  method         text NOT NULL,
  agent_kind     text NOT NULL CHECK (agent_kind IN
                   ('ai','human','government_source','independent_source')),
  agent_ref      text NOT NULL,            -- model+version, or the reviewer
  sources_used   uuid[] NOT NULL DEFAULT '{}',   -- artifact ids
  confidence     numeric CHECK (confidence BETWEEN 0 AND 1),
  finding        text NOT NULL,
  reasoning      text NOT NULL,
  contradictory  uuid[] NOT NULL DEFAULT '{}',   -- evidence that cuts the other way
  model_version  text,
  policy_version text NOT NULL,
  inputs_hash    text NOT NULL,
  verified_at    timestamptz NOT NULL DEFAULT now(),
  seal_id        text,
  seal_hash      text,
  UNIQUE (object_type, object_id, version)
);
COMMENT ON TABLE verification_record IS
  'Never "claim.verified = true". A finding at 82% confidence today may become
   98% in six months on new evidence — as a NEW VERSION, without rewriting
   history. The public sees the current version; the chain stays inspectable.';

CREATE VIEW verification_current AS
SELECT DISTINCT ON (object_type, object_id) *
  FROM verification_record
 ORDER BY object_type, object_id, version DESC;

-- ─────────────────────────────────────────────────────────────
-- 6. THE PUBLIC LEDGER VIEW  ("show me the receipts")
-- ─────────────────────────────────────────────────────────────

CREATE VIEW promise_ledger AS
SELECT
  p.slug                         AS project,
  s.display_name                 AS promisor,
  c.kind,
  c.metric_label,
  c.target_value,
  c.target_unit,
  c.promised_on,
  c.deadline_on,
  c.deadline_stated,
  commitment_status_for(c.id, CURRENT_DATE) AS status,
  (SELECT o.observed_value FROM outcome o
    WHERE o.commitment_id = c.id AND o.authored_by_promisor = false
    ORDER BY o.as_of DESC LIMIT 1)          AS independent_observed,
  (SELECT o.as_of FROM outcome o
    WHERE o.commitment_id = c.id AND o.authored_by_promisor = false
    ORDER BY o.as_of DESC LIMIT 1)          AS observed_as_of,
  c.claim_id,                                -- -> utterance -> artifact -> receipts
  c.id                                       AS commitment_id
FROM commitment c
JOIN subject s ON s.id = c.promisor_id
LEFT JOIN project p ON p.id = c.project_id;

COMMIT;
