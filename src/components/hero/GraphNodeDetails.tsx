import type { GraphNode } from "@/data/graph-data";

type GraphNodeDetailsProps = {
  node: GraphNode | null;
  connections: readonly string[];
};

export function GraphNodeDetails({ node, connections }: GraphNodeDetailsProps) {
  if (!node) {
    return (
      <div className="border-t border-panel-border/80 bg-background-elevated/95 px-4 py-3">
        <p className="font-display text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          Select a node to see how Aditya has used it
        </p>
      </div>
    );
  }

  const chips = [...connections, ...node.relatedProjects].slice(0, 4);

  return (
    <div className="border-t border-panel-border/80 bg-background-elevated/97 px-4 py-3" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-foreground">{node.label}</p>
        <span className="font-display text-[0.5625rem] uppercase tracking-[0.16em] text-accent-cyan">{node.category}</span>
      </div>
      <p className="mt-2 font-display text-[0.5625rem] uppercase tracking-[0.14em] text-accent-violet-bright">{node.level === "central" ? "Professional focus" : "How Aditya has used this"}</p>
      <p className="mt-1 line-clamp-3 text-[0.7rem] leading-[1.15rem] text-foreground/80">{node.experienceDetails}</p>
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1" aria-label="Related technologies and projects">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-panel-border bg-panel-muted px-2 py-0.5 text-[0.55rem] text-muted-foreground">{chip}</span>
          ))}
        </div>
      )}
    </div>
  );
}
