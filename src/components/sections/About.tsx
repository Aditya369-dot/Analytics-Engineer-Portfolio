import { aboutContent, impactMetrics, techStack } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-16">
          <div>
            <SectionLabel>{aboutContent.label}</SectionLabel>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-foreground">
              {aboutContent.titleLead}{" "}
              <span className="text-accent-violet">{aboutContent.titleAccent}</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end border-l border-panel-border pl-6 sm:pl-8">
            {aboutContent.bio.map((paragraph) => (
              <p key={paragraph} className="mb-4 max-w-xl text-base leading-7 text-muted-foreground last:mb-0">
                {paragraph}
              </p>
            ))}
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Working principles">
              {aboutContent.principles.map((principle) => (
                <li key={principle} className="rounded-md border border-panel-border bg-panel-muted px-3 py-1.5 font-display text-[0.6875rem] uppercase tracking-[0.12em] text-foreground">
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel-border sm:grid-cols-2 xl:grid-cols-4">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="bg-panel p-6">
              <dt className="font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">{metric.label}</dt>
              <dd className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{metric.value}</dd>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.detail}</p>
            </div>
          ))}
        </dl>

        <div id="tech-stack" className="scroll-mt-24 pt-16 sm:pt-20">
          <div className="grid gap-8 border-t border-panel-border pt-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <SectionLabel>Technical toolkit</SectionLabel>
              <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.04em] text-foreground sm:text-4xl">
                Tech Stack
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {techStack.map((group) => (
                <div key={group.category} className="rounded-[var(--radius-panel)] border border-panel-border bg-panel-muted p-5">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent-cyan">{group.category}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-lg border border-panel-border bg-panel px-3 py-2 text-sm text-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
