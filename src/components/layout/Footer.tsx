import { portfolioNavigation } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-panel-border/70 py-7">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <a href="#home" className="font-display text-lg font-bold tracking-[-0.05em] text-foreground" aria-label="Aditya Bholla, home">
          AB<span className="text-accent-violet">.</span>
        </a>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
          {portfolioNavigation.map((item) => (
            <a key={item.href} href={item.href} className="text-xs text-muted-foreground transition-colors hover:text-accent-cyan">
              {item.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">Data × AI × Engineering</p>
      </Container>
    </footer>
  );
}
