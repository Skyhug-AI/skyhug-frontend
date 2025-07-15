-- Enable RLS on assessments and assessment_questions tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for assessments table (publicly readable)
CREATE POLICY "Assessments are publicly readable" 
ON public.assessments 
FOR SELECT 
USING (true);

-- Create policies for assessment_questions table (publicly readable)
CREATE POLICY "Assessment questions are publicly readable" 
ON public.assessment_questions 
FOR SELECT 
USING (true);