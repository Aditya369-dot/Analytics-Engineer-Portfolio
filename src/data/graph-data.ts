import type { KnowledgeItemId } from "@/data/knowledge";

export const graphNodeIds = [
  "aditya", "analytics-engineering", "data-engineering", "ai-engineering",
  "semantic-layer", "power-bi", "sql", "python", "typescript", "dbt",
  "data-quality", "etl-elt", "data-pipelines", "microsoft-fabric", "snowflake",
  "postgresql", "azure", "aws", "lakehouse", "rag", "ai-agents",
  "copilot-studio", "vector-databases", "prompt-engineering", "intent-routing",
  "llm-evaluation", "fastapi", "palantir-foundry", "ontology", "projects",
] as const;

export type GraphNodeId = (typeof graphNodeIds)[number];
export type GraphCategory = "entity" | "discipline" | "analytics" | "data" | "ai" | "platform" | "tool" | "project";
export type GraphLevel = "central" | "primary" | "secondary" | "tertiary";

export type GraphNode = {
  id: GraphNodeId;
  label: string;
  type: "person" | "skill" | "technology" | "concept" | "project";
  level: GraphLevel;
  category: GraphCategory;
  importance: number;
  shortExperience: string;
  experienceDetails: string;
  evidence: readonly string[];
  relatedProjects: readonly string[];
  relatedIds: readonly GraphNodeId[];
  iconKey?: string;
  knowledgeId?: KnowledgeItemId;
};

export type GraphEdge = { source: GraphNodeId; target: GraphNodeId };
export type GraphFocus = {
  source: "ai" | "manual" | null;
  primaryNodeIds: readonly GraphNodeId[];
  relatedNodeIds: readonly GraphNodeId[];
};
type NodeInput = Omit<GraphNode, "relatedIds"> & { relatedIds: readonly GraphNodeId[] };

const shared = {
  evidence: ["Public portfolio knowledge base"] as const,
  relatedProjects: [] as const,
};
const neutral = (label: string) => `The public portfolio lists ${label} in Aditya's technical profile; a detailed implementation example is not yet published.`;

