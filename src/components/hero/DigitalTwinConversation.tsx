import type { DigitalTwinMessage } from "@/types/digital-twin-chat";

type DigitalTwinConversationProps = {
  messages: readonly DigitalTwinMessage[];
  isLoading: boolean;
  suggestions: readonly string[];
  onSelectSuggestion: (question: string) => void;
};

export function DigitalTwinConversation({
  messages,
  isLoading,
  suggestions,
  onSelectSuggestion,
}: DigitalTwinConversationProps) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex h-full flex-col justify-center px-4 py-5">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-foreground">
          Ask my digital twin
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Answers are generated from curated portfolio evidence only.
        </p>
        <div className="mt-4 grid gap-2">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              className="rounded-xl border border-panel-border bg-background-elevated/75 px-3 py-2.5 text-left text-xs leading-4 text-muted-foreground transition-colors hover:border-accent-violet/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
              onClick={() => onSelectSuggestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-busy={isLoading}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`max-w-[92%] rounded-xl border px-3 py-2.5 text-xs leading-5 ${
            message.role === "user"
              ? "ml-auto border-accent-violet/35 bg-accent-violet/10 text-foreground"
              : "border-panel-border bg-background-elevated/85 text-muted-foreground"
          }`}
        >
          <span className="mb-1 block font-display text-[0.5rem] uppercase tracking-[0.14em] text-accent-cyan">
            {message.role === "user" ? "You" : "Digital twin · Grounded"}
          </span>
          {message.content}
          {message.role === "assistant" && message.sources && message.sources.length > 0 && (
            <div className="mt-3 border-t border-panel-border/70 pt-2.5">
              <span className="font-display text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">
                Retrieved evidence
              </span>
              <ul className="mt-2 grid gap-2">
                {message.sources.map((source) => (
                  <li key={source.id}>
                    <p className="font-medium text-foreground">{source.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[0.6875rem] leading-4 text-muted-foreground">
                      {source.summary}
                    </p>
                  </li>
                ))}
              </ul>
              {message.graphNodeIds && message.graphNodeIds.length > 0 && (
                <p className="mt-2 truncate font-display text-[0.5rem] uppercase tracking-[0.1em] text-accent-cyan">
                  Concepts / {message.graphNodeIds.join(" · ")}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex max-w-[70%] items-center gap-2 rounded-xl border border-panel-border bg-background-elevated/85 px-3 py-3 text-xs text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-accent-cyan" />
          Preparing preview response…
        </div>
      )}
    </div>
  );
}
