-- Evaluations table: structured feedback per idea
CREATE TABLE public.evaluations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id                 UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  evaluator_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Structured responses (1-5 scale)
  q_problem_intensity     SMALLINT NOT NULL CHECK (q_problem_intensity BETWEEN 1 AND 5),
  q_would_pay             SMALLINT NOT NULL CHECK (q_would_pay BETWEEN 1 AND 5),
  q_differentiation       SMALLINT NOT NULL CHECK (q_differentiation BETWEEN 1 AND 5),
  q_overall_viability     SMALLINT NOT NULL CHECK (q_overall_viability BETWEEN 1 AND 5),

  -- Optional comment
  comment                 TEXT CHECK (comment IS NULL OR char_length(comment) <= 500),

  -- Evaluator metadata (snapshotted at evaluation time)
  evaluator_experience    TEXT NOT NULL,
  evaluator_industry      TEXT,
  industry_match          BOOLEAN NOT NULL DEFAULT FALSE,

  -- Moderation
  comment_flagged         BOOLEAN NOT NULL DEFAULT FALSE,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(idea_id, evaluator_id)
);

CREATE INDEX idx_evaluations_idea ON evaluations(idea_id);
CREATE INDEX idx_evaluations_evaluator ON evaluations(evaluator_id);

-- Increment counters after evaluation insert
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
