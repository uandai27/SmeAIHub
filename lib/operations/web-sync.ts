import { createHmac } from 'node:crypto';

export const KAZUKO_WEB_SYNC_URL = 'https://kazuko-ramenba-concierge.uandworld.chatgpt.site/api/internal/dashboard-sync';
export function signWebSync(secret: string, now = Date.now()) {
  const body = JSON.stringify({ issuedAt: now });
  const signature = createHmac('sha256', secret).update(`kazuko-dashboard-sync:${body}`).digest('hex');
  return { body, signature };
}
