-- Add last_login_date field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN last_login_date DATE;