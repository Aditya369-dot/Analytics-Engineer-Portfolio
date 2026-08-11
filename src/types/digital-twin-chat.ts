import type { KnowledgeItemId } from "@/data/knowledge";

export type TwinChatSource = {
  id: KnowledgeItemId;
  title: string;
  summary: string;
};

export type TwinChatRequest = {
  question: string;
};

export type TwinChatResponse = {
  answer: string;
  sources: readonly TwinChatSource[];
  graphNodeIds: readonly KnowledgeItemId[];
  relatedGraphNodeIds: readonly KnowledgeItemId[];
};

export type DigitalTwinMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: readonly TwinChatSource[];
  graphNodeIds?: readonly KnowledgeItemId[];
  relatedGraphNodeIds?: readonly KnowledgeItemId[];
};
