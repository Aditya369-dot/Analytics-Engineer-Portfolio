import { contactContent, socialLinks } from "@/data/portfolio";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-10 sm:py-14">
      <Container>
        <div className="contact-panel relative overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <SectionLabel>{contactContent.label}</SectionLabel>
              <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground">
                {contactContent.title}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {contactContent.description}
              </p>
            </div>
            <ButtonLink href={contactContent.cta.href} className="w-full sm:w-fit">
              {contactContent.cta.label}
              <span className="ml-2" aria-hidden="true">↗</span>
            </ButtonLink>
          </div>

          <nav className="relative z-10 mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-panel-border pt-6" aria-label="Contact channels">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} className="font-display text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
