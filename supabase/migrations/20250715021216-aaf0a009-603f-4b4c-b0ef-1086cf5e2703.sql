-- Enable RLS on patient_favorite_therapists table
ALTER TABLE public.patient_favorite_therapists
  ENABLE ROW LEVEL SECURITY;

-- Patients can view their own favorites
CREATE POLICY "Patients can view their own favorite therapists"
  ON public.patient_favorite_therapists
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = patient_id );

-- Patients can add their own favorites
CREATE POLICY "Patients can add their own favorite therapists"
  ON public.patient_favorite_therapists
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = patient_id );

-- Patients can update their own favorites
CREATE POLICY "Patients can update their own favorite therapists"
  ON public.patient_favorite_therapists
  FOR UPDATE
  TO authenticated
  USING ( auth.uid() = patient_id )
  WITH CHECK ( auth.uid() = patient_id );

-- Patients can delete their own favorites
CREATE POLICY "Patients can delete their own favorite therapists"
  ON public.patient_favorite_therapists
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = patient_id );