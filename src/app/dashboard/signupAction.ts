'use server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Server Action to securely sign up a leader/pastor and save their profile
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

  // 2. Insert user profile data into the 'profiles' table (NOT rosterlist)
  const { error: dbError } = await supabaseAdmin
    .from('profiles')
    .upsert([
      { 
        id: authData.user.id, 
        email, 
        role, 
        username, 
        ministry: role === 'Leaders' ? ministry : null
      }
    ]);

  if (dbError) {
    // If the database insert fails, roll back and remove the auth account to prevent orphans
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { success: false, message: dbError.message };
  }

  return { success: true, message: '🎉 Success! Your account is now live.' };
}
