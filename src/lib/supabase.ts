import { createClient } from '@supabase/supabase-js';

// Rocket.new uses exactly these names for your keys instead of public ones
const supabaseUrl = process.env.ROCKET_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.ROCKET_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase API keys are completely missing from your configuration settings.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
