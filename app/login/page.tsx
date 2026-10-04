import Link from 'next/link';
import { redirect } from 'next/navigation';
import { portalConfigured, portalUser } from '@/lib/server/client-portal';
import { login } from './actions';
import { legacyKazukoEnabled } from '@/lib/server/legacy-kazuko-access';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Client Login', robots: { index: false, follow: false } };
export default async function Login({ searchParams }: { searchParams: Promise<{notice?: string}> }) {
  if (await portalUser()) redirect('/clients');
  const { notice } = await searchParams;
  const ready = portalConfigured();
  const legacy = await legacyKazukoEnabled();
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 text-slate-900"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><Link href="/" className="font-semibold text-emerald-800">SmeAIHub</Link><h1 className="mt-6 text-3xl font-semibold">Client Login</h1><p className="mt-3 text-sm text-slate-600">Sign in with your employee account to open your business workspace.</p>{notice && <p role="alert" className="mt-4 text-sm text-amber-800">{notice === 'session' ? 'Your session ended. Please sign in again.' : 'Could not sign in. Check your credentials or contact your administrator.'}</p>}{ready ? <form action={login} className="mt-6 space-y-4"><label className="block text-sm">Email<input name="email" type="email" required maxLength={254} autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-200 p-3"/></label><label className="block text-sm">Password<input name="password" type="password" required minLength={8} maxLength={256} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 p-3"/></label><button className="w-full rounded-xl bg-emerald-800 py-3 font-medium text-white">Sign in</button></form> : <p role="status" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Employee account login is being configured. Contact your SmeAIHub administrator for access.</p>}<p className="mt-5 text-xs text-slate-500">Accounts are provisioned by your administrator. For password help, contact your administrator. Sessions last up to one hour.</p>{legacy && <Link href="/operations/kazuko" className="mt-6 block border-t border-slate-100 pt-5 text-sm text-emerald-800 underline">Kazuko team: existing access key login</Link>}</section></main>;
}
