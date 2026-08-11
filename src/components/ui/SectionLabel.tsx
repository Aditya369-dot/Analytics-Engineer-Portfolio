import type { HTMLAttributes } from "react";

type SectionLabelProps = HTMLAttributes<HTMLParagraphElement>;

export function SectionLabel({ className = "", ...props }: SectionLabelProps) {
  return (
    <p
      className={`font-display text-xs font-semibold uppercase tracking-[0.22em] text-accent-cyan ${className}`}
      {...props}
    />
  );
}
