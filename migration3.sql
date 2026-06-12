-- 1. Add trial_seconds_remaining column
ALTER TABLE public.profiles 
ADD COLUMN trial_seconds_remaining integer DEFAULT 3600 NOT NULL;
