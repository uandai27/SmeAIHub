import 'server-only';
import { cache } from 'react';
import { supabaseRest, SupabaseRestError } from '@/lib/server/supabase-rest';
// Keep the existing deployment usable before the new migration is applied.
// Once it exists, outages fail closed and administrators can revoke every shared-key session.
export const legacyKazukoEnabled = cache(async () => {
  if (!process.env.KAZUKO_OPERATIONS_ACCESS_TOKEN) return false;
  try { return await supabaseRest<boolean>({ path: 'rpc/portal_legacy_kazuko_enabled', method: 'POST', body: {}, logErrorDetail: false }); }
  catch (error) {
    if (error instanceof SupabaseRestError && error.code === 'PGRST202') return true;
    return false;
  }
});
