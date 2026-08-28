-- LaPorte / Microsoft — first real data load.
-- Every row here traces to a sealed artifact: council minutes (document+page) or the
-- ITIA panel recording (media+timestamp). Nothing invented, nothing rounded.
BEGIN;

-- ── subjects ────────────────────────────────────────────────────────────────
INSERT INTO subject (id, kind, display_name, jurisdiction, disambiguators) VALUES
 ('11111111-0000-0000-0000-000000000001','org','Microsoft Corporation','US',
  '{"entity_on_record":"Microsoft Corporation, Attn. Americas Land Acquisition","note":"no LLC shell or codename used in LaPorte records"}'),
 ('11111111-0000-0000-0000-000000000002','person','Tom Dermody','US-IN-LaPorte','{"office":"Mayor, City of La Porte"}'),
 ('11111111-0000-0000-0000-000000000003','person','Cloteal LaBroi','US','{"employer":"Microsoft","title":"Director of Infrastructure and Government Affairs"}'),
 ('11111111-0000-0000-0000-000000000004','org','City of La Porte','US-IN-LaPorte','{}'),
 ('11111111-0000-0000-0000-000000000005','org','La Porte Community School Corporation','US-IN-LaPorte','{}');

INSERT INTO role_tenure (subject_id, office, jurisdiction, started_on, ended_on, source_ref) VALUES
 ('11111111-0000-0000-0000-000000000002','Mayor, City of La Porte','US-IN-LaPorte','2024-01-01',NULL,
  'City of La Porte council minutes 2024-06-03 through 2026-06-01; ITIA panel 2026-08-27 @0:29:24');

-- ── project ─────────────────────────────────────────────────────────────────
INSERT INTO project (id, slug, display_name, kind, jurisdiction, operator_id, status, announced_on, site_desc) VALUES
 ('22222222-0000-0000-0000-000000000001','microsoft-laporte','Microsoft LaPorte Data Center Campus',
  'data-center','US-IN-LaPorte','11111111-0000-0000-0000-000000000001','under-construction','2024-06-04',
  'Boyd Boulevard / Radius Industrial Park, 489 acres phase 1, plus Pleasant Township annexation. Groundbreaking 2026-06-17.');

