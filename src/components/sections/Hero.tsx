"use client";

import { useCallback, useRef, useState } from "react";
import { heroContent, socialLinks } from "@/data/portfolio";
import { DigitalTwin } from "@/components/hero/DigitalTwin";
import { KnowledgeGraph3D } from "@/components/hero/KnowledgeGraph3D";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useTwinSpeech } from "@/hooks/useTwinSpeech";
import {
  emptyGraphFocus,
  graphFocusFromKnowledgeIds,
  graphNeighborhood,
  type GraphFocus,
  type GraphNodeId,
} from "@/data/graph-data";

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

export function Hero() {
  const [activeFocus, setActiveFocus] = useState<GraphFocus>(emptyGraphFocus);
  const speech = useTwinSpeech();
  const activeAiRequest = useRef(0);
  const manualOverride = useRef(false);
  const titleWords = heroContent.titleLead.split(" ");

  const clearFocus = useCallback(() => {
    manualOverride.current = true;
    setActiveFocus(emptyGraphFocus);
  }, []);
  const selectNode = useCallback((nodeId: GraphNodeId) => {
    manualOverride.current = true;
    setActiveFocus({
      source: "manual",
      primaryNodeIds: [nodeId],
      relatedNodeIds: graphNeighborhood(nodeId),
    });
  }, []);
  const startAiQuestion = useCallback((requestId: number) => {
    activeAiRequest.current = requestId;
    manualOverride.current = false;
    setActiveFocus(emptyGraphFocus);
  }, []);
  const applyAiFocus = useCallback((nodeIds: Parameters<typeof graphFocusFromKnowledgeIds>[0], relatedIds: Parameters<typeof graphFocusFromKnowledgeIds>[1], requestId: number) => {
    if (requestId !== activeAiRequest.current || manualOverride.current) return;
    setActiveFocus(graphFocusFromKnowledgeIds(nodeIds, relatedIds));
  }, []);

  return (
    <section id="home" className="relative scroll-mt-18 overflow-hidden border-b border-panel-border/50 py-10 sm:py-12 xl:min-h-[44rem] xl:py-8">
      <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative grid items-center gap-6 md:grid-cols-2 xl:min-h-[40rem] xl:grid-cols-[minmax(0,0.9fr)_minmax(13rem,0.9fr)_minmax(17.5rem,0.56fr)] xl:gap-4">
        <KnowledgeGraph3D
          integrated
          className="order-2 min-h-[24rem] md:col-span-2 xl:absolute xl:inset-y-[-1rem] xl:left-[20%] xl:right-[17%] xl:min-h-0"
          focus={activeFocus}
          onNodeSelect={selectNode}
          onFocusClear={clearFocus}
          speech={speech}
        />

        <div className="relative z-20 order-1 py-2 md:col-span-2 xl:col-span-1 xl:pr-4">
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 hidden bg-[radial-gradient(ellipse_at_left,rgba(7,8,13,.98)_35%,rgba(7,8,13,.78)_62%,transparent_82%)] xl:block" aria-hidden="true" />
          <SectionLabel className="text-[0.625rem]">{heroContent.eyebrow}</SectionLabel>
          <h1 className="mt-4 max-w-xl font-display text-[clamp(2.55rem,10vw,4.25rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em] text-foreground xl:text-[clamp(3.5rem,4vw,4.25rem)]">
            <span className="block">{titleWords.slice(0, 2).join(" ")}</span>
            <span className="block">{titleWords[2]}</span>
            <span className="block">{titleWords[3]}</span>
            <span className="block text-accent-violet">{heroContent.titleAccent.split(" ")[0]}</span>
            <span className="block text-accent-violet">{heroContent.titleAccent.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="mt-5 max-w-[29rem] text-sm leading-6 text-muted-foreground sm:text-base">
            {heroContent.description}
          </p>

          <div className="mt-6 flex">
            <ButtonLink className="min-h-10 px-4 py-2 text-xs" href={heroContent.actions.primary.href}>
              {heroContent.actions.primary.label}
              <span className="ml-2" aria-hidden="true">↗</span>
            </ButtonLink>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-panel-border/70 pt-4">
            <p className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
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
                  className="grid size-8 place-items-center rounded-lg border border-panel-border bg-panel-muted text-muted-foreground transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                  aria-label={social.label}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <DigitalTwin
          className="relative z-30 order-3 min-h-60 bg-background-elevated/82 shadow-[0_0_42px_rgba(7,8,13,.7),0_0_22px_rgba(139,92,246,.08)] backdrop-blur-md sm:min-h-72 md:min-h-[23rem] xl:col-start-3 xl:min-h-[27rem] xl:w-[18rem] xl:justify-self-end"
          onQuestionStart={startAiQuestion}
          onGraphResponse={applyAiFocus}
          speech={speech}
        />
      </Container>
    </section>
  );
}
