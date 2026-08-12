import type { DigitalTwinNarration as Narration } from "@/types/digital-twin-chat";

type DigitalTwinNarrationProps = {
  narration: Narration | null;
};

export function DigitalTwinNarration({ narration }: DigitalTwinNarrationProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-2.5 bottom-[4.125rem] z-40 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${narration ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      aria-live="polite"
      aria-atomic="true"
      aria-busy={narration?.status === "streaming"}
    >
      {narration && (
        <div className="max-h-28 overflow-hidden rounded-xl border border-panel-border/70 bg-background/90 px-3 py-2.5 shadow-[0_0_28px_rgba(7,8,13,.85)] backdrop-blur-sm">
          <p className="font-display text-[0.5rem] uppercase tracking-[0.16em] text-accent-cyan">
            Digital twin / {narration.status === "streaming" ? "speaking" : "grounded response"}
          </p>
          <p className="mt-1.5 line-clamp-4 text-xs leading-5 text-foreground">
            {narration.content || "Retrieving portfolio evidence…"}
          </p>
          {narration.sources.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Retrieved sources">
              {narration.sources.slice(0, 3).map((source) => (
                <li key={source.id} className="rounded-full border border-accent-violet/35 bg-accent-violet/10 px-2 py-0.5 text-[0.5625rem] text-muted-foreground">
                  {source.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
