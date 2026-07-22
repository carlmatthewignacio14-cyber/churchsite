import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.ROCKET_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// Looks for Rocket's server-side environment variables key hooks
const supabaseServiceKey = process.env.ROCKET_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
