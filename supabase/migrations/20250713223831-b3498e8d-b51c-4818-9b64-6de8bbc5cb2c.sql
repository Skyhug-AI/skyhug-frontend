-- Delete all data for user ericavdippold@gmail.com (ID: fa3539bf-55b9-4b4a-9054-899069b47c6f)

-- First delete messages (they reference conversations)
DELETE FROM messages 
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE patient_id = 'fa3539bf-55b9-4b4a-9054-899069b47c6f'
);

-- Delete conversations
DELETE FROM conversations 
WHERE patient_id = 'fa3539bf-55b9-4b4a-9054-899069b47c6f';

-- Delete patient favorite therapists
DELETE FROM patient_favorite_therapists 
WHERE patient_id = 'fa3539bf-55b9-4b4a-9054-899069b47c6f';

-- Delete user profile
DELETE FROM user_profiles 
WHERE user_id = 'fa3539bf-55b9-4b4a-9054-899069b47c6f';

-- Reset onboarding_completed in patients table
UPDATE patients 
SET onboarding_completed = false, 
    active_conversation_id = null,
    updated_at = now()
WHERE id = 'fa3539bf-55b9-4b4a-9054-899069b47c6f';