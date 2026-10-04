import Link from 'next/link';
import { requirePortalClient } from '@/lib/server/client-portal';
import { logout } from '@/app/login/actions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Apsaras Workspace', robots: { index: false, follow: false } };
export default async function Apsaras() {
  const { client } = await requirePortalClient('apsaras-tribe');
  return <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900"><div className="mx-auto max-w-5xl"><header className="flex justify-between gap-4"><Link href="/clients" className="text-emerald-800 underline">All workspaces</Link><form action={logout}><button className="rounded-xl border bg-white px-4 py-2">Sign out</button></form></header><h1 className="mt-10 text-3xl font-semibold">{client.name}</h1><section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-semibold">Hotel operations setup</h2><p className="mt-4 text-slate-600">Your private workspace is ready for configuration. Hotel enquiries, reservation sources and reporting data have not been connected yet.</p><p className="mt-4 text-sm text-slate-500">No occupancy, revenue or booking metrics are available until those sources are verified.</p></section></div></main>;
}
