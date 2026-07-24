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
  ministry: string,
  firstName: string, // 👈 ADDED
  lastName: string   // 👈 ADDED
) {
  // 1. Register the core user account inside Supabase Auth management
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
      role, 
      username,
      ministry: role === 'Leaders' ? ministry : null
    }
  });

  if (authError || !authData.user) {
    return { success: false, message: authError?.message || 'Authentication registration failure.' };
  }

  // 2. Insert user profile data into the 'profiles' table with names included
  const { error: dbError } = await supabaseAdmin
    .from('profiles')
    .upsert([
      { 
        id: authData.user.id, 
        role, 
        username, 
        first_name: firstName, // 👈 ADDED
        last_name: lastName,   // 👈 ADDED
        ministry: role === 'Leaders' ? ministry : null
      }
    ]);

  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { success: false, message: dbError.message };
  }

  return { success: true, message: '🎉 Success! Your account is now live.' };
}
