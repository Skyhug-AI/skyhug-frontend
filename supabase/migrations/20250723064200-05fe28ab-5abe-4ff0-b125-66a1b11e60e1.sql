-- Rename full_name column to username in patients table
ALTER TABLE public.patients 
RENAME COLUMN full_name TO username;