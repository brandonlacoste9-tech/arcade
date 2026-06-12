-- =============================================================================
-- ENTITLEMENT LOCKDOWN MIGRATION
-- Run this ONCE in the Supabase SQL Editor on an EXISTING deployment.
-- It is safe to re-run (idempotent).
--
-- Why: previously any logged-in user could call
--   supabase.from('profiles').update({ plan: 'PRO' })   (or role: 'admin')
-- from the browser, because the UPDATE RLS policy did not restrict columns.
-- This migration pins the `plan` and `role` columns so they can ONLY be changed
-- by the backend (service-role key), i.e. the Stripe webhook and admin endpoints.
-- =============================================================================

-- 1. Ensure the columns the backend needs exist.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- 2. Trigger function: on any UPDATE that is NOT made with the service-role key,
--    revert `plan` and `role` to their previous values. Supabase sets
--    auth.role() = 'service_role' only for the backend service-role client.
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

-- 3. (Re)attach the trigger.
DROP TRIGGER IF EXISTS protect_profile_columns_trigger ON public.profiles;
CREATE TRIGGER protect_profile_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_profile_columns();

-- 4. OPTIONAL HARDENING: also revoke direct column-level UPDATE grants on the
--    sensitive columns from the authenticated role. The trigger above is the
--    primary guard; this is defense-in-depth. Uncomment if desired.
-- REVOKE UPDATE (plan, role) ON public.profiles FROM authenticated;
