import { heroContent, socialLinks } from "@/data/portfolio";
import { KnowledgeGraph } from "@/components/hero/KnowledgeGraph";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

type SocialIconProps = {
  icon: (typeof socialLinks)[number]["icon"];
};

function SocialIcon({ icon }: SocialIconProps) {
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.69c0-3.84-2.05-5.63-4.79-5.63a4.15 4.15 0 0 0-3.75 2.06V8.25H9.21V21h3.25v-6.31c0-1.66.32-3.28 2.39-3.28 2.04 0 2.06 1.91 2.06 3.39V21H21v-7.31Z" />
      </svg>
    );
  }

  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" clipRule="evenodd" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function VisualPlaceholder({
  index,
  label,
  title,
  className = "",
}: {
  index: string;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`hero-visual relative isolate min-h-80 overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel-muted ${className}`}
      aria-label={`${title} placeholder`}
    >
      <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between font-display text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{index}</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-status" />
          {label}
        </span>
      </div>

      <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <div className="hero-orbit size-44 rounded-full border border-accent-violet/30" />
        <div className="absolute size-28 rounded-full border border-accent-blue/25" />
        <div className="absolute size-2 rounded-full bg-accent-cyan shadow-[0_0_18px_var(--color-cyan)]" />
      </div>

      <div className="absolute inset-x-5 bottom-5 z-10 border-t border-panel-border/70 pt-4">
        <p className="font-display text-sm font-medium uppercase tracking-[0.14em] text-foreground">
          {title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Visual module reserved</p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative scroll-mt-18 overflow-hidden border-b border-panel-border/50 py-12 sm:py-16 xl:py-16">
      <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative grid items-center gap-6 md:grid-cols-2 xl:grid-cols-[minmax(0,1.12fr)_minmax(17rem,0.9fr)_minmax(18rem,1fr)] xl:gap-8">
        <div className="py-2 md:col-span-2 xl:col-span-1 xl:pr-5">
          <SectionLabel>{heroContent.eyebrow}</SectionLabel>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.055em] text-foreground xl:text-[clamp(3.25rem,5vw,5rem)]">
            {heroContent.titleLead}{" "}
            <span className="text-accent-violet">{heroContent.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {heroContent.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={heroContent.actions.primary.href}>
              {heroContent.actions.primary.label}
              <span className="ml-2" aria-hidden="true">↗</span>
            </ButtonLink>
            <ButtonLink href={heroContent.actions.secondary.href} variant="secondary">
              {heroContent.actions.secondary.label}
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-panel-border/70 pt-5">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full rounded-full bg-status opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-status" />
              </span>
              {heroContent.status}
            </p>
            <div className="flex gap-2" aria-label="Social links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="grid size-9 place-items-center rounded-lg border border-panel-border bg-panel-muted text-muted-foreground transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                  aria-label={social.label}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <KnowledgeGraph className="md:min-h-[28rem] xl:min-h-[30rem]" />
        <VisualPlaceholder
          index="SYS / 02"
          label="Asset pending"
          title="Digital twin"
          className="min-h-64 sm:min-h-80 md:min-h-[28rem] xl:min-h-[34rem]"
        />
      </Container>
    </section>
  );
}
