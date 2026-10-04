# Kazuko operations dashboard

## Implemented

Private `/operations/kazuko` page reads existing WhatsApp message and service-request records. Reporting supports 7/30-day Manila-date windows and previous-period message/request/arrival counts. Revenue is recorded bills for arrived reservations whose requests were created within the selected period: it is not POS revenue, revenue by visit date, or incremental AI sales. Today's data is incomplete. Historical records before instrumentation are not a verified baseline.

The public website header includes **Client Login**, pointing to `/login`. Employee accounts select their authorized workspace at `/clients`; the existing Kazuko shared-key access remains available during enrollment. See `12-Client-Portal.md` for production activation, member roles and the administrator cutover that revokes legacy-key access. The demo booking CTA remains available beside it.

The all-date work queue supports owner assignment, notes, review, staff confirmation, arrival, cancellation and handoff resolution. Staff must contact guests separately. Arrival bills may be added/corrected; blank keeps an existing amount, zero is a recorded zero. Closing a delivery exception records manual resolution without sending a message. Processing messages require engineering investigation.

Updates use atomic RPCs with row locks, optimistic timestamps and an audit trail. Writes require an authenticated operations session, including direct server-action invocation. No database calls occur for unauthenticated reads. There are no sample records in production code. Read failures display unavailable metrics rather than zero totals.

## Deployment prerequisites

1. Back up the current database and apply `supabase/migrations/202610040001_kazuko_operations.sql` after the existing WhatsApp migration. The new default tenant assigns EXISTING data and the current webhook to Kazuko. Do not connect another customer to this webhook; multi-customer routing is not implemented.
2. Configure `SUPABASE_URL`, server-only `SUPABASE_SECRET_KEY`, and `KAZUKO_OPERATIONS_ACCESS_TOKEN` in the deployment environment. Generate a 32+ character random operations token (`node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`). Never commit the real value.
3. Deploy the feature branch to a preview environment connected to a test database. Check unauthorized access, empty data, reservation intake, staff confirmation, arrival/bill, handoff completion and manual exception resolution.
4. Before production, verify the displayed counts against the source tables and verify a second browser's stale update is rejected. Confirm staff understand that changing a status does not notify the guest.

## Initial access limitations

One Kazuko-scoped shared team key creates an 8-hour HttpOnly, SameSite=Strict session, Secure in production. Key rotation invalidates sessions. Self-entered operator names are not verified identities. There are no separate owner/staff/FDE roles or individual revocation yet; this first version is for a small authorized operations group, not payroll access. Do not store or render salary records here until individual identities and management-only roles exist.

## Website reservation synchronization

Apply `supabase/migrations/202610040002_kazuko_web_reservations.sql` after the operations migration. The concierge Site at `https://kazuko-ramenba-concierge.uandworld.chatgpt.site/` needs the same server-only `SUPABASE_URL` and `SUPABASE_SECRET_KEY` as this deployment, configured in Sites production settings. Never use a publishable/anonymous key or place either credential in client code.

The Site retains the original booking in D1 and adds a durable sync record in the same transaction. Each conversation turn attempts up to three queued web bookings. Failed deliveries stay queued with a 30-second backoff; there is no scheduled background retry. Authorized operators can click **Sync website bookings** to import history or retry. This server action signs a short-lived, domain-separated HMAC request to the Site; it never exposes the service key to the browser. The Site rejects unsigned, expired and tampered requests. Rotating the Supabase key requires updating both servers.

The service-role-only ingestion function fixes the tenant to Kazuko, deduplicates by original `KR-...` reference and never overwrites existing owner, note, status or bill. Original creation timestamps are preserved. A replay after a network timeout therefore creates no duplicate. All older D1 `source = web` requests are queued when the Site initializes; historical import does not create WhatsApp staff alerts. The existing employee notification queue remains independent.

Web requests use `intake_source = web` and have no WhatsApp message or sender. They contribute to reservation, arrival and recorded-bill metrics, but not WhatsApp message volume. Original date/time wording is preserved because relative or ambiguous dates cannot safely be converted to a calendar booking without staff confirmation. The work queue covers all dates; period cards use request creation dates, so imported older bookings may only appear in 30-day cards and the all-date queue.

Synchronization is one-way intake, not bidirectional booking management. Staff updates in the operations dashboard do not change the Site's D1 status or send the guest a message. Deleting a D1 booking does not delete its dashboard record. Web handoffs and Green API conversations are outside this web-reservation sync change. Arrival/bills and individual staff roles retain the first-version limitations above.

## Newly received management PDFs

Hourly sales should go into a private structured financial dataset, not the public concierge knowledge module. The report covers Jan–Sep 2026, with hourly buckets representing each month's bucket totals and an average across months. It is not daily/hourly average sales per operating day. Confirm January zero buckets and the final `23:01–00:00` label before comparing periods. Sales alone do not establish hourly losses; costs, margins, operating days and shift coverage are needed.

Employee/payroll source documents belong in restricted management storage. Confirm salary period, effective date, meaning of TS, headcount and whether totals include overtime, statutory employer costs and benefits. Do not put source documents, employee names or salaries into this public Git repository, public chatbot prompts, or a shared-key dashboard. Neither PDF was imported by this implementation.

## Validation

Run `npm run lint`, `npm test`, `npm run build`. Operations tests distinguish absent bills from zero, exclude unarrived/handoff sales, check Manila midnight boundaries, and verify session expiry, tampering and key rotation. Migration was exercised against an isolated PostgreSQL-compatible PGlite database, including invalid transitions, stale-write conflicts, audit insertion and exception closure. Production connectivity and customer UAT still require the real configured environment.
