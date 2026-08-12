type DigitalTwinComposerProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function DigitalTwinComposer({
  value,
  isLoading,
  onChange,
  onSubmit,
}: DigitalTwinComposerProps) {
  return (
    <form
      className="border-t border-panel-border/80 bg-background-elevated/95 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="digital-twin-question" className="sr-only">
        Ask my digital twin
      </label>
      <div className="flex gap-2">
        <input
          id="digital-twin-question"
          value={value}
          disabled={isLoading}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask my digital twin…"
          className="min-w-0 flex-1 rounded-xl border border-panel-border bg-panel-muted px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-cyan disabled:cursor-wait disabled:opacity-65"
        />
        <button
          type="submit"
          disabled={isLoading || value.trim().length === 0}
          className="rounded-xl border border-accent-violet/60 bg-accent-violet/15 px-3 font-display text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-accent-cyan hover:bg-accent-cyan/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ask
        </button>
      </div>
      <p className="mt-2 font-display text-[0.5rem] uppercase tracking-[0.12em] text-muted-foreground">
        Grounded portfolio AI · Retrieved sources only
      </p>
    </form>
  );
}
