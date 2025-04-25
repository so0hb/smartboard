import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl.startsWith("https://") || !supabaseAnonKey || !serviceRoleKey) {
  throw new Error("Supabase environment variables are not properly set.");
}

// Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Access auth admin API
export const adminAuthClient = supabaseAdmin.auth.admin;

// Regular Supabase client for client-side interactions
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase URL for public storage
export const supabaseUrlImage = `${supabaseUrl}/storage/v1/object/public`;
