-- Enable RLS on patients table
ALTER TABLE public.patients
  ENABLE ROW LEVEL SECURITY;

-- Users can view their own patient record
CREATE POLICY "Users can view their own patient record"
  ON public.patients
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = id );

-- Users can insert their own patient record
CREATE POLICY "Users can insert their own patient record"
  ON public.patients
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = id );

-- Users can update their own patient record
CREATE POLICY "Users can update their own patient record"
  ON public.patients
  FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- Users can delete their own patient record
CREATE POLICY "Users can delete their own patient record"
  ON public.patients
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = id );

-- Admins can manage all patient records
CREATE POLICY "Admins can manage all patient records"
  ON public.patients
  FOR ALL
  TO authenticated
  USING ( auth.jwt() ->> 'role' = 'admin' )
  WITH CHECK ( auth.jwt() ->> 'role' = 'admin' );