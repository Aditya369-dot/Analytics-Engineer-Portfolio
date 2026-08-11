import { projects } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Project = (typeof projects)[number];

const accentStyles: Record<Project["accent"], { line: string; glow: string; text: string; border: string }> = {
  violet: {
    line: "border-accent-violet/60 bg-accent-violet",
    glow: "bg-accent-violet/15",
    text: "text-violet-300",
    border: "hover:border-accent-violet/60",
  },
  blue: {
    line: "border-accent-blue/60 bg-accent-blue",
    glow: "bg-accent-blue/15",
    text: "text-blue-300",
    border: "hover:border-accent-blue/60",
  },
  cyan: {
    line: "border-accent-cyan/60 bg-accent-cyan",
    glow: "bg-accent-cyan/15",
    text: "text-cyan-300",
    border: "hover:border-accent-cyan/60",
  },
  magenta: {
    line: "border-fuchsia-400/60 bg-fuchsia-400",
    glow: "bg-fuchsia-400/15",
    text: "text-fuchsia-300",
    border: "hover:border-fuchsia-400/60",
  },
};

function ProjectVisual({ project }: { project: Project }) {
  const accent = accentStyles[project.accent];

  return (
    <div className="project-visual relative h-44 overflow-hidden border-b border-panel-border bg-panel-muted" aria-hidden="true">
      <div className={`absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${accent.glow}`} />
      <div className="absolute inset-x-5 top-5 flex items-center justify-between font-display text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Project / {project.number}</span>
        <span>Concept</span>
      </div>

      {project.visual === "utility" && (
        <div className="absolute inset-x-6 bottom-7 grid grid-cols-5 items-end gap-2">
          {[42, 68, 52, 86, 64].map((height, index) => (
            <span key={height} className="relative block h-20 border-b border-panel-border">
              <span className={`absolute inset-x-0 bottom-0 border-t ${accent.line}`} style={{ height: `${height}%`, opacity: 0.25 + index * 0.12 }} />
            </span>
          ))}
        </div>
      )}

      {project.visual === "finance" && (
        <svg className="absolute inset-x-6 bottom-6 h-20 w-[calc(100%-3rem)]" viewBox="0 0 260 80" preserveAspectRatio="none">
          <path d="M0 64 35 52 66 58 102 29 130 39 169 17 203 28 260 6" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
          <path d="M0 64 35 52 66 58 102 29 130 39 169 17 203 28 260 6V80H0Z" fill="url(#finance-fill)" opacity="0.25" />
          <defs>
            <linearGradient id="finance-fill" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="var(--color-blue)" />
              <stop offset="1" stopColor="var(--color-blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {project.visual === "healthcare" && (
        <svg className="absolute inset-x-6 bottom-8 h-16 w-[calc(100%-3rem)]" viewBox="0 0 260 64" preserveAspectRatio="none">
          <path d="M0 35h53l12-24 22 44 18-32 14 12h42l12-20 17 33 17-13h53" fill="none" stroke="var(--color-cyan)" strokeWidth="2" />
        </svg>
      )}

      {project.visual === "agents" && (
        <div className="absolute inset-x-10 bottom-7 top-16">
          <span className="absolute left-1/2 top-1/2 h-px w-2/5 -translate-y-1/2 bg-fuchsia-400/40" />
          <span className="absolute left-[30%] top-[25%] h-1/2 w-px rotate-45 bg-fuchsia-400/40" />
          <span className="absolute right-[30%] top-[25%] h-1/2 w-px -rotate-45 bg-fuchsia-400/40" />
          {[
            "left-[12%] top-1/2",
            "left-1/2 top-[12%]",
            "right-[12%] top-1/2",
            "left-1/2 bottom-[8%]",
            "left-1/2 top-1/2",
          ].map((position) => (
            <span key={position} className={`absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300 bg-fuchsia-400 shadow-[0_0_12px_var(--color-violet)] ${position}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const accent = accentStyles[project.accent];

  return (
    <article className={`group flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel transition-[border-color,transform] duration-200 hover:-translate-y-1 ${accent.border}`}>
      <ProjectVisual project={project} />
      <div className="flex flex-1 flex-col p-5">
        <p className={`font-display text-xs font-semibold tracking-[0.18em] ${accent.text}`}>/{project.number}</p>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-[-0.025em] text-foreground">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} categories`}>
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-md border border-panel-border bg-panel-muted px-2.5 py-1 font-display text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto grid grid-cols-3 gap-x-3 gap-y-3 border-t border-panel-border/70 pt-5">
          <a href={project.links.demo} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">Live demo</a>
          <a href={project.links.architecture} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">Architecture</a>
          <a href={project.links.github} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">GitHub</a>
          <a href={project.links.details} className={`col-span-3 flex items-center justify-between font-display text-xs font-semibold uppercase tracking-[0.12em] ${accent.text}`}>
            View details <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-4 border-b border-panel-border pb-7 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Selected systems</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.04em] text-foreground sm:text-4xl">
              Industry Projects
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-right">
            Data and AI concepts shaped around high-consequence operational decisions.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.number} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
