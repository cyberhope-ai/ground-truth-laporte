-- Fix: publication_finding could not actually be inserted.
--
-- 001_core declared PRIMARY KEY (publication_id, verdict_id, congruence_id). Primary-key
-- columns are implicitly NOT NULL, so a row was required to carry BOTH a verdict and a
-- congruence finding — while the design intent is EITHER/OR. Every insert failed.
--
-- Found by loading the schema and attempting a real publication, not by reading it.

BEGIN;

ALTER TABLE publication_finding DROP CONSTRAINT publication_finding_pkey;

ALTER TABLE publication_finding
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4();

ALTER TABLE publication_finding
  ADD CONSTRAINT exactly_one_finding CHECK (
    (verdict_id IS NOT NULL AND congruence_id IS NULL) OR
    (verdict_id IS NULL AND congruence_id IS NOT NULL)
  );

-- keep the de-duplication the composite key was providing
CREATE UNIQUE INDEX publication_verdict_uniq
  ON publication_finding (publication_id, verdict_id) WHERE verdict_id IS NOT NULL;
CREATE UNIQUE INDEX publication_congruence_uniq
  ON publication_finding (publication_id, congruence_id) WHERE congruence_id IS NOT NULL;

COMMIT;

-- Dropping the composite PK does NOT remove the implicit NOT NULL it created on its columns.
-- Both must be dropped explicitly or the either/or CHECK can never be satisfied.
BEGIN;
ALTER TABLE publication_finding ALTER COLUMN verdict_id    DROP NOT NULL;
ALTER TABLE publication_finding ALTER COLUMN congruence_id DROP NOT NULL;
COMMIT;
