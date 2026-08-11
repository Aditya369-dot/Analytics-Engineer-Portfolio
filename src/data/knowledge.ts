import type { KnowledgeItem } from "@/types/knowledge";

export const knowledgeItemIds = [
  "analytics-engineering",
  "ai-agents",
  "rag",
  "semantic-layer",
  "power-bi",
  "palantir-foundry",
  "python",
  "sql",
  "projects",
] as const;

export type KnowledgeItemId = (typeof knowledgeItemIds)[number];
export type PortfolioKnowledgeItem = KnowledgeItem<KnowledgeItemId>;

export const knowledgeItems = [
  {
    id: "analytics-engineering",
    type: "concept",
    title: "Analytics Engineering",
    shortSummary: "The central discipline connecting reliable data models, business context and decision-ready systems.",
    longContent: "Analytics engineering turns source data into tested, documented and reusable analytical models. It connects data engineering practices with the business definitions needed for trustworthy decisions.",
    tags: ["analytics", "data-modeling", "decision-systems"],
    relatedIds: ["rag", "semantic-layer", "power-bi", "palantir-foundry", "python", "sql"],
  },
  {
    id: "ai-agents",
    type: "concept",
    title: "AI Agents",
    shortSummary: "Applied AI systems that coordinate tools, context and multi-step reasoning toward a defined outcome.",
    longContent: "AI agents combine models, tools, instructions and contextual data to complete bounded workflows. The portfolio treats grounding and observable system behavior as core engineering concerns.",
    tags: ["ai", "agents", "orchestration"],
    relatedIds: ["rag", "semantic-layer"],
  },
  {
    id: "rag",
    type: "concept",
    title: "RAG",
    shortSummary: "Retrieval-augmented generation grounded in relevant source context rather than model memory alone.",
    longContent: "Retrieval-augmented generation selects relevant source material before an answer is produced. This supports answers that remain tied to curated portfolio evidence.",
    tags: ["ai", "retrieval", "grounding"],
    relatedIds: ["ai-agents", "analytics-engineering"],
  },
  {
    id: "semantic-layer",
    type: "concept",
    title: "Semantic Layer",
    shortSummary: "A shared definition layer that keeps metrics and business concepts consistent across consumers.",
    longContent: "A semantic layer provides governed definitions for measures, dimensions and business concepts. It helps analytical tools and AI systems interpret the same data consistently.",
    tags: ["analytics", "metrics", "governance"],
    relatedIds: ["ai-agents", "analytics-engineering"],
  },
  {
    id: "power-bi",
    type: "technology",
    title: "Power BI",
    shortSummary: "A decision interface for turning governed analytical models into accessible business intelligence.",
    longContent: "Power BI presents governed analytical models through reports and interactive decision interfaces. It is most effective when supported by consistent definitions and reliable upstream models.",
    tags: ["business-intelligence", "analytics", "visualization"],
    relatedIds: ["analytics-engineering"],
  },
  {
    id: "palantir-foundry",
    type: "technology",
    title: "Palantir Foundry",
    shortSummary: "A platform context for operational data integration, modeling and decision-oriented applications.",
    longContent: "Palantir Foundry provides a platform for integrating operational data, modeling shared concepts and building decision-oriented applications around governed data.",
    tags: ["platform", "data-integration", "operations"],
    relatedIds: ["analytics-engineering"],
  },
  {
    id: "python",
    type: "technology",
    title: "Python",
    shortSummary: "A core language for data workflows, automation, APIs and applied AI systems.",
    longContent: "Python supports data workflows, automation, service interfaces and applied AI development across the portfolio's engineering work.",
    tags: ["programming", "data", "automation", "ai"],
    relatedIds: ["analytics-engineering", "projects"],
  },
  {
    id: "sql",
    type: "skill",
    title: "SQL",
    shortSummary: "The foundation for modeling, transforming and interrogating structured analytical data.",
    longContent: "SQL is a foundational skill for transforming, modeling and validating structured data used by analytics systems and decision interfaces.",
    tags: ["data-modeling", "transformation", "analytics"],
    relatedIds: ["analytics-engineering"],
  },
  {
    id: "projects",
    type: "project",
    title: "Projects",
    shortSummary: "Where engineering concepts become concrete systems, architecture decisions and working demonstrations.",
    longContent: "Portfolio projects connect data, analytics and AI concepts to concrete system designs and working demonstrations across industry contexts.",
    tags: ["portfolio", "architecture", "delivery"],
    relatedIds: ["python"],
    links: [{ label: "Explore projects", href: "#projects", kind: "project" }],
  },
] as const satisfies readonly PortfolioKnowledgeItem[];

export const knowledgeById = Object.fromEntries(
  knowledgeItems.map((item) => [item.id, item]),
) as unknown as Record<KnowledgeItemId, PortfolioKnowledgeItem>;
