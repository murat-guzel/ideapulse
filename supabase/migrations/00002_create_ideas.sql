-- Ideas table: core idea submissions
CREATE TABLE public.ideas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'closed', 'moderation_review', 'rejected')),

  -- Idea content
  title             TEXT NOT NULL CHECK (char_length(title) BETWEEN 10 AND 120),
  problem           TEXT NOT NULL CHECK (char_length(problem) BETWEEN 50 AND 1000),
  target_user       TEXT NOT NULL CHECK (char_length(target_user) BETWEEN 20 AND 500),
  solution          TEXT NOT NULL CHECK (char_length(solution) BETWEEN 50 AND 1000),
  monetization      TEXT NOT NULL CHECK (char_length(monetization) BETWEEN 20 AND 500),
  industry          TEXT NOT NULL,

  -- AI-generated
  ai_summary        TEXT,
  ai_themes         JSONB,

  -- Scores (denormalized, updated by cron)
  score_problem     NUMERIC(5,2),
  score_payment     NUMERIC(5,2),
  score_differ      NUMERIC(5,2),
  score_overall     NUMERIC(5,2),
  evaluation_count  INTEGER NOT NULL DEFAULT 0,

  -- Lifecycle
  goes_live_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '48 hours'),
  closed_at         TIMESTAMPTZ,

  -- Moderation
  moderation_flag   BOOLEAN NOT NULL DEFAULT FALSE,
  moderation_note   TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_expires_at ON ideas(expires_at) WHERE status = 'active';
CREATE INDEX idx_ideas_author ON ideas(author_id);
CREATE INDEX idx_ideas_industry ON ideas(industry);
