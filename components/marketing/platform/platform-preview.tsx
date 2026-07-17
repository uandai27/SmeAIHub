import { CapabilityGrid } from "./capability-grid";
import { DashboardPreview } from "./dashboard-preview";

export function PlatformPreview() {
  return (
    <section
      id="platform"
      className="bg-slate-50 py-24"
      aria-labelledby="platform-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            THE SMEAIHUB PLATFORM
          </p>

          <h2
            id="platform-heading"
            className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl"
          >
            One platform to run your business with AI.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Manage conversations, bookings, customers, marketing,
            and business insights from one intelligent workspace.
          </p>
        </div>

        <div className="mt-16">
          <DashboardPreview />
        </div>

        <div className="mt-16">
          <CapabilityGrid />
        </div>
      </div>
    </section>
  );
}