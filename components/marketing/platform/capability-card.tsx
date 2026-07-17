import type { LucideIcon } from "lucide-react";

type CapabilityCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function CapabilityCard({
  title,
  description,
  icon: Icon,
}: CapabilityCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
        <Icon
          aria-hidden="true"
          className="size-6 text-slate-700"
        />
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </article>
  );
}