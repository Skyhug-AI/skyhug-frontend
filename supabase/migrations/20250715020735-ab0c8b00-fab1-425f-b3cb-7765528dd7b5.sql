-- Enable RLS on therapists table
ALTER TABLE public.therapists
  ENABLE ROW LEVEL SECURITY;

-- Public read for everyone
CREATE POLICY "Therapists are publicly readable"
  ON public.therapists
  FOR SELECT
  USING ( true );

-- Admin writes only
CREATE POLICY "Admins can modify therapists"
  ON public.therapists
  FOR ALL   -- covers INSERT, UPDATE, DELETE
  TO authenticated
  USING ( auth.jwt() ->> 'role' = 'admin' )
  WITH CHECK ( auth.jwt() ->> 'role' = 'admin' );