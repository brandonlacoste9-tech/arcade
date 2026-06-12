-- Security Hardening: Prevent clients from updating their own plan or role

-- 1. Create a function that resets plan/role to their old values if the user isn't the service_role
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger AS $$
BEGIN
  -- If the current user executing this is the service_role, allow it (backend API uses service_role)
  IF current_setting('role') = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Otherwise, silently force the plan and role to remain unchanged (protecting against client manipulation)
  NEW.plan = OLD.plan;
  NEW.role = OLD.role;
  NEW.stripe_customer_id = OLD.stripe_customer_id;
  NEW.stripe_subscription_id = OLD.stripe_subscription_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to the profiles table
DROP TRIGGER IF EXISTS enforce_profile_security ON public.profiles;
CREATE TRIGGER enforce_profile_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.protect_profile_fields();

-- 3. Add Stripe fields for subscription lifecycle (P6)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
