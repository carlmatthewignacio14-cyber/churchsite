'use server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Server Action to securely sign up a leader/pastor and log their private passcode
 */
export async function registerChurchLeader(
  email: string, 
  password: string, 
  role: string, 
  personalCode: string,
  username: string,
  ministry: string 
) {
  // 1. Register the core user account inside Supabase Auth management
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirms email to keep onboarding fast
    user_metadata: { 
      role, 
      username,
      ministry: role === 'Leaders' ? ministry : null
    }
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message || 'Authentication registration failure.' };
  }

  // 2. Insert profile link and unique passcode into 'rosterlist1'
  const { error: dbError } = await supabaseAdmin
    .from('rosterlist1') // 👈 CHANGED: from 'church_passcodes' to 'rosterlist1'
    .insert([
      { 
        id: authData.user.id, 
        email, 
        role, 
        allowed_code: personalCode, // 👈 CHANGED: from 'personal_code' to 'allowed_code'
        username,                   // 👈 ADDED: matches your rosterlist1 column
        ministry: role === 'Leaders' ? ministry : null
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

  return { success: true, message: '🎉 Success! Your account is now live.' };
}
