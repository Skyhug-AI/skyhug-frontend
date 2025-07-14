-- Reset onboarding completion for all existing users
-- Run this in your Supabase SQL Editor

UPDATE patients 
SET onboarding_completed = false 
WHERE onboarding_completed IS NULL OR onboarding_completed = true;