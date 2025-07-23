
-- Create daily_goal_completions table
CREATE TABLE public.daily_goal_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate goal completions per day
CREATE UNIQUE INDEX daily_goal_completions_user_goal_date_unique 
ON public.daily_goal_completions(user_id, goal_type, completion_date);

-- Enable Row Level Security
ALTER TABLE public.daily_goal_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own goal completions"
  ON public.daily_goal_completions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal completions"
  ON public.daily_goal_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal completions"
  ON public.daily_goal_completions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal completions"
  ON public.daily_goal_completions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
