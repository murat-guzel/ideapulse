-- ============================================================
-- IdeaPulse: Combined Database Migration
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================

-- ==================== 1. PROFILES ====================
CREATE TABLE public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL,
  full_name             TEXT,
  role                  TEXT CHECK (role IN ('founder', 'validator', 'both')),
  industry              TEXT,
  experience_level      TEXT CHECK (experience_level IN ('student', 'junior', 'mid', 'senior', 'executive')),
  interests             TEXT[] DEFAULT '{}',
  evaluations_completed INTEGER NOT NULL DEFAULT 0,
  can_submit            BOOLEAN GENERATED ALWAYS AS (evaluations_completed >= 15) STORED,
  locale                TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'tr')),
  is_profile_complete   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_can_submit ON profiles(can_submit) WHERE can_submit = TRUE;
CREATE INDEX idx_profiles_industry ON profiles(industry);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== 2. IDEAS ====================
CREATE TABLE public.ideas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'closed', 'moderation_review', 'rejected')),
  title             TEXT NOT NULL CHECK (char_length(title) BETWEEN 10 AND 120),
  problem           TEXT NOT NULL CHECK (char_length(problem) BETWEEN 50 AND 1000),
  target_user       TEXT NOT NULL CHECK (char_length(target_user) BETWEEN 20 AND 500),
  solution          TEXT NOT NULL CHECK (char_length(solution) BETWEEN 50 AND 1000),
  monetization      TEXT NOT NULL CHECK (char_length(monetization) BETWEEN 20 AND 500),
  industry          TEXT NOT NULL,
  ai_summary        TEXT,
  ai_themes         JSONB,
  score_problem     NUMERIC(5,2),
  score_payment     NUMERIC(5,2),
  score_differ      NUMERIC(5,2),
  score_overall     NUMERIC(5,2),
  evaluation_count  INTEGER NOT NULL DEFAULT 0,
  goes_live_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '48 hours'),
  closed_at         TIMESTAMPTZ,
  moderation_flag   BOOLEAN NOT NULL DEFAULT FALSE,
  moderation_note   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_expires_at ON ideas(expires_at) WHERE status = 'active';
CREATE INDEX idx_ideas_author ON ideas(author_id);
CREATE INDEX idx_ideas_industry ON ideas(industry);

-- ==================== 3. EVALUATIONS ====================
CREATE TABLE public.evaluations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id                 UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  evaluator_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  q_problem_intensity     SMALLINT NOT NULL CHECK (q_problem_intensity BETWEEN 1 AND 5),
  q_would_pay             SMALLINT NOT NULL CHECK (q_would_pay BETWEEN 1 AND 5),
  q_differentiation       SMALLINT NOT NULL CHECK (q_differentiation BETWEEN 1 AND 5),
  q_overall_viability     SMALLINT NOT NULL CHECK (q_overall_viability BETWEEN 1 AND 5),
  comment                 TEXT CHECK (comment IS NULL OR char_length(comment) <= 500),
  evaluator_experience    TEXT NOT NULL,
  evaluator_industry      TEXT,
  industry_match          BOOLEAN NOT NULL DEFAULT FALSE,
  comment_flagged         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(idea_id, evaluator_id)
);

CREATE INDEX idx_evaluations_idea ON evaluations(idea_id);
CREATE INDEX idx_evaluations_evaluator ON evaluations(evaluator_id);

CREATE OR REPLACE FUNCTION public.increment_evaluation_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET evaluations_completed = evaluations_completed + 1,
      updated_at = now()
  WHERE id = NEW.evaluator_id;

  UPDATE public.ideas
  SET evaluation_count = evaluation_count + 1,
      updated_at = now()
  WHERE id = NEW.idea_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_evaluation_created
  AFTER INSERT ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION public.increment_evaluation_count();

-- ==================== 4. SUPPORT TABLES ====================
CREATE TABLE public.rate_limits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type     TEXT NOT NULL CHECK (action_type IN ('evaluation', 'submission', 'ai_call')),
  window_start    TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now()),
  count           INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, action_type, window_start)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(user_id, action_type, window_start);

CREATE TABLE public.duplicate_hashes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id         UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  content_hash    TEXT NOT NULL,
  similarity_group UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_duplicate_hashes_hash ON duplicate_hashes(content_hash);

-- ==================== 5. RLS POLICIES ====================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View active or own ideas"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (status = 'active' OR author_id = (SELECT auth.uid()));

CREATE POLICY "Qualified users can submit ideas"
  ON public.ideas FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = (SELECT auth.uid())
    AND (
      SELECT evaluations_completed FROM public.profiles
      WHERE id = (SELECT auth.uid())
    ) >= 15
  );

CREATE POLICY "Authors can update own ideas"
  ON public.ideas FOR UPDATE
  TO authenticated
  USING (author_id = (SELECT auth.uid()) AND status IN ('active', 'moderation_review'))
  WITH CHECK (author_id = (SELECT auth.uid()));

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own evaluations"
  ON public.evaluations FOR SELECT
  TO authenticated
  USING (evaluator_id = (SELECT auth.uid()));

CREATE POLICY "Authors view evaluations on their ideas"
  ON public.evaluations FOR SELECT
  TO authenticated
  USING (
    idea_id IN (
      SELECT id FROM public.ideas WHERE author_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Evaluate others ideas"
  ON public.evaluations FOR INSERT
  TO authenticated
  WITH CHECK (
    evaluator_id = (SELECT auth.uid())
    AND idea_id NOT IN (
      SELECT id FROM public.ideas WHERE author_id = (SELECT auth.uid())
    )
  );

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own rate limits"
  ON public.rate_limits FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

ALTER TABLE public.duplicate_hashes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read hashes"
  ON public.duplicate_hashes FOR SELECT
  TO authenticated
  USING (true);

-- ==================== 6. FUNCTIONS ====================
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER set_updated_at_ideas
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE OR REPLACE FUNCTION public.expire_ideas()
RETURNS void AS $$
BEGIN
  UPDATE public.ideas
  SET status = 'closed', closed_at = now()
  WHERE status = 'active' AND expires_at <= now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_next_idea_for_user(p_user_id UUID)
RETURNS SETOF public.ideas AS $$
BEGIN
  RETURN QUERY
    SELECT i.*
    FROM public.ideas i
    WHERE i.status = 'active'
      AND i.author_id != p_user_id
      AND i.id NOT IN (
        SELECT e.idea_id FROM public.evaluations e WHERE e.evaluator_id = p_user_id
      )
    ORDER BY random()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== DONE ====================
-- pg_cron jobs will be configured later via Supabase dashboard
