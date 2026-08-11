export type GraphNode = {
  id: string;
  label: string;
  category: "core" | "data" | "analytics" | "ai" | "platform" | "tool";
  importance?: number;
};

export const graphNodes = [
  { id: "analytics-engineering", label: "Analytics Engineering", category: "core", importance: 1 },
  { id: "ai-agents", label: "AI Agents", category: "ai", importance: 0.82 },
  { id: "rag", label: "RAG", category: "ai", importance: 0.7 },
  { id: "semantic-layer", label: "Semantic Layer", category: "analytics", importance: 0.78 },
  { id: "power-bi", label: "Power BI", category: "tool", importance: 0.68 },
  { id: "palantir", label: "Palantir", category: "platform", importance: 0.72 },
  { id: "python", label: "Python", category: "data", importance: 0.7 },
  { id: "sql", label: "SQL", category: "data", importance: 0.7 },
  { id: "projects", label: "Projects", category: "platform", importance: 0.62 },
] as const satisfies readonly GraphNode[];

export type GraphNodeId = (typeof graphNodes)[number]["id"];

export type GraphEdge = {
  source: GraphNodeId;
  target: GraphNodeId;
};

export const graphEdges = [
  { source: "ai-agents", target: "rag" },
  { source: "ai-agents", target: "semantic-layer" },
  { source: "rag", target: "analytics-engineering" },
  { source: "semantic-layer", target: "analytics-engineering" },
  { source: "power-bi", target: "analytics-engineering" },
  { source: "analytics-engineering", target: "palantir" },
  { source: "analytics-engineering", target: "python" },
  { source: "analytics-engineering", target: "sql" },
  { source: "python", target: "projects" },
] as const satisfies readonly GraphEdge[];

type GraphNodePresentation = {
  x: number;
  y: number;
  depth: number;
  summary: string;
};

export const graphPresentation: Record<GraphNodeId, GraphNodePresentation> = {
  "analytics-engineering": {
    x: 200,
    y: 184,
    depth: 1,
    summary: "The central discipline connecting reliable data models, business context and decision-ready systems.",
  },
  "ai-agents": {
    x: 200,
    y: 42,
    depth: 0.9,
    summary: "Applied AI systems that coordinate tools, context and multi-step reasoning toward a defined outcome.",
  },
  rag: {
    x: 124,
    y: 102,
    depth: 0.76,
    summary: "Retrieval-augmented generation grounded in relevant source context rather than model memory alone.",
  },
  "semantic-layer": {
    x: 282,
    y: 102,
    depth: 0.8,
    summary: "A shared definition layer that keeps metrics and business concepts consistent across consumers.",
  },
  "power-bi": {
    x: 48,
    y: 184,
    depth: 0.7,
    summary: "A decision interface for turning governed analytical models into accessible business intelligence.",
  },
  palantir: {
    x: 350,
    y: 184,
    depth: 0.76,
    summary: "A platform context for operational data integration, modeling and decision-oriented applications.",
  },
  python: {
    x: 132,
    y: 254,
    depth: 0.74,
    summary: "A core language for data workflows, automation, APIs and applied AI systems.",
  },
  sql: {
    x: 275,
    y: 254,
    depth: 0.74,
    summary: "The foundation for modeling, transforming and interrogating structured analytical data.",
  },
  projects: {
    x: 112,
    y: 326,
    depth: 0.66,
    summary: "Where engineering concepts become concrete systems, architecture decisions and working demonstrations.",
  },
};
