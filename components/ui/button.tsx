import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const styles = {
  primary:
    "bg-neutral-950 text-white hover:bg-neutral-800",
  secondary:
    "border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}