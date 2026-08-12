"use client";

import { useRef, useState } from "react";
import { DigitalTwinComposer } from "@/components/hero/DigitalTwinComposer";
import { DigitalTwinConversation } from "@/components/hero/DigitalTwinConversation";
import { DigitalTwinNarration } from "@/components/hero/DigitalTwinNarration";
import {
  suggestedTwinQuestions,
} from "@/data/digital-twin-chat";
import { askDigitalTwin, TwinChatClientError } from "@/lib/twin-chat-client";
import type { DigitalTwinNarration as DigitalTwinNarrationState } from "@/types/digital-twin-chat";
import type { KnowledgeItemId } from "@/data/knowledge";

export type DigitalTwinProps = {
  className?: string;
  onGraphResponse?: (
    nodeIds: readonly KnowledgeItemId[],
    relatedNodeIds: readonly KnowledgeItemId[],
    requestId: number,
  ) => void;
  onQuestionStart?: (requestId: number) => void;
};

export function DigitalTwin({ className = "", onGraphResponse, onQuestionStart }: DigitalTwinProps) {
  const [question, setQuestion] = useState("");
  const [narration, setNarration] = useState<DigitalTwinNarrationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestCounter = useRef(0);

  const submitQuestion = async (nextQuestion = question) => {
    const normalizedQuestion = nextQuestion.trim();
    if (!normalizedQuestion || isLoading) return;

    const requestId = ++requestCounter.current;
    const narrationId = `narration-${requestId}`;
    setQuestion("");
    setIsLoading(true);
    setNarration({ id: narrationId, content: "", sources: [], status: "streaming" });
    onQuestionStart?.(requestId);

    try {
      await askDigitalTwin(normalizedQuestion, {
        onMetadata: (metadata) => {
          if (requestCounter.current !== requestId) return;
          setNarration((current) => current?.id === narrationId
            ? { ...current, sources: metadata.sources }
            : current);
          onGraphResponse?.(metadata.graphNodeIds, metadata.relatedGraphNodeIds, requestId);
        },
        onDelta: (text) => {
          if (requestCounter.current !== requestId) return;
          setNarration((current) => current?.id === narrationId
            ? { ...current, content: current.content + text }
            : current);
        },
      });
    } catch (error) {
      const errorMessage = error instanceof TwinChatClientError && error.code === "rate_limit"
        ? "The question limit was reached. Please wait a moment before trying again."
        : error instanceof TwinChatClientError && error.code === "not_configured"
          ? "The AI answer service is not configured yet."
          : "The AI answer service is temporarily unavailable. Please try again.";

      setNarration((current) => current?.id === narrationId
        ? {
            ...current,
            content: current.content ? `${current.content} The answer stream was interrupted.` : errorMessage,
            status: "error",
          }
        : current);
    } finally {
      if (requestCounter.current === requestId) {
        setIsLoading(false);
        setNarration((current) => current?.id === narrationId && current.status === "streaming"
          ? { ...current, status: "complete" }
          : current);
      }
    }
  };

  const clearConversation = () => {
    requestCounter.current += 1;
    setNarration(null);
    setQuestion("");
    setIsLoading(false);
    onQuestionStart?.(requestCounter.current);
  };

  return (
    <section
      className={`twin-shell relative isolate flex min-h-60 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-panel-border/80 bg-panel-muted ${className}`}
      aria-label="Digital twin conversation preview"
    >
      <header className="flex items-center justify-between gap-2 border-b border-panel-border/60 px-3 py-2 font-display text-[0.4375rem] uppercase tracking-[0.15em] text-muted-foreground">
        <span>SYS / 02</span>
        <div className="flex items-center gap-2">
          {narration && (
            <button
              type="button"
              className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
              onClick={clearConversation}
            >
              Clear
            </button>
          )}
          <span className="flex items-center gap-2 text-accent-cyan">
            <span className="size-1.5 rounded-full bg-status shadow-[0_0_10px_var(--color-status)]" />
            Grounded AI online
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <DigitalTwinConversation
          isLoading={isLoading}
          suggestions={suggestedTwinQuestions}
          onSelectSuggestion={submitQuestion}
        />
      </div>

      <DigitalTwinNarration narration={narration} />

      <DigitalTwinComposer
        value={question}
        isLoading={isLoading}
        onChange={setQuestion}
        onSubmit={() => submitQuestion()}
      />
    </section>
  );
}
