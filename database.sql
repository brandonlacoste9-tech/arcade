-- 1. Create a table to store user profiles and their subscription plan
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username text,
  plan text DEFAULT 'FREE'::text,
  role text DEFAULT 'user'::text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy allowing a user to read their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 4. Create a policy allowing a user to update their own profile (e.g. username)
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4a. Prevent users from escalating their own entitlements.
-- The UPDATE policy above lets a user edit their own row (e.g. username), but RLS
-- cannot restrict individual columns. This trigger forces `plan` and `role` to keep
-- their existing values on any UPDATE made over the anon/authenticated API.
-- Supabase's `auth.role()` returns 'service_role' only when the backend uses the
-- service-role key, so plan/role can ONLY be changed by the backend (Stripe webhook
-- and the admin endpoints), never by a client calling Supabase directly.
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger AS $$
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    NEW.plan := OLD.plan;
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protect_profile_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_profile_columns();

-- 5. Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, plan)
  VALUES (new.id, new.raw_user_meta_data->>'username', 'FREE');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
