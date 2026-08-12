"use client";

import { useState } from "react";
import { DigitalTwinComposer } from "@/components/hero/DigitalTwinComposer";
import { DigitalTwinConversation } from "@/components/hero/DigitalTwinConversation";
import {
  suggestedTwinQuestions,
} from "@/data/digital-twin-chat";
import { askDigitalTwin, TwinChatClientError } from "@/lib/twin-chat-client";
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
    const assistantId = `assistant-${Date.now()}`;

    try {
      await askDigitalTwin(normalizedQuestion, {
        onMetadata: (metadata) => {
          setMessages((current) => [
            ...current,
            {
              id: assistantId,
              role: "assistant",
              content: "",
              sources: metadata.sources,
              graphNodeIds: metadata.graphNodeIds,
              relatedGraphNodeIds: metadata.relatedGraphNodeIds,
            },
          ]);
          onGraphResponse?.(metadata.graphNodeIds, metadata.relatedGraphNodeIds);
        },
        onDelta: (text) => {
          setMessages((current) => current.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + text }
              : message,
          ));
        },
      });
    } catch (error) {
      const errorMessage = error instanceof TwinChatClientError && error.code === "rate_limit"
        ? "The question limit was reached. Please wait a moment before trying again."
        : error instanceof TwinChatClientError && error.code === "not_configured"
          ? "The AI answer service is not configured yet."
          : "The AI answer service is temporarily unavailable. Please try again.";

      setMessages((current) => {
        const hasAssistantMessage = current.some((message) => message.id === assistantId);
        if (hasAssistantMessage) {
          return current.map((message) =>
            message.id === assistantId && !message.content
              ? { ...message, content: errorMessage }
              : message.id === assistantId
                ? { ...message, content: `${message.content} The answer stream was interrupted.` }
                : message,
          );
        }
        return [...current, { id: assistantId, role: "assistant", content: errorMessage }];
      });
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
            Grounded AI online
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
