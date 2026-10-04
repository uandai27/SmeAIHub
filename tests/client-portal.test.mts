import test from 'node:test';
import assert from 'node:assert/strict';
import { isPortalKey, dashboardPath, validCredentials } from '../lib/portal/validation.ts';
const jwt = (role: string) => `header.${Buffer.from(JSON.stringify({role})).toString('base64url')}.signature`;
test('a client configuration cannot use either form of privileged service key', () => {
  assert.equal(isPortalKey('sb_publishable_example'), true);
  assert.equal(isPortalKey(jwt('anon')), true);
  assert.equal(isPortalKey('sb_secret_example'), false);
  assert.equal(isPortalKey(jwt('service_role')), false);
  assert.equal(isPortalKey(jwt('authenticated')), false);
  assert.equal(isPortalKey('malformed'), false);
});
test('dashboard destinations do not accept arbitrary tenant paths or open redirects', () => {
  assert.equal(dashboardPath('kazuko'), '/operations/kazuko');
  assert.equal(dashboardPath('apsaras'), '/operations/apsaras');
  for (const value of ['../kazuko','https://example.org','//example.org','unknown']) assert.equal(dashboardPath(value), null);
});
test('login rejects oversized credentials without changing the submitted password', () => {
  assert.equal(validCredentials('employee@example.org','abc12345'),true);
  assert.equal(validCredentials('invalid','abc12345'),false);
  assert.equal(validCredentials('employee@example.org','short'),false);
  assert.equal(validCredentials('employee@example.org','a'.repeat(257)),false);
});
