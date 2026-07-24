-- Fix RLS policies for chat_messages table
-- Authenticated users should be able to read all messages and insert their own

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read all chat messages
DROP POLICY IF EXISTS "authenticated_users_can_read_chat_messages" ON public.chat_messages;
CREATE POLICY "authenticated_users_can_read_chat_messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert their own messages
DROP POLICY IF EXISTS "authenticated_users_can_insert_chat_messages" ON public.chat_messages;
CREATE POLICY "authenticated_users_can_insert_chat_messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