const nodes: readonly NodeInput[] = [
  { id: "aditya", label: "Aditya", type: "person", level: "central", category: "entity", importance: 1, shortExperience: "Data + AI engineer connecting reliable data, analytics and intelligent systems.", experienceDetails: "Aditya's work spans analytics engineering, data engineering and applied AI across sports, transit and utility operations.", ...shared, relatedIds: ["analytics-engineering", "data-engineering", "ai-engineering"], iconKey: "digital-twin" },
  { id: "analytics-engineering", label: "Analytics Engineering", type: "skill", level: "primary", category: "discipline", importance: .9, shortExperience: "Builds governed analytics layers that connect operational data to decisions.", experienceDetails: "Aditya applies reusable SQL logic, semantic modeling and governed analytics layers across transit and utility operations.", evidence: ["PG&E", "CapMetro"], relatedProjects: [], relatedIds: ["aditya", "semantic-layer", "power-bi", "sql", "dbt", "data-quality", "microsoft-fabric", "palantir-foundry"], knowledgeId: "analytics-engineering" },
  { id: "data-engineering", label: "Data Engineering", type: "skill", level: "primary", category: "discipline", importance: .9, shortExperience: "Builds pipelines, lakehouse workflows and reusable data foundations.", experienceDetails: "Aditya built ETL/ELT and Microsoft Fabric Lakehouse solutions at PG&E and an Azure Data Factory, Snowflake and Power BI workflow at CapMetro.", evidence: ["PG&E", "CapMetro"], relatedProjects: [], relatedIds: ["aditya", "python", "sql", "dbt", "etl-elt", "data-pipelines", "microsoft-fabric", "snowflake", "postgresql", "azure", "aws", "lakehouse", "palantir-foundry"], knowledgeId: "data-engineering" },
  { id: "ai-engineering", label: "AI Engineering", type: "skill", level: "primary", category: "discipline", importance: .9, shortExperience: "Builds grounded AI workflows on governed enterprise data.", experienceDetails: "Aditya developed an enterprise AI analytics agent using Copilot Studio, RAG, intent-aware querying, prompt engineering, semantic-model contracts and evaluation controls.", evidence: ["PG&E enterprise AI analytics agent"], relatedProjects: [], relatedIds: ["aditya", "python", "semantic-layer", "rag", "ai-agents", "copilot-studio", "vector-databases", "prompt-engineering", "intent-routing", "llm-evaluation", "fastapi"] },
  { id: "semantic-layer", label: "Semantic Modeling", type: "concept", level: "secondary", category: "analytics", importance: .7, shortExperience: "Builds governed semantic models shared by reporting and AI consumers.", experienceDetails: "At PG&E, Aditya built governed Power BI semantic models and used semantic-model contracts within an enterprise AI analytics agent.", evidence: ["PG&E"], relatedProjects: [], relatedIds: ["analytics-engineering", "ai-engineering", "power-bi", "sql", "rag"], knowledgeId: "semantic-layer" },
  { id: "power-bi", label: "Power BI", type: "technology", level: "secondary", category: "tool", importance: .66, shortExperience: "Builds governed semantic models and enterprise reporting.", experienceDetails: "Aditya used Power BI for PG&E productivity and finance analytics and CapMetro executive, public-facing and transit reporting.", evidence: ["PG&E", "CapMetro"], relatedProjects: [], relatedIds: ["analytics-engineering", "semantic-layer", "microsoft-fabric"], iconKey: "power-bi", knowledgeId: "power-bi" },
  { id: "sql", label: "SQL", type: "skill", level: "secondary", category: "data", importance: .65, shortExperience: "Builds reusable SQL logic and analytical models.", experienceDetails: "At CapMetro, Aditya developed reusable data models and SQL logic across Finance, HR, Supply Chain and transit analytics.", evidence: ["CapMetro"], relatedProjects: [], relatedIds: ["analytics-engineering", "data-engineering", "semantic-layer", "snowflake", "postgresql"], iconKey: "sql", knowledgeId: "sql" },
  { id: "python", label: "Python", type: "technology", level: "secondary", category: "data", importance: .65, shortExperience: "Uses Python for preprocessing, analytics and data applications.", experienceDetails: "Aditya used Python at Pro Football Focus and in his goalkeeper scouting application.", evidence: ["Pro Football Focus"], relatedProjects: ["Goalkeeper Scouting Web Application"], relatedIds: ["data-engineering", "ai-engineering", "data-pipelines", "fastapi", "projects"], iconKey: "python", knowledgeId: "python" },
  { id: "rag", label: "RAG", type: "concept", level: "secondary", category: "ai", importance: .66, shortExperience: "Grounds analytics-agent responses in governed enterprise context.", experienceDetails: "RAG is part of Aditya's PG&E agent workflow alongside intent-aware querying, semantic-model contracts and evaluation controls.", evidence: ["PG&E"], relatedProjects: [], relatedIds: ["ai-engineering", "ai-agents", "semantic-layer", "vector-databases"], knowledgeId: "rag" },
  { id: "ai-agents", label: "AI Agents", type: "concept", level: "secondary", category: "ai", importance: .68, shortExperience: "Developed an enterprise AI analytics agent.", experienceDetails: "At PG&E, Aditya used Copilot Studio, RAG, intent-aware querying, prompt engineering, semantic contracts and evaluation controls.", evidence: ["PG&E"], relatedProjects: [], relatedIds: ["ai-engineering", "rag", "copilot-studio", "prompt-engineering", "intent-routing", "llm-evaluation"], knowledgeId: "ai-agents" },
  { id: "palantir-foundry", label: "Palantir Foundry", type: "technology", level: "secondary", category: "platform", importance: .63, shortExperience: "Models Foundry ontology objects for operational analytics.", experienceDetails: "Aditya's documented PG&E work includes Palantir Foundry ontology modeling.", evidence: ["PG&E"], relatedProjects: [], relatedIds: ["analytics-engineering", "data-engineering", "ontology"], iconKey: "palantir", knowledgeId: "palantir-foundry" },
  { id: "microsoft-fabric", label: "Microsoft Fabric", type: "technology", level: "secondary", category: "platform", importance: .62, shortExperience: "Built Microsoft Fabric Lakehouse solutions at PG&E.", experienceDetails: "Aditya's documented PG&E work includes Fabric Lakehouse solutions supporting enterprise analytics foundations.", evidence: ["PG&E"], relatedProjects: [], relatedIds: ["analytics-engineering", "data-engineering", "power-bi", "lakehouse"], iconKey: "fabric" },
  ...([
    ["typescript", "TypeScript", "tool", ["ai-engineering", "fastapi"]], ["dbt", "dbt", "tool", ["analytics-engineering", "data-engineering"]], ["data-quality", "Data Quality", "analytics", ["analytics-engineering", "data-engineering"]],
    ["etl-elt", "ETL / ELT", "data", ["data-engineering", "data-pipelines", "lakehouse"]], ["data-pipelines", "Data Pipelines", "data", ["data-engineering", "etl-elt", "python"]], ["snowflake", "Snowflake", "platform", ["data-engineering", "sql"]],
    ["postgresql", "PostgreSQL", "platform", ["data-engineering", "sql"]], ["azure", "Azure", "platform", ["data-engineering", "microsoft-fabric"]], ["aws", "AWS", "platform", ["data-engineering", "python"]],
    ["lakehouse", "Lakehouse", "data", ["data-engineering", "microsoft-fabric", "etl-elt"]], ["copilot-studio", "Copilot Studio", "ai", ["ai-engineering", "ai-agents"]], ["vector-databases", "Vector Databases", "ai", ["ai-engineering", "rag"]],
    ["prompt-engineering", "Prompt Engineering", "ai", ["ai-engineering", "ai-agents"]], ["intent-routing", "Intent Routing", "ai", ["ai-engineering", "ai-agents"]], ["llm-evaluation", "LLM Evaluation", "ai", ["ai-engineering", "ai-agents"]],
    ["fastapi", "FastAPI", "tool", ["ai-engineering", "python", "typescript"]], ["ontology", "Ontology", "platform", ["palantir-foundry", "analytics-engineering"]],
  ] as const).map(([id, label, category, relatedIds]) => ({ id, label, type: "technology" as const, level: "tertiary" as const, category, importance: .42, shortExperience: neutral(label), experienceDetails: neutral(label), ...shared, relatedIds, iconKey: id })),
  { id: "projects", label: "Projects", type: "project", level: "tertiary", category: "project", importance: .48, shortExperience: "Turns domain knowledge into working analytical products.", experienceDetails: "The public record documents a goalkeeper scouting application built with Python, Pandas, Scikit-learn, Plotly and Streamlit.", evidence: ["Public project record"], relatedProjects: ["Goalkeeper Scouting Web Application"], relatedIds: ["python"], knowledgeId: "projects" },
];

