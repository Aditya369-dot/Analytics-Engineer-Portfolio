import type { CSSProperties } from "react";
import { careerMilestones } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Milestone = (typeof careerMilestones)[number];

const accentStyles: Record<Milestone["accent"], { node: string; text: string }> = {
  violet: { node: "border-violet-300 bg-accent-violet", text: "text-violet-300" },
  blue: { node: "border-blue-300 bg-accent-blue", text: "text-blue-300" },
  cyan: { node: "border-cyan-200 bg-accent-cyan", text: "text-cyan-300" },
  future: { node: "border-emerald-200 bg-status", text: "text-emerald-300" },
};

function MilestoneContent({ milestone }: { milestone: Milestone }) {
  const accent = accentStyles[milestone.accent];

  return (
    <>
      <p className={`font-display text-xs font-semibold uppercase tracking-[0.16em] ${accent.text}`}>
        {milestone.year}
      </p>
      <h3 className="mt-2 font-display text-base font-semibold leading-tight text-foreground">
        {milestone.role}
      </h3>
      {milestone.employer && (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{milestone.employer}</p>
      )}
      <p className="mt-3 border-t border-panel-border/70 pt-3 font-display text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
        {milestone.stage}
      </p>
    </>
  );
}

function DesktopTrajectory() {
  return (
    <div className="career-grid relative hidden h-[30rem] overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel-muted lg:block">
      <div className="absolute inset-x-6 top-5 flex justify-between font-display text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Career signal / 2020—future</span>
        <span>Ascending trajectory</span>
      </div>

      <svg className="absolute inset-x-0 bottom-8 h-72 w-full" viewBox="0 0 1000 288" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="career-line" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="var(--color-violet)" />
            <stop offset="0.5" stopColor="var(--color-blue)" />
            <stop offset="0.78" stopColor="var(--color-cyan)" />
            <stop offset="1" stopColor="var(--color-status)" />
          </linearGradient>
        </defs>
        <path d="M100 250 C180 250 220 224 300 216 S420 192 500 168 S620 132 700 108 S820 70 900 48" fill="none" stroke="url(#career-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M100 250 C180 250 220 224 300 216 S420 192 500 168 S620 132 700 108 S820 70 900 48" fill="none" stroke="url(#career-line)" strokeWidth="10" opacity="0.12" vectorEffect="non-scaling-stroke" />
      </svg>

      <ol className="absolute inset-x-0 bottom-8 top-0 grid grid-cols-5">
        {careerMilestones.map((milestone) => {
          const accent = accentStyles[milestone.accent];
          const levelStyle = { "--career-level": `${milestone.level}px` } as CSSProperties;

          return (
            <li key={`${milestone.year}-${milestone.role}`} className="relative min-w-0" style={levelStyle}>
              <article className="career-card absolute inset-x-3 rounded-xl border border-panel-border bg-background-elevated/95 p-4">
                <MilestoneContent milestone={milestone} />
              </article>
              <span className={`career-node absolute left-1/2 size-3 -translate-x-1/2 rounded-full border-2 shadow-[0_0_18px_currentColor] ${accent.node}`} aria-hidden="true" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MobileTrajectory() {
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-7 before:left-[0.4375rem] before:top-7 before:w-px before:bg-linear-to-b before:from-accent-violet before:via-accent-cyan before:to-status lg:hidden">
      {careerMilestones.map((milestone) => {
        const accent = accentStyles[milestone.accent];

        return (
          <li key={`${milestone.year}-${milestone.role}`} className="relative pl-9">
            <span className={`absolute left-0 top-6 z-10 size-3.5 rounded-full border-2 shadow-[0_0_14px_currentColor] ${accent.node}`} aria-hidden="true" />
            <article className="rounded-[var(--radius-panel)] border border-panel-border bg-panel p-5">
              <MilestoneContent milestone={milestone} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export function CareerTrajectory() {
  return (
    <section id="career" className="scroll-mt-24 border-y border-panel-border/50 bg-background-elevated py-20 sm:py-24">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Professional evolution</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.04em] text-foreground sm:text-4xl">
              Career Trajectory
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-right">
            Data Analysis → Business Intelligence → Analytics Engineering → AI &amp; Platform Engineering
          </p>
        </div>

        <DesktopTrajectory />
        <MobileTrajectory />
      </Container>
    </section>
  );
}
