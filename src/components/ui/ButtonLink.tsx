import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const variants = {
  primary:
    "border-accent-violet bg-accent-violet text-white shadow-[0_0_24px_color-mix(in_srgb,var(--color-violet)_12%,transparent)] hover:border-accent-violet-bright hover:bg-accent-violet-bright",
  secondary:
    "border-panel-border bg-panel text-foreground hover:border-accent-cyan hover:text-accent-cyan",
} as const;

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.08em] transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-px ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
