-- Drop overly permissive testing policies on messages table
DROP POLICY IF EXISTS "Allow all for testing" ON public.messages;
DROP POLICY IF EXISTS "Service Role Full Access" ON public.messages;
DROP POLICY IF EXISTS "Service role can update message" ON public.messages;

-- Create proper RLS policies for messages
-- Patients can view messages in their own conversations
CREATE POLICY "Patients can view their own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.patient_id = auth.uid()
    )
  );

-- Patients can insert messages in their own conversations
CREATE POLICY "Patients can insert their own messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK ( 
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.patient_id = auth.uid()
    )
  );

-- Patients can update messages in their own conversations
CREATE POLICY "Patients can update their own messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.patient_id = auth.uid()
    )
  )
  WITH CHECK ( 
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.patient_id = auth.uid()
    )
  );

-- Patients can delete messages in their own conversations
CREATE POLICY "Patients can delete their own messages"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING ( 
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.patient_id = auth.uid()
    )
  );

-- Admins can manage all messages
CREATE POLICY "Admins can manage all messages"
  ON public.messages
  FOR ALL
  TO authenticated
  USING ( auth.jwt() ->> 'role' = 'admin' )
  WITH CHECK ( auth.jwt() ->> 'role' = 'admin' );