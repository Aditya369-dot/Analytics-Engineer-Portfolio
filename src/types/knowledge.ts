export const knowledgeItemTypes = [
  "person",
  "career",
  "project",
  "skill",
  "technology",
  "concept",
] as const;

export type KnowledgeItemType = (typeof knowledgeItemTypes)[number];

export type KnowledgeLink = {
  label: string;
  href: string;
  kind: "project" | "external";
};

export type KnowledgeTimeline = {
  startYear: number;
  endYear?: number | "present";
  label?: string;
};

export type KnowledgeItem<Id extends string = string> = {
  id: Id;
  title: string;
  type: KnowledgeItemType;
  shortSummary: string;
  longContent: string;
  tags: readonly string[];
  relatedIds: readonly Id[];
  links?: readonly KnowledgeLink[];
  timeline?: KnowledgeTimeline;
};
