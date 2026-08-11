"use client";

import { useState } from "react";
import { DigitalTwinComposer } from "@/components/hero/DigitalTwinComposer";
import { DigitalTwinConversation } from "@/components/hero/DigitalTwinConversation";
import {
  suggestedTwinQuestions,
} from "@/data/digital-twin-chat";
import { askDigitalTwin } from "@/lib/twin-chat-client";
import type { DigitalTwinMessage } from "@/types/digital-twin-chat";
import type { KnowledgeItemId } from "@/data/knowledge";

export type DigitalTwinProps = {
  className?: string;
  onGraphResponse?: (
    nodeIds: readonly KnowledgeItemId[],
    relatedNodeIds: readonly KnowledgeItemId[],
  ) => void;
};

export function DigitalTwin({ className = "", onGraphResponse }: DigitalTwinProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<DigitalTwinMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitQuestion = async (nextQuestion = question) => {
    const normalizedQuestion = nextQuestion.trim();
    if (!normalizedQuestion || isLoading) return;

    const userMessage: DigitalTwinMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: normalizedQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setIsLoading(true);
    onGraphResponse?.([], []);

    try {
      const response = await askDigitalTwin(normalizedQuestion);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          sources: response.sources,
          graphNodeIds: response.graphNodeIds,
          relatedGraphNodeIds: response.relatedGraphNodeIds,
        },
      ]);
      onGraphResponse?.(response.graphNodeIds, response.relatedGraphNodeIds);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "The portfolio evidence service is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setQuestion("");
    onGraphResponse?.([], []);
  };

  return (
    <section
      className={`twin-shell relative isolate flex min-h-64 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-panel-border bg-panel-muted ${className}`}
      aria-label="Digital twin conversation preview"
    >
      <header className="flex items-center justify-between gap-3 border-b border-panel-border/70 px-4 py-3 font-display text-[0.5625rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>SYS / 02</span>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
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
            Chat shell online
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <DigitalTwinConversation
          messages={messages}
          isLoading={isLoading}
          suggestions={suggestedTwinQuestions}
          onSelectSuggestion={submitQuestion}
        />
      </div>

      <DigitalTwinComposer
        value={question}
        isLoading={isLoading}
        onChange={setQuestion}
        onSubmit={() => submitQuestion()}
      />
    </section>
  );
}
