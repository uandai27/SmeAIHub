import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { sourceBreakdown, summarizeApsaras, type ApsarasEnquiryRow } from '../lib/operations/apsaras-metrics.ts';

test('Apsaras metric summaries distinguish leads, handoffs and urgent work',()=>{
  const base={id:'1',reference_id:'AT-L-11111111',record_type:'lead',original_created_at:'2026-10-05T00:00:00Z',source:'web',category:'Room Booking',priority:null,requested_owner:null,guest_name:null,contact:null,check_in:null,check_out:null,guests:null,rooms:null,room_type:null,special_request:null,last_message:null,reason:null,status:'new',assigned_owner:null,staff_note:null,updated_at:'2026-10-05T00:00:00Z'} satisfies ApsarasEnquiryRow;
  const rows:ApsarasEnquiryRow[]=[base,{...base,id:'2',reference_id:'AT-H-22222222',record_type:'handoff',priority:'HIGH',source:'whatsapp',status:'in_review'}];
  assert.deepEqual(summarizeApsaras(rows),{total:2,leads:1,handoffs:1,urgent:1,confirmed:0,open:2});
  assert.deepEqual(sourceBreakdown(rows),[{source:'web',count:1},{source:'whatsapp',count:1}]);
});

test('Apsaras migration enforces tenant access, idempotent ingestion and guarded workflow updates',async()=>{
  const db=new PGlite();
  const manager='00000000-0000-0000-0000-000000000011',viewer='00000000-0000-0000-0000-000000000012',outsider='00000000-0000-0000-0000-000000000013';
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema public,auth to authenticated,anon,service_role;`);
    for(const filename of ['202609210001_kazuko_whatsapp_concierge.sql','202610040001_kazuko_operations.sql','202610040002_kazuko_web_reservations.sql','202610040003_client_portal.sql','202610050001_apsaras_operations.sql'])
      await db.exec(await readFile(new URL(`../supabase/migrations/${filename}`,import.meta.url),'utf8'));
    for(const [id,email] of [[manager,'manager@apsaras.example'],[viewer,'viewer@apsaras.example'],[outsider,'outsider@example.org']]) await db.query('insert into auth.users values($1,$2,now())',[id,email]);
    await db.query("insert into public.portal_members(tenant_slug,user_id,role) values('apsaras-tribe',$1,'manager'),('apsaras-tribe',$2,'viewer')",[manager,viewer]);
    const ingest=`select public.ingest_apsaras_enquiry($1,now(),'lead','web','Room Booking',null,'Front Office','Test Guest','test@example.org','2026-11-01','2026-11-03','2 adults','1','Ocean View',null,null,null) as id`;
    await db.exec('set role service_role');
    const first=(await db.query<{id:string}>(ingest,['AT-L-11111111'])).rows[0].id;
    const replay=(await db.query<{id:string}>(ingest,['AT-L-11111111'])).rows[0].id;
    await db.exec('reset role');
    assert.equal(first,replay);
    assert.equal((await db.query<{count:number}>('select count(*)::int as count from public.apsaras_enquiries')).rows[0].count,1);
    async function asUser<T>(id:string,sql:string,params:unknown[]=[]){await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);try{return (await db.query<T>(sql,params)).rows;}finally{await db.exec("reset role; select set_config('request.jwt.claim.sub','',false)");}}
    assert.equal((await asUser(manager,'select id from public.apsaras_enquiries')).length,1);
    assert.deepEqual(await asUser(outsider,'select id from public.apsaras_enquiries'),[]);
    const version=(await db.query<{updated_at:Date}>('select updated_at from public.apsaras_enquiries where id=$1',[first])).rows[0].updated_at;
    await assert.rejects(()=>asUser(viewer,"select public.portal_update_apsaras_enquiry($1,$2,'review',null,null)",[first,version]),/Access denied/);
    assert.equal((await asUser<{saved:boolean}>(manager,"select public.portal_update_apsaras_enquiry($1,$2,'review','Front Office','Calling guest') as saved",[first,version]))[0].saved,true);
    const saved=(await db.query<{status:string;assigned_owner:string}>('select status,assigned_owner from public.apsaras_enquiries where id=$1',[first])).rows[0];
    assert.deepEqual(saved,{status:'in_review',assigned_owner:'Front Office'});
    const audit=(await db.query<{actor_email:string}>('select actor_email from public.apsaras_operations_audit')).rows[0];
    assert.equal(audit.actor_email,'manager@apsaras.example');
    await db.exec('set role authenticated');
    await db.query("select set_config('request.jwt.claim.sub',$1,false)",[manager]);
    try { await assert.rejects(()=>db.query(ingest,['AT-L-22222222']),/permission denied/); } finally { await db.exec("reset role; select set_config('request.jwt.claim.sub','',false)"); }
  } finally { await db.close(); }
});
