import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
export const SESSION_SECONDS = 8 * 60 * 60;
export function matchesToken(candidate: string, secret: string) {
  return timingSafeEqual(createHash('sha256').update(candidate).digest(), createHash('sha256').update(secret).digest());
}
export function issueSession(secret: string, now = Date.now()) {
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${createHmac('sha256', secret).update(`kazuko:${expires}`).digest('hex')}`;
}
export function verifySession(value: string, secret: string, now = Date.now()) {
  if (!secret || secret.length < 32) return false;
  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(value);
  if (!match) return false;
  const expires = Number(match[1]);
  if (expires <= Math.floor(now / 1000) || expires > Math.floor(now / 1000) + SESSION_SECONDS) return false;
  const expected = createHmac('sha256', secret).update(`kazuko:${match[1]}`).digest('hex');
  return matchesToken(match[2], expected);
}
