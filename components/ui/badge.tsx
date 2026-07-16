import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600 ${className}`}
    >
      {children}
    </span>
  );
}