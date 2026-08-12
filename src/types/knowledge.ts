export const knowledgeItemTypes = [
  "person",
  "career",
  "profile",
  "experience",
  "project",
  "skill",
  "technology",
  "concept",
  "certification",
  "education",
  "personal",
] as const;

export type KnowledgeItemType = (typeof knowledgeItemTypes)[number];

export const knowledgeLibraryRecordTypes = [
  "profile",
  "experience",
  "project",
  "skill",
  "technology",
  "certification",
  "education",
  "personal",
] as const;

export type KnowledgeLibraryRecordType = (typeof knowledgeLibraryRecordTypes)[number];

export type KnowledgeLink = {
  label: string;
  href: string;
  kind: "project" | "external";
};

export type KnowledgeTimeline = {
  startYear?: number;
  endYear?: number | "present";
  startDate?: string;
  endDate?: string | "present";
  label?: string;
};

export type KnowledgeVisibility = "public" | "private";

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

export type KnowledgeLibraryRecord<Id extends string = string> = KnowledgeItem<Id> & {
  visibility: KnowledgeVisibility;
  sourcePath: string;
};
