-- Rate limits: track per-user action rates
CREATE TABLE public.rate_limits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type     TEXT NOT NULL CHECK (action_type IN ('evaluation', 'submission', 'ai_call')),
  window_start    TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now()),
  count           INTEGER NOT NULL DEFAULT 1,

  UNIQUE(user_id, action_type, window_start)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(user_id, action_type, window_start);

-- Duplicate detection hashes
CREATE TABLE public.duplicate_hashes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id         UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  content_hash    TEXT NOT NULL,
  similarity_group UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_duplicate_hashes_hash ON duplicate_hashes(content_hash);
