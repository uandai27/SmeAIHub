export function validCredentials(email: string, password: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8 && password.length <= 256;
}
export function dashboardPath(slug: string) {
  if (slug === 'kazuko' || slug === 'apsaras') return `/operations/${slug}`;
  return null;
}
export function isPortalKey(key: string) {
  if (key.startsWith('sb_publishable_')) return true;
  try {
    const parts = key.split('.');
    return parts.length === 3 && JSON.parse(Buffer.from(parts[1], 'base64url').toString()).role === 'anon';
  } catch { return false; }
}
