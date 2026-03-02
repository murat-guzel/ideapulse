-- ============================================================
-- Row Level Security policies
-- ============================================================

-- PROFILES
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

-- IDEAS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see active ideas (for evaluation) or their own ideas
CREATE POLICY "View active or own ideas"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (status = 'active' OR author_id = (SELECT auth.uid()));

-- Only users with 15+ evaluations can insert
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

-- Authors can update own ideas in certain states
CREATE POLICY "Authors can update own ideas"
  ON public.ideas FOR UPDATE
  TO authenticated
  USING (author_id = (SELECT auth.uid()) AND status IN ('active', 'moderation_review'))
  WITH CHECK (author_id = (SELECT auth.uid()));

-- EVALUATIONS
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Users can view their own evaluations
CREATE POLICY "View own evaluations"
  ON public.evaluations FOR SELECT
  TO authenticated
  USING (evaluator_id = (SELECT auth.uid()));

-- Idea authors can view evaluations on their ideas
CREATE POLICY "Authors view evaluations on their ideas"
  ON public.evaluations FOR SELECT
  TO authenticated
  USING (
    idea_id IN (
      SELECT id FROM public.ideas WHERE author_id = (SELECT auth.uid())
    )
  );

-- Users can create evaluations (not on their own ideas)
CREATE POLICY "Evaluate others ideas"
  ON public.evaluations FOR INSERT
  TO authenticated
  WITH CHECK (
    evaluator_id = (SELECT auth.uid())
    AND idea_id NOT IN (
      SELECT id FROM public.ideas WHERE author_id = (SELECT auth.uid())
    )
  );

-- RATE LIMITS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own rate limits"
  ON public.rate_limits FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- DUPLICATE HASHES (read-only for authenticated, write via service role)
ALTER TABLE public.duplicate_hashes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read hashes"
  ON public.duplicate_hashes FOR SELECT
  TO authenticated
  USING (true);
