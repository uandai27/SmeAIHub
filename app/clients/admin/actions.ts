'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { portalFetch, requirePortalAdmin } from '@/lib/server/client-portal';
export async function manageMember(form: FormData) {
  const user = await requirePortalAdmin();
  const tenant = String(form.get('tenant') || '');
  const email = String(form.get('email') || '').trim().toLowerCase();
  const role = String(form.get('role') || '');
  if (!/^[a-z0-9-]{1,80}$/.test(tenant) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['manager','staff','viewer'].includes(role)) redirect('/clients/admin?notice=invalid');
  try { await portalFetch('rest/v1/rpc/portal_manage_member', user.token, { target_tenant: tenant, member_email: email, member_role: role, member_active: form.get('active') === 'true' }); }
  catch { redirect('/clients/admin?notice=failed'); }
  revalidatePath('/clients');
  revalidatePath('/clients/admin');
  redirect('/clients/admin?notice=saved');
}
export async function disableLegacy() {
  const user = await requirePortalAdmin();
  try { await portalFetch('rest/v1/rpc/portal_disable_legacy_kazuko', user.token, {}); }
  catch { redirect('/clients/admin?notice=failed'); }
  revalidatePath('/login');
  revalidatePath('/operations/kazuko');
  redirect('/clients/admin?notice=legacy_disabled');
}