-- ── artifacts (sealed sources) ──────────────────────────────────────────────
INSERT INTO artifact (id, kind, source_url, resolved_url, captured_at, sha256, mime, storage_uri, jurisdiction_scope, meta) VALUES
 ('33333333-0000-0000-0000-000000000001','media',
  'attendee recording, 2026 ITIA Summit, Fishers IN','local',
  '2026-08-27T10:47:00-04:00','c75c7e266efdf803a11f6ec35362740b677691a4f77a6e64f3dbdddd90bd9e44','audio/mpeg',
  'research/laporte-microsoft/evidence/recordings/itia__0827_1047.mp3',
  'Public ticketed industry conference, on-record panel',
  '{"event":"2026 ITIA Summit","panel":"Data Center Development that Works for Hoosier Communities","duration_s":2811,"speaker_confirmed_pct":97}'),
 ('33333333-0000-0000-0000-000000000002','document',
  'https://www.cityoflaporte.com/uploads/minutes/m_1937_Council-May.18-2026-Minutes.docx',
  'https://www.cityoflaporte.com/uploads/minutes/m_1937_Council-May.18-2026-Minutes.docx',
  '2026-08-28T00:00:00-04:00','PENDING_SEAL_council_2026-05-18','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'pending','City of La Porte official minutes','{"body":"La Porte Common Council","met_on":"2026-05-18"}'),
 ('33333333-0000-0000-0000-000000000003','webpage',
  'https://www.cityoflaporte.com/news/microsoft-dermody-eupdate-tax-agreement-to-include-historic-funding-for-la-porte-schools',
  'https://www.cityoflaporte.com/news/microsoft-dermody-eupdate-tax-agreement-to-include-historic-funding-for-la-porte-schools',
  '2026-08-28T00:00:00-04:00','PENDING_SEAL_city_release_2026-03-03','text/html','pending',
  'City of La Porte official release','{"published":"2026-03-03"}');

-- ── utterances: the five Microsoft commitments, spoken on the record ─────────
-- speaker CONFIRMED via two independent anchors; mode = assertion. Both gates pass.
INSERT INTO utterance (id, artifact_id, said_on, channel, audience, text, anchor,
                       speaker_id, speaker_conf, speaker_basis, mode, mode_basis) VALUES
 ('44444444-0000-0000-0000-000000000001','33333333-0000-0000-0000-000000000001','2026-08-27','conference-panel',
  'ITIA Summit attendees (Indiana technology industry, legislators, press)',
  'we are going to pay for our energy and our infrastructure. So that would not come on the residents. Residents would not have high electricity bills because of our base and consumption usage.',
  '0:14:13','11111111-0000-0000-0000-000000000003','confirmed',
  'Answers moderator''s Microsoft site-selection question @0:33:28; speaks in Microsoft first person @0:25:22','assertion',
  'Direct enumerated commitment, no hedging or hypothetical framing'),
 ('44444444-0000-0000-0000-000000000002','33333333-0000-0000-0000-000000000001','2026-08-27','conference-panel',
  'ITIA Summit attendees',
  'we''re going to minimize our water usage and we''re going to replenish more water than we actually use',
  '0:14:23','11111111-0000-0000-0000-000000000003','confirmed','same as 0:14:13','assertion','Direct enumerated commitment'),
 ('44444444-0000-0000-0000-000000000003','33333333-0000-0000-0000-000000000001','2026-08-27','conference-panel',
  'ITIA Summit attendees',
  'we don''t want to take a tax abatement. So that tax revenue is actually going back to [LaPorte]. So they can use that revenue for their hospitals or schools. Public safety, anything that they feel is important to the community.',
  '0:14:29','11111111-0000-0000-0000-000000000003','confirmed','same as 0:14:13','assertion','Direct enumerated commitment'),
 ('44444444-0000-0000-0000-000000000004','33333333-0000-0000-0000-000000000001','2026-08-27','conference-panel',
  'ITIA Summit attendees',
  'we are looking at student workers in the labor in [LaPorte]. And we wanted to make sure that we use workers and labor from the community.',
  '0:14:43','11111111-0000-0000-0000-000000000003','confirmed','same as 0:14:13','assertion','Direct enumerated commitment'),
 ('44444444-0000-0000-0000-000000000005','33333333-0000-0000-0000-000000000001','2026-08-27','conference-panel',
  'ITIA Summit attendees',
  'we wanted to just educate folks on AI infrastructure. We wanted to invest in those nonprofits in the communities and organizations that the community actually cared about.',
  '0:14:53','11111111-0000-0000-0000-000000000003','confirmed','same as 0:14:13','assertion','Direct enumerated commitment'),
 -- the mayor's congruence anchor
 ('44444444-0000-0000-0000-000000000006','33333333-0000-0000-0000-000000000001','2026-08-27','conference-panel',
  'ITIA Summit attendees','Now we gave 15% direct to our school system.','0:17:47',
  '11111111-0000-0000-0000-000000000002','confirmed',
  'Answers moderator direct address "So, Mayor..." @0:29:24; speaks as city executive; cites city population ~22,000 @0:43:50','assertion',
  'Statement of completed fact about the executed agreement');

-- ── claims ──────────────────────────────────────────────────────────────────
INSERT INTO claim (id, utterance_id, subject_id, atomic_text, topic, checkworthy) VALUES
 ('55555555-0000-0000-0000-000000000001','44444444-0000-0000-0000-000000000001','11111111-0000-0000-0000-000000000001',
  'Microsoft will pay the full cost of its energy and infrastructure so that LaPorte residents do not face higher electricity bills as a result of the data center.','electricity',0.95),
 ('55555555-0000-0000-0000-000000000002','44444444-0000-0000-0000-000000000002','11111111-0000-0000-0000-000000000001',
  'Microsoft will replenish more water than the LaPorte data center consumes.','water',0.97),
 ('55555555-0000-0000-0000-000000000003','44444444-0000-0000-0000-000000000003','11111111-0000-0000-0000-000000000001',
  'Microsoft will not take a tax abatement for the LaPorte data center.','taxes',0.93),
 ('55555555-0000-0000-0000-000000000004','44444444-0000-0000-0000-000000000004','11111111-0000-0000-0000-000000000001',
  'Microsoft will use workers and labor from the LaPorte community.','jobs',0.80),
 ('55555555-0000-0000-0000-000000000005','44444444-0000-0000-0000-000000000005','11111111-0000-0000-0000-000000000001',
  'Microsoft will invest in LaPorte-area nonprofits and community organizations.','community',0.72),
 ('55555555-0000-0000-0000-000000000006','44444444-0000-0000-0000-000000000006','11111111-0000-0000-0000-000000000002',
  'The City of La Porte directs 15% of Microsoft property-tax revenue to the school system.','taxes',0.90);

-- ── commitments (thermometer rows) ──────────────────────────────────────────
INSERT INTO commitment (project_id, claim_id, promisor_id, kind, metric_label,
                        target_value, target_unit, geography, promised_on, deadline_on, deadline_stated, conditions) VALUES
 ('22222222-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000001','11111111-0000-0000-0000-000000000001',
  'power_mw','Residential electricity bills not increased by data center load',NULL,'rate impact','La Porte County','2026-08-27',NULL,false,
  'Stated as a national policy commitment announced January 2026; no LaPorte-specific date or metric given'),
 ('22222222-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000002','11111111-0000-0000-0000-000000000001',
  'water_gpd','Water replenished vs water consumed (water positive)',100,'percent of consumption','La Porte County','2026-08-27',NULL,false,
  'No baseline consumption figure has ever been published for this site'),
 ('22222222-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000003','11111111-0000-0000-0000-000000000001',
  'tax_abatement_usd','Tax abatement sought',0,'USD','City of La Porte','2026-08-27',NULL,false,
  'Corroborated by the 2026-03-03 rescission of the 2024 taxpayer agreement'),
 ('22222222-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000004','11111111-0000-0000-0000-000000000001',
  'local_hire_pct','Local workers and labor',NULL,'percent','La Porte County','2026-08-27',NULL,false,
  'No local-hire percentage or definition of "community" stated'),
 ('22222222-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000005','11111111-0000-0000-0000-000000000001',
  'community_benefit','Investment in local nonprofits',NULL,'USD','La Porte County','2026-08-27',NULL,false,
  'No amount or named recipients stated'),
 -- from the primary council record, not the panel
 ('22222222-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000006','11111111-0000-0000-0000-000000000001',
  'community_benefit','Share of Microsoft property-tax revenue to La Porte schools',15,'percent','City of La Porte','2026-03-03','2048-12-31',true,
  '20-year term per the 2026-03-03 agreement');

COMMIT;
