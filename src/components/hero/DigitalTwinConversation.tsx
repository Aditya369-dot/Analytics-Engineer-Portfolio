type DigitalTwinConversationProps = {
  isLoading: boolean;
  suggestions: readonly string[];
  onSelectSuggestion: (question: string) => void;
};

export function DigitalTwinConversation({
  isLoading,
  suggestions,
  onSelectSuggestion,
}: DigitalTwinConversationProps) {
  return (
      <div className="flex h-full flex-col px-3 py-3">
        <p className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-foreground">
          Ask my digital twin
        </p>
        <p className="mt-1 text-[0.625rem] leading-3.5 text-muted-foreground">
          Answers are generated from curated portfolio evidence only.
        </p>
        <div className="mt-2.5 grid gap-1.5">
          {suggestions.slice(0, 2).map((question, index) => (
            <button
              key={question}
              type="button"
              className={`min-h-8 rounded-lg border border-panel-border/90 bg-background-elevated/70 px-2.5 py-1.5 text-left text-[0.625rem] leading-3.5 text-muted-foreground transition-colors hover:border-accent-violet/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan ${index === 1 ? "hidden sm:block" : ""}`}
              onClick={() => onSelectSuggestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
        {isLoading && (
          <p className="mt-3 flex items-center gap-2 text-[0.625rem] text-accent-cyan" role="status">
            <span className="size-1.5 animate-pulse rounded-full bg-accent-cyan motion-reduce:animate-none" />
            Digital twin is speaking…
          </p>
        )}
      </div>
  );
}