export const graphNodes = nodes satisfies readonly GraphNode[];
const edgeKeys = new Set<string>();
export const graphEdges: readonly GraphEdge[] = graphNodes.flatMap((node) => node.relatedIds.flatMap((target) => {
  const key = [node.id, target].sort().join(":");
  if (edgeKeys.has(key)) return [];
  edgeKeys.add(key);
  return [{ source: node.id, target }];
}));

export const emptyGraphFocus: GraphFocus = {
  source: null,
  primaryNodeIds: [],
  relatedNodeIds: [],
};

export function graphIdsFromKnowledgeIds(ids: readonly KnowledgeItemId[]): GraphNodeId[] {
  return ids.flatMap((id) => {
    const node = graphNodes.find((candidate) => candidate.knowledgeId === id || candidate.id === id);
    return node ? [node.id] : [];
  });
}

export function graphNeighborhood(nodeId: GraphNodeId): GraphNodeId[] {
  return graphEdges.flatMap((edge) => {
    if (edge.source === nodeId) return [edge.target];
    if (edge.target === nodeId) return [edge.source];
    return [];
  });
}

export function graphFocusFromKnowledgeIds(
  primaryKnowledgeIds: readonly KnowledgeItemId[],
  relatedKnowledgeIds: readonly KnowledgeItemId[],
): GraphFocus {
  const primaryNodeIds = graphIdsFromKnowledgeIds(primaryKnowledgeIds);
  if (primaryNodeIds.length === 0) return emptyGraphFocus;

  const primarySet = new Set(primaryNodeIds);
  const relatedNodeIds = [
    ...new Set([
      ...graphIdsFromKnowledgeIds(relatedKnowledgeIds),
      ...primaryNodeIds.flatMap(graphNeighborhood),
    ].filter((nodeId) => !primarySet.has(nodeId))),
  ];

  return { source: "ai", primaryNodeIds, relatedNodeIds };
}

function stableCoordinate(value: number) {
  return Math.round(value * 1000) / 1000;
}

export const graphPresentation = Object.fromEntries(graphNodes.map((node, index) => {
  const angle = (index / graphNodes.length) * Math.PI * 2;
  const radius = node.level === "central" ? 0 : node.level === "primary" ? 88 : node.level === "secondary" ? 142 : 166;
  return [node.id, {
    x: stableCoordinate(200 + Math.cos(angle) * radius),
    y: stableCoordinate(184 + Math.sin(angle) * radius * .82),
    depth: node.importance,
    category: node.category,
    importance: node.importance,
  }];
})) as Record<GraphNodeId, { x: number; y: number; depth: number; category: GraphCategory; importance: number }>;
