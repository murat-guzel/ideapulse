-- Waitlist for early access signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  source      TEXT DEFAULT 'landing',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Allow anonymous inserts (from landing page)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service role can read
CREATE POLICY "Service role can read waitlist"
  ON public.waitlist FOR SELECT
  TO service_role
  USING (true);
