-- Create table to track daily goal completions
CREATE TABLE public.daily_goal_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  completion_date DATE NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_type, completion_date)
);

-- Enable RLS
ALTER TABLE public.daily_goal_completions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own goal completions" 
ON public.daily_goal_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal completions" 
ON public.daily_goal_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal completions" 
ON public.daily_goal_completions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal completions" 
ON public.daily_goal_completions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_daily_goal_completions_user_date ON public.daily_goal_completions(user_id, completion_date);