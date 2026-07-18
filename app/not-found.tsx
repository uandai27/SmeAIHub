import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_35%)]"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <header>
          <Link
  href="/"
  className="inline-flex items-center gap-2 text-xl tracking-[-0.03em] text-zinc-950 transition-opacity hover:opacity-70"
  aria-label="SmeAIHub home"
>
  <Image
    src="/brand/logo-mark.svg"
    alt=""
    width={28}
    height={28}
    priority
    aria-hidden="true"
  />

  <span className="leading-none">
    <span className="font-semibold">Sme</span>
    <span className="font-bold">AI</span>
    <span className="font-semibold">Hub</span>
  </span>
</Link>
        </header>

        <section className="flex flex-1 items-center py-16 sm:py-24">
          <div className="max-w-[900px]">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Error 404
            </p>

            <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl">
              This page is outside the workspace.
            </h1>

            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-zinc-600 sm:text-xl">
              The page you are looking for may have moved, been removed, or
              never existed. Let&apos;s get you back to SmeAIHub.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back to home
              </Link>

              <Link
                href="/demo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-950 transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                <CalendarDays aria-hidden="true" className="size-4" />
                Book a demo
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-zinc-100 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>AI built for real business growth.</p>
          <p>© {new Date().getFullYear()} SmeAIHub</p>
        </footer>
      </div>
    </main>
  );
}