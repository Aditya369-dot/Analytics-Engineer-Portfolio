import {
  knowledgeById,
  type KnowledgeItemId,
  type PortfolioKnowledgeItem,
} from "@/data/knowledge";

export const graphNodeIds = [
  "analytics-engineering",
  "ai-agents",
  "rag",
  "semantic-layer",
  "power-bi",
  "palantir-foundry",
  "python",
  "sql",
  "projects",
] as const satisfies readonly KnowledgeItemId[];

export type GraphNodeId = (typeof graphNodeIds)[number];
export type GraphCategory = "core" | "data" | "analytics" | "ai" | "platform" | "tool";

export type GraphNode = Omit<PortfolioKnowledgeItem, "id"> & {
  id: GraphNodeId;
  label: string;
  category: GraphCategory;
  importance: number;
};

export type GraphEdge = {
  source: GraphNodeId;
  target: GraphNodeId;
};

type GraphNodePresentation = {
  x: number;
  y: number;
  depth: number;
  category: GraphCategory;
  importance: number;
};

export const graphPresentation: Record<GraphNodeId, GraphNodePresentation> = {
  "analytics-engineering": { x: 200, y: 184, depth: 1, category: "core", importance: 1 },
  "ai-agents": { x: 200, y: 42, depth: 0.9, category: "ai", importance: 0.82 },
  rag: { x: 124, y: 102, depth: 0.76, category: "ai", importance: 0.7 },
  "semantic-layer": { x: 282, y: 102, depth: 0.8, category: "analytics", importance: 0.78 },
  "power-bi": { x: 48, y: 184, depth: 0.7, category: "tool", importance: 0.68 },
  "palantir-foundry": { x: 350, y: 184, depth: 0.76, category: "platform", importance: 0.72 },
  python: { x: 132, y: 254, depth: 0.74, category: "data", importance: 0.7 },
  sql: { x: 275, y: 254, depth: 0.74, category: "data", importance: 0.7 },
  projects: { x: 112, y: 326, depth: 0.66, category: "platform", importance: 0.62 },
};

export const graphNodes: readonly GraphNode[] = graphNodeIds.map((id): GraphNode => {
  const item = knowledgeById[id];
  const presentation = graphPresentation[id];

  return {
    ...item,
    id,
    label: item.title,
    category: presentation.category,
    importance: presentation.importance,
  };
});

const graphNodeIdSet = new Set<KnowledgeItemId>(graphNodeIds);
const edgeKeys = new Set<string>();

function isGraphNodeId(id: KnowledgeItemId): id is GraphNodeId {
  return graphNodeIdSet.has(id);
}

export const graphEdges: readonly GraphEdge[] = graphNodeIds.flatMap((source) =>
  knowledgeById[source].relatedIds.flatMap((target) => {
    if (!isGraphNodeId(target)) return [];

    const key = [source, target].sort().join(":");
    if (edgeKeys.has(key)) return [];

    edgeKeys.add(key);
    return [{ source, target }];
  }),
);
