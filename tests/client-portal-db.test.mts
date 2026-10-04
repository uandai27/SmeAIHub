import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('real PostgreSQL migrations enforce tenant boundaries, roles and revocation', async t => {
  const db = new PGlite();
  const admin = '00000000-0000-0000-0000-000000000001';
  const manager = '00000000-0000-0000-0000-000000000002';
  const staff = '00000000-0000-0000-0000-000000000003';
  const viewer = '00000000-0000-0000-0000-000000000004';
  const hotel = '00000000-0000-0000-0000-000000000005';
  const outsider = '00000000-0000-0000-0000-000000000006';
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema public,auth to authenticated,anon,service_role;`);
    for (const filename of ['202609210001_kazuko_whatsapp_concierge.sql','202610040001_kazuko_operations.sql','202610040002_kazuko_web_reservations.sql']) {
      await db.exec(await readFile(new URL(`../supabase/migrations/${filename}`, import.meta.url), 'utf8'));
    }
    const before = await db.query<{id:string}>(`select public.ingest_kazuko_web_reservation('KR-11111111',now(),'Existing guest','Test contact','Tomorrow 7pm','2',null,repeat('a',64)) as id`);
    const requestId = before.rows[0].id;
    await db.exec(await readFile(new URL('../supabase/migrations/202610040003_client_portal.sql', import.meta.url),'utf8'));
    for (const [id,email] of [[admin,'admin@example.org'],[manager,'manager@example.org'],[staff,'staff@example.org'],[viewer,'viewer@example.org'],[hotel,'hotel@example.org'],[outsider,'outsider@example.org']]) {
      await db.query('insert into auth.users values($1,$2,now())',[id,email]);
    }
    await db.query('insert into public.portal_admins values($1)',[admin]);
    for (const [tenant,user,role] of [['kazuko-ramenba',manager,'manager'],['kazuko-ramenba',staff,'staff'],['kazuko-ramenba',viewer,'viewer'],['apsaras-tribe',hotel,'manager']]) {
      await db.query('insert into public.portal_members(tenant_slug,user_id,role) values($1,$2,$3)',[tenant,user,role]);
    }
    await db.query(`insert into public.whatsapp_service_requests(tenant_slug,intake_source,external_request_id,customer_hash,request_type,guest_name,requested_datetime_text,handoff_reason) values('apsaras-tribe','web','KR-22222222',repeat('b',64),'reservation','Hotel test guest','Test only','Test')`);
    async function asUser<T>(id: string, sql: string, params: unknown[] = []) {
      await db.exec('set role authenticated');
      await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
      try { return (await db.query<T>(sql,params)).rows; }
      finally { await db.exec("reset role; select set_config('request.jwt.claim.sub','',false)"); }
    }
    async function version() {
      return (await db.query<{updated_at:Date}>('select updated_at from public.whatsapp_service_requests where id=$1',[requestId])).rows[0].updated_at;
    }
    async function update(user: string, action: string, amount: number | null = null) {
      return asUser<{saved:boolean}>(user, 'select public.portal_update_kazuko_operation($1,$2,$3,null,null,$4) as saved',[requestId,await version(),action,amount]);
    }
    await t.test('existing reservations survive and REST reads stay isolated despite arbitrary filters',async () => {
      assert.equal((await asUser<{guest_name:string}>(manager,'select guest_name from public.whatsapp_service_requests')).length,1);
      assert.deepEqual(await asUser(hotel,"select id from public.whatsapp_service_requests where tenant_slug='kazuko-ramenba'"),[]);
      assert.deepEqual(await asUser(outsider,'select id from public.whatsapp_service_requests'),[]);
      assert.equal((await asUser(admin,'select id from public.whatsapp_service_requests')).length,2);
      assert.deepEqual(await asUser<{tenant_slug:string}>(hotel,'select tenant_slug from public.portal_clients()'),[{tenant_slug:'apsaras-tribe'}]);
    });
    await t.test('anonymous users, unrelated clients and read-only viewers cannot mutate or self-promote',async () => {
      await assert.rejects(()=>update(hotel,'confirm'),/Access denied/);
      await assert.rejects(()=>update(viewer,'confirm'),/Access denied/);
      await assert.rejects(()=>asUser(staff,"select public.portal_manage_member('kazuko-ramenba','staff@example.org','manager',true)"),/Access denied/);
      await assert.rejects(()=>asUser(manager,'select * from public.portal_member_list()'),/Access denied/);
      await assert.rejects(()=>asUser(staff,'insert into public.portal_admins values($1)',[staff]),/permission denied/);
      await assert.rejects(()=>asUser(manager,"update public.whatsapp_service_requests set guest_name='Tampered'"),/permission denied/);
      await db.exec('set role anon');
      try { await assert.rejects(()=>db.query('select * from public.whatsapp_service_requests'),/permission denied/); }
      finally { await db.exec('reset role'); }
    });
    await t.test('staff process reservations but managers alone record bills; audit records verified identity',async () => {
      assert.equal((await update(staff,'confirm'))[0].saved,true);
      await assert.rejects(()=>update(staff,'arrive',1200),/Manager required/);
      assert.equal((await update(manager,'arrive',1200))[0].saved,true);
      const audit = await db.query<{actor_user_id:string;operator_name:string}>('select actor_user_id,operator_name from public.kazuko_operations_audit order by created_at desc limit 1');
      assert.equal(audit.rows[0].actor_user_id,manager);
      assert.equal(audit.rows[0].operator_name,'manager@example.org');
      assert.deepEqual(await asUser(hotel,'select * from public.kazuko_operations_audit'),[]);
    });
    await t.test('revocation takes effect without issuing a new JWT and membership edits are audited',async () => {
      await asUser(admin,"select public.portal_manage_member('kazuko-ramenba','staff@example.org','staff',false)");
      assert.deepEqual(await asUser(staff,'select id from public.whatsapp_service_requests'),[]);
      await assert.rejects(()=>update(staff,'save'),/Access denied/);
      assert.equal((await db.query<{count:number}>('select count(*)::int as count from public.portal_member_audit')).rows[0].count,1);
    });
    await t.test('service-only web ingestion remains idempotent and never resets employee decisions or bills',async () => {
      await db.exec('set role service_role');
      try {
        const result = await db.query<{id:string}>("select public.ingest_kazuko_web_reservation('KR-11111111',now(),'Replay','Test contact','Tomorrow','2',null,repeat('a',64)) as id");
        assert.equal(result.rows[0].id,requestId);
      } finally { await db.exec('reset role'); }
      const saved = await db.query<{status:string;sale_amount_php:string}>('select status,sale_amount_php from public.whatsapp_service_requests where id=$1',[requestId]);
      assert.equal(saved.rows[0].status,'arrived');
      assert.equal(Number(saved.rows[0].sale_amount_php),1200);
      await assert.rejects(()=>asUser(manager,"select public.ingest_kazuko_web_reservation('KR-33333333',now(),'Unauthorized','Test','Tomorrow','2',null,repeat('a',64))"),/permission denied/);
    });
    await t.test('only platform admins can disable shared-key access',async () => {
      await assert.rejects(()=>asUser(manager,'select public.portal_disable_legacy_kazuko()'),/Access denied/);
      await asUser(admin,'select public.portal_disable_legacy_kazuko()');
      await db.exec('set role service_role');
      try { assert.equal((await db.query<{enabled:boolean}>('select public.portal_legacy_kazuko_enabled() as enabled')).rows[0].enabled,false); }
      finally { await db.exec('reset role'); }
    });
  } finally { await db.close(); }
});
