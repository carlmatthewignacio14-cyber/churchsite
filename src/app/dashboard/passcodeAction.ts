'use server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Server Action to authenticate a leader/pastor using their personal passcode only.
 * Looks up the passcode in church_passcodes and returns the associated user's email
 * so the client can proceed to the dashboard.
 */
export async function loginWithPasscodeOnly(
  passcode: string
): Promise<{ success: boolean; message: string; email?: string }> {
  if (!passcode || passcode.trim() === '') {
    return { success: false, message: 'Please enter your passcode.' };
  }

  // Check master codes from environment variables first
  const leaderMasterCode = process.env.NEXT_PUBLIC_LEADER_MASTER_CODE;
  const pastorMasterCode = process.env.NEXT_PUBLIC_PASTOR_MASTER_CODE;

  if (passcode === leaderMasterCode || passcode === pastorMasterCode) {
    return { success: true, message: 'Master code accepted.' };
  }

  // Look up the passcode in the church_passcodes table
  const { data, error } = await supabaseAdmin
    .from('church_passcodes')
    .select('email, role')
    .eq('personal_code', passcode)
    .single();

  if (error || !data) {
    return { success: false, message: 'Invalid passcode. Please try again.' };
  }

  return { success: true, message: 'Passcode verified.', email: data.email };
}
