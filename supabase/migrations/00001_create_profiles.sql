-- Profiles table: extends auth.users with app-specific data
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

-- Auto-create profile on auth.users insert
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
