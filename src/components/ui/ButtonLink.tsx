import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const variants = {
  primary:
    "border-accent-violet bg-accent-violet text-white hover:border-violet-400 hover:bg-violet-500",
  secondary:
    "border-panel-border bg-panel text-foreground hover:border-accent-blue hover:text-blue-300",
} as const;

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.08em] transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
