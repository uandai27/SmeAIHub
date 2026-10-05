'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { portalFetch } from '@/lib/server/client-portal';
import { APSARAS_OPERATIONS_PATH, requireApsarasOperations } from '@/lib/server/apsaras-operations';

export async function updateApsarasEnquiry(form: FormData) {
  const { user,membership } = await requireApsarasOperations();
  if (membership.role === 'viewer') redirect(`${APSARAS_OPERATIONS_PATH}?notice=access`);
  const id=String(form.get('id')||''),version=String(form.get('version')||''),action=String(form.get('action')||'');
  const owner=String(form.get('owner')||'').trim(),note=String(form.get('note')||'').trim();
  if (!/^[a-f0-9-]{36}$/i.test(id) || !Number.isFinite(Date.parse(version))
    || !['save','review','contact','quote','confirm','resolve','close','lost'].includes(action)
    || owner.length>120 || note.length>1000) redirect(`${APSARAS_OPERATIONS_PATH}?notice=invalid`);
  let saved=false;
  try {
    saved=await portalFetch<boolean>('rest/v1/rpc/portal_update_apsaras_enquiry',user.token,{
      enquiry_id:id,expected_updated_at:version,action_name:action,assigned_owner:owner||null,operator_note:note||null,
    });
  } catch { redirect(`${APSARAS_OPERATIONS_PATH}?notice=save`); }
  revalidatePath(APSARAS_OPERATIONS_PATH);
  redirect(`${APSARAS_OPERATIONS_PATH}?notice=${saved?'saved':'conflict'}`);
}
