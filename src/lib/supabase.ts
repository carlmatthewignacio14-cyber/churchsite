export { createClient } from './supabase/client';

export const supabase = (() => {
  if (typeof window !== 'undefined') {
    const { createClient } = require('./supabase/client');
    return createClient();
  }
  return null as any;
})();
