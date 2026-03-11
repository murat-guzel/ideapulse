-- Lower the evaluation requirement from 15 to 5
ALTER TABLE profiles DROP COLUMN can_submit;
ALTER TABLE profiles ADD COLUMN can_submit BOOLEAN GENERATED ALWAYS AS (evaluations_completed >= 5) STORED;
CREATE INDEX IF NOT EXISTS idx_profiles_can_submit ON profiles(can_submit) WHERE can_submit = TRUE;

-- Change idea lifetime from 48 hours to 24 hours
ALTER TABLE ideas ALTER COLUMN expires_at SET DEFAULT (now() + INTERVAL '24 hours');
