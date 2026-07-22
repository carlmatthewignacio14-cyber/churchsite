'use server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Server Action to securely sign up a leader/pastor and log their private passcode
 */
export async function registerChurchLeader(
  email: string, 
  password: string, 
  role: string, 
  personalCode: string
) {
  // 1. Register the core user account inside Supabase Auth management
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirms email to keep onboarding fast
    user_metadata: { role }
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message || 'Authentication registration failure.' };
  }

  // 2. Insert their profile link and unique passcode into your existing church_passcodes table
  const { error: dbError } = await supabaseAdmin
    .from('church_passcodes')
    .insert([
      { 
        id: authData.user.id, 
        email, 
        role, 
        personal_code: personalCode 
      }
    ]);

  if (dbError) {
    // If the database insert fails, roll back and remove the auth account to prevent orphans
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    
    // Check if the passcode was rejected because someone else is already using it
    if (dbError.code === '23505') {
      return { success: false, message: 'This specific personal passcode is already taken. Please choose a different code.' };
    }
    return { success: false, message: dbError.message };
  }

  return { success: true, message: '🎉 Success! Your account and custom passcode are now live.' };
}
