import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for server-side operations
 * Uses service_role key with full admin access
 *
 * SECURITY: Only use in:
 * - API routes (app/api/**‎/route.ts)
 * - Server components
 * - Server actions
 *
 * NEVER use in client components or expose service_role key to browser
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
