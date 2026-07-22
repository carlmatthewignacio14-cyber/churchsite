import { createClient } from '@supabase/supabase-js';

// Automatically targets Rocket's internal managed dashboard connectors 
const supabaseUrl = process.env.ROCKET_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.ROCKET_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("Awaiting background API context injection settings...");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
