-- Add calm_points column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN calm_points INTEGER NOT NULL DEFAULT 0;