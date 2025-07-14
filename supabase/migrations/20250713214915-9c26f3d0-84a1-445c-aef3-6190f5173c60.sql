-- Add onboarding_completed column to patients table
ALTER TABLE patients 
ADD COLUMN onboarding_completed boolean DEFAULT false;

-- Reset onboarding completion for all existing users
UPDATE patients 
SET onboarding_completed = false;