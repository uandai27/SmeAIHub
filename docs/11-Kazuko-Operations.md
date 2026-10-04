# Kazuko operations dashboard

## Implemented

Private `/operations/kazuko` page reads existing WhatsApp message and service-request records. Reporting supports 7/30-day Manila-date windows and previous-period message/request/arrival counts. Revenue is recorded bills for arrived reservations whose requests were created within the selected period: it is not POS revenue, revenue by visit date, or incremental AI sales. Today's data is incomplete. Historical records before instrumentation are not a verified baseline.

The all-date work queue supports owner assignment, notes, review, staff confirmation, arrival, cancellation and handoff resolution. Staff must contact guests separately. Arrival bills may be added/corrected; blank keeps an existing amount, zero is a recorded zero. Closing a delivery exception records manual resolution without sending a message. Processing messages require engineering investigation.

Updates use atomic RPCs with row locks, optimistic timestamps and an audit trail. Writes require an authenticated operations session, including direct server-action invocation. No database calls occur for unauthenticated reads. There are no sample records in production code. Read failures display unavailable metrics rather than zero totals.

## Deployment prerequisites

1. Back up the current database and apply `supabase/migrations/202610040001_kazuko_operations.sql` after the existing WhatsApp migration. The new default tenant assigns EXISTING data and the current webhook to Kazuko. Do not connect another customer to this webhook; multi-customer routing is not implemented.
2. Configure `SUPABASE_URL`, server-only `SUPABASE_SECRET_KEY`, and `KAZUKO_OPERATIONS_ACCESS_TOKEN` in the deployment environment. Generate a 32+ character random operations token (`node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`). Never commit the real value.
3. Deploy the feature branch to a preview environment connected to a test database. Check unauthorized access, empty data, reservation intake, staff confirmation, arrival/bill, handoff completion and manual exception resolution.
4. Before production, verify the displayed counts against the source tables and verify a second browser's stale update is rejected. Confirm staff understand that changing a status does not notify the guest.

## Initial access limitations

One Kazuko-scoped shared team key creates an 8-hour HttpOnly, SameSite=Strict session, Secure in production. Key rotation invalidates sessions. Self-entered operator names are not verified identities. There are no separate owner/staff/FDE roles or individual revocation yet; this first version is for a small authorized operations group, not payroll access. Do not store or render salary records here until individual identities and management-only roles exist.

## Newly received management PDFs

Hourly sales should go into a private structured financial dataset, not the public concierge knowledge module. The report covers Jan–Sep 2026, with hourly buckets representing each month's bucket totals and an average across months. It is not daily/hourly average sales per operating day. Confirm January zero buckets and the final `23:01–00:00` label before comparing periods. Sales alone do not establish hourly losses; costs, margins, operating days and shift coverage are needed.

Employee/payroll source documents belong in restricted management storage. Confirm salary period, effective date, meaning of TS, headcount and whether totals include overtime, statutory employer costs and benefits. Do not put source documents, employee names or salaries into this public Git repository, public chatbot prompts, or a shared-key dashboard. Neither PDF was imported by this implementation.

## Validation

Run `npm run lint`, `npm test`, `npm run build`. Operations tests distinguish absent bills from zero, exclude unarrived/handoff sales, check Manila midnight boundaries, and verify session expiry, tampering and key rotation. Migration was exercised against an isolated PostgreSQL-compatible PGlite database, including invalid transitions, stale-write conflicts, audit insertion and exception closure. Production connectivity and customer UAT still require the real configured environment.
