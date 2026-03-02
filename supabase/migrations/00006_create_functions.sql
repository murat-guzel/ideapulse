-- Auto-update updated_at timestamp
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

-- Expire active ideas past their deadline (called by pg_cron)
CREATE OR REPLACE FUNCTION public.expire_ideas()
RETURNS void AS $$
BEGIN
  UPDATE public.ideas
  SET status = 'closed', closed_at = now()
  WHERE status = 'active' AND expires_at <= now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get next idea for evaluation (random active idea not yet evaluated by user, not own)
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
