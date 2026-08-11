"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioLinks, portfolioNavigation } from "@/data/portfolio";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-panel-border/80 bg-background/90 backdrop-blur-md">
      <Container className="relative flex min-h-18 items-center justify-between gap-6">
        <a
          href="#home"
          className="group inline-flex items-baseline font-display text-xl font-bold tracking-[-0.05em] text-foreground"
          aria-label="Aditya Bholla, home"
          onClick={closeMenu}
        >
          AB<span className="text-accent-violet transition-colors group-hover:text-accent-cyan">.</span>
        </a>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary navigation">
          {portfolioNavigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-accent-cyan"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href={portfolioLinks.cv}
            className="hidden min-h-10 px-4 py-2 text-xs sm:inline-flex"
          >
            Download CV
          </ButtonLink>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-panel-border bg-panel text-foreground transition-colors hover:border-accent-cyan hover:text-accent-cyan xl:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 block h-px w-5 bg-current transition-transform ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-px w-5 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] block h-px w-5 bg-current transition-transform ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={`absolute inset-x-0 top-[calc(100%+0.75rem)] rounded-[var(--radius-panel)] border border-panel-border bg-background-elevated p-3 shadow-[0_16px_50px_rgba(0,0,0,0.35)] sm:left-auto sm:w-96 xl:hidden ${isMenuOpen ? "block" : "hidden"}`}
        >
          <nav className="grid" aria-label="Mobile navigation">
            {portfolioNavigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 font-display text-sm font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-panel hover:text-accent-cyan"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <ButtonLink
              href={portfolioLinks.cv}
              className="mt-3 sm:hidden"
              onClick={closeMenu}
            >
              Download CV
            </ButtonLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
