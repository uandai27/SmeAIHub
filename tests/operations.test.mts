import test from 'node:test';
import assert from 'node:assert/strict';
import { issueSession, verifySession, matchesToken, SESSION_SECONDS } from '../lib/operations/session.ts';
import { summarize, manilaDay, dailyVolume, type RequestRow, type MessageRow } from '../lib/operations/metrics.ts';
const secret = 'a'.repeat(64);
const now = Date.parse('2026-10-04T00:00:00Z');
test('operations session expires, rejects tampering and is invalidated by key rotation', () => {
  const session = issueSession(secret, now);
  assert.equal(verifySession(session, secret, now), true);
  assert.equal(verifySession(session, secret, now + SESSION_SECONDS * 1000), false);
  assert.equal(verifySession(session, 'b'.repeat(64), now), false);
  assert.equal(verifySession(session.replace(/.$/, session.endsWith('0') ? '1' : '0'), secret, now), false);
  assert.equal(verifySession(session, '', now), false);
  assert.equal(matchesToken('', secret), false);
});
test('absence of bills differs from a recorded zero and only arrived reservations contribute sales', () => {
  const base = { request_type: 'reservation', status: 'arrived', sale_amount_php: null } as RequestRow;
  assert.equal(summarize([], [base]).revenue, null);
  assert.equal(summarize([], [{...base, sale_amount_php: 0}]).revenue, 0);
  const result = summarize([], [{...base, sale_amount_php: 500}, {...base, status: 'confirmed', sale_amount_php: 900}, {...base, request_type: 'handoff', sale_amount_php: 200}]);
  assert.equal(result.revenue, 500);
  assert.equal(result.recordedSales, 1);
  assert.equal(result.confirmed, 2);
});
test('Manila midnight boundaries and distinct guests use message records without inventing enquiries', () => {
  assert.equal(manilaDay('2026-10-03T16:00:00Z'), '2026-10-04');
  const messages = [{customer_hash: 'a', created_at: '2026-10-03T15:59:59Z', processing_status: 'completed'}, {customer_hash: 'a', created_at: '2026-10-03T16:00:00Z', processing_status: 'manual_review'}] as MessageRow[];
  assert.equal(summarize(messages, []).guests, 1);
  assert.equal(summarize(messages, []).replies, 1);
  assert.deepEqual(dailyVolume(messages, ['2026-10-03','2026-10-04']), [{day:'2026-10-03',count:1},{day:'2026-10-04',count:1}]);
});
