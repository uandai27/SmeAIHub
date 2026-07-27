# AI Deal Room Operations

## Production services

The secure agreement workflow depends on:

- Supabase for private deal state, locked agreement versions, access tokens,
  signature records, payment records, and audit events.
- Dropbox Sign for embedded electronic signatures and final signature evidence.
- Stripe Checkout for the implementation payment and recurring monthly fee.

The public `/deal/[slug]` route is a non-signable preview. Only an expiring
`/sign/[token]` route can initiate signing.

## Initial setup

1. Create a Supabase project.
2. Run `supabase/migrations/202607260001_deal_signing_and_billing.sql`.
3. Configure all server variables listed in `.env.example`.
4. Add each approved agreement PDF under `assets/contracts` and map it in
   `lib/server/dropbox-sign.ts`. The server uploads the approved PDF directly
   and places signer fields with `form_fields_per_document`; a paid reusable
   Dropbox Sign template is not required.
5. Configure the Dropbox Sign app callback:
   `/api/webhooks/dropbox-sign`.
6. Configure the Stripe webhook:
   `/api/webhooks/stripe`.
7. Subscribe the Stripe endpoint to `checkout.session.completed`.
8. Bootstrap the approved pilots:

   ```text
   npm run deal:bootstrap
   ```

9. Issue an expiring private link:

   ```text
   npm run deal:issue -- kazuko-ramenba-pilot 14
   npm run deal:issue -- apsaras-tribe-pilot 14
   ```

The raw access token is displayed only once. Store and share it as a sensitive
business link. The database stores only its SHA-256 hash.

The current Test Mode signing document is configured for Kazuko Ramenba. Add
and validate a separately approved hotel PDF and field map before enabling the
Apsaras signing link.

## State transitions

```text
ready_for_review
→ signature_requested
→ signed
→ awaiting_payment
→ paid
→ onboarding
→ active
```

The server rejects Checkout creation until Dropbox Sign has confirmed the
agreement. The application marks a payment as paid only after a verified Stripe
webhook; the browser return URL is never treated as proof of payment.

## Security controls

- Supabase Row Level Security is enabled on every deal table.
- No anonymous database policies are created.
- The Supabase secret key is server-only.
- Private access tokens expire and can be revoked.
- Contract versions are locked with a content SHA-256 value.
- Duplicate signing requests reuse the existing pending signature.
- Dropbox Sign events use HMAC verification.
- Stripe events use raw-body signature verification with a five-minute
  tolerance.
- Provider event IDs make webhook processing idempotent.
- Public and secure agreement routes are excluded from search indexing.

## Before the first live signature

- Have the Restaurant and Hotel agreements reviewed by qualified counsel.
- Confirm the legal customer entity, signer authority, addresses, governing
  law, taxes, cancellation, and data-processing provisions.
- Test the complete flow in Dropbox Sign and Stripe test modes.
- Confirm callback delivery and audit records in Supabase.
- Confirm the signed PDF can be downloaded and retained.
- Rotate all test secrets before enabling production mode.
