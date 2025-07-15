-- Enable RLS on conversations table
ALTER TABLE public.conversations
  ENABLE ROW LEVEL SECURITY;

-- Patients can view their own conversations
CREATE POLICY "Patients can view their own conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = patient_id );

-- Patients can insert their own conversations
CREATE POLICY "Patients can insert their own conversations"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = patient_id );

-- Patients can update their own conversations
CREATE POLICY "Patients can update their own conversations"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING ( auth.uid() = patient_id )
  WITH CHECK ( auth.uid() = patient_id );

-- Patients can delete their own conversations
CREATE POLICY "Patients can delete their own conversations"
  ON public.conversations
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = patient_id );

-- Admins can manage all conversations
CREATE POLICY "Admins can manage all conversations"
  ON public.conversations
  FOR ALL
  TO authenticated
  USING ( auth.jwt() ->> 'role' = 'admin' )
  WITH CHECK ( auth.jwt() ->> 'role' = 'admin' );