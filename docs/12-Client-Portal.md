# Client portal foundation

## Delivered

The website's Client Login opens `/login`. Employee accounts authenticate against Supabase Auth using email and password. The server stores only the access token in an HttpOnly, Secure-in-production, SameSite cookie. Login is bounded to the smaller of the provider token lifetime and one hour; expired sessions require login again. There is no self-registration, email invitation, password recovery UI or refresh-token storage in this release. Administrators provision and reset Auth accounts in Supabase.

`/clients` lists the businesses assigned to the signed-in user. Kazuko opens the restaurant operations dashboard. Apsaras opens its protected guest-enquiry dashboard after migration `202610050001_apsaras_operations.sql` is applied and the public concierge sync secrets are configured. No occupancy, OTA bookings, PMS inventory, payments or hotel revenue are fabricated. Future clients require a tenant entry plus their business integration and supported dashboard route; adding an account does not build those integrations automatically.

Membership is stored in `portal_members`, not browser input or editable Auth metadata. `portal_admins` grants platform-wide administration; client members cannot promote themselves to platform admins. `/clients/admin` can enable, change or disable membership for existing confirmed Auth users. Changes are audited.

| Role | Client records | Process requests / close exceptions / trigger website sync | Record or change bills | Manage client memberships |
|---|---|---|---|---|
| Viewer | Own assigned clients | No | No | No |
| Staff | Own assigned clients | Yes | No | No |
| Manager | Own assigned clients | Yes | Kazuko only | No |
| Platform admin | All active clients | Yes | Kazuko only | Yes |

Managers do not provision accounts or administer memberships in this release. Staff can see recorded bills and revenue but cannot write bill amounts. Operator email and user ID are derived from the verified account when processing requests; the submitted operator field cannot impersonate another account.

## Database boundaries

Migration `202610040003_client_portal.sql` adds tenant and membership tables and keeps existing reservations in place. Every current operational record has a tenant foreign key. Authenticated direct REST reads use RLS with current database membership. Revoking membership affects subsequent requests without waiting for token expiry.

Employee reads and writes use a publishable/anon API key and the user's JWT, never the service key. Privileged API keys are rejected by the client configuration validator. Existing privileged webhook and web-booking ingestion paths stay service-only. Employee writes are allowed only through guarded RPCs, which retain existing row locks, optimistic version checks, transition validation and idempotent ingestion. Database and permission failures do not substitute sample metrics.

## Production activation

1. Run `supabase/migrations/202610040003_client_portal.sql` in the **same Supabase project** as the existing Kazuko migrations. This migration assumes the previous three concierge/operations/web migrations are already applied. Run it once. Confirm success before enabling employee login.
2. In Supabase Settings → API Keys, copy a **publishable** key (or legacy anon key). Add it as `SUPABASE_PUBLISHABLE_KEY` to the SmeAIHub Vercel Production environment and the matching Preview environment if needed. Retain the existing server-only URL and secret key. Redeploy the relevant deployment after saving. The key must belong to the same Supabase project; do not use `SUPABASE_SECRET_KEY` here.
3. In Supabase Authentication → Users → Add user → Create new user, create the first administrator with their chosen email and a strong password, with email confirmation enabled. Do not send invitations until the recipient and delivery setup are approved. Do not paste passwords into chat or commit them.
4. In Supabase SQL Editor, replace the placeholder email below with that **existing confirmed account** and run the block. It fails instead of silently granting nobody. This is a one-time bootstrap; the application provides no route for granting platform admin status.

```sql
do $$
declare administrator_id uuid;
begin
 select id into administrator_id from auth.users
 where lower(email)=lower('REPLACE_WITH_ADMIN_EMAIL') and email_confirmed_at is not null;
 if administrator_id is null then raise exception 'Create and confirm the administrator account first'; end if;
 insert into public.portal_admins(user_id) values(administrator_id) on conflict do nothing;
end $$;
```

5. Log in at `/login`. Confirm that the administrator sees Kazuko and Apsaras, and can open Kazuko with its existing data. Create each employee's confirmed Auth account in Supabase, then use **Manage client members** to assign the correct client and role. Do not grant platform admin to restaurant or hotel staff.
6. Verify with actual employee accounts: Kazuko staff see only Kazuko; Apsaras staff see only Apsaras; changing the URL does not grant access; viewers cannot modify a request; staff cannot record bills; disabling membership blocks the next request.
7. After the Kazuko team has verified employee access, use **Disable Kazuko shared-key access** in the administrator page. This revokes existing shared-key sessions on their next request. Remove `KAZUKO_OPERATIONS_ACCESS_TOKEN` from the appropriate Vercel environments afterward and redeploy. Existing web synchronization does not depend on that token.

## Compatibility during activation

Kazuko's shared-key login remains available during account enrollment and is explicitly labelled legacy. It grants Kazuko access only and retains self-reported operator names. Account permissions do not govern a separately authorized legacy-key session, so **complete step 7 before treating employee-role restrictions as the only access path**.

Before the new migration is applied, only the specific missing-RPC error permits the old access method. After the migration exists, the database switch controls legacy access; connection failures fail closed. A signed-in employee cookie takes precedence over any old shared-key cookie, including when the employee lacks Kazuko membership. Legacy logout, cookie expiry and administrator cutover do not open another customer's dashboard.

## Verification

`npm test` includes in-memory PostgreSQL tests that execute the real migrations and switch between authenticated, anonymous and service roles. The tests cover existing-data preservation, cross-client reads, arbitrary URL/filter attempts, forbidden direct writes, self-promotion, manager-only billing, verified audit identity, membership revocation, service-only/idempotent website ingestion, Apsaras workflow transitions and administrator-only legacy cutover. These tests use synthetic data and do not write to production. Production account login and employee access remain unverified until the activation steps above are completed.

## Apsaras activation

1. Apply `supabase/migrations/202610050001_apsaras_operations.sql` after the client portal migration. This adds the tenant-isolated enquiry table, audit log, service-only ingestion RPC and role-guarded workflow RPC.
2. Add the same Supabase project's `SUPABASE_URL` and server-only `SUPABASE_SECRET_KEY` to the Apsaras Sites project. Never expose the secret key in browser code. Deploy the Apsaras concierge with its new D1 migration; existing D1 leads and handoffs are queued for backfill.
3. Create and confirm the hotel manager's Supabase Auth user, then assign that email to `apsaras-tribe` with the Manager role in `/clients/admin`.
4. Verify a real guest enquiry end to end: public concierge capture, appearance in `/operations/apsaras`, manager assignment, status change and audit identity. Verify a Kazuko-only account cannot read the Apsaras table and an Apsaras-only account cannot open Kazuko.

The Apsaras dashboard reports enquiry volume, booking leads, open follow-ups, urgent handoffs, source mix and staff outcomes. Workflow actions do not send guest messages automatically and do not claim that a room is available or a booking is confirmed until staff explicitly records that outcome.
