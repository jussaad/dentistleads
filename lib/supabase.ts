import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types'; // Assuming you might generate types later, otherwise rely on runtime checks.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Use Service Role Key only for server-side operations where RLS is bypassed (like seeding/reporting)
// For client-side/Next.js server components, use Anon Key.

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Export a client that can use the service role key for server-side tasks (like API routes)
// This requires service-role key to be available in process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
