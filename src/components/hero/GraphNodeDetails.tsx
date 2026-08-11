import type { GraphNode } from "@/data/graph-data";

type GraphNodeDetailsProps = {
  node: GraphNode;
  summary: string;
  connections: readonly string[];
};

export function GraphNodeDetails({ node, summary, connections }: GraphNodeDetailsProps) {
  return (
    <div className="border-t border-panel-border/80 bg-background-elevated/95 px-4 py-3" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
          {node.label}
        </p>
        <span className="font-display text-[0.5625rem] uppercase tracking-[0.16em] text-accent-cyan">
          {node.category}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-[0.6875rem] leading-4 text-muted-foreground">{summary}</p>
      <p className="mt-2 truncate font-display text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
        Linked / {connections.join(" · ")}
      </p>
    </div>
  );
}
