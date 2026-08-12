import type { KnowledgeItemId } from "@/data/knowledge";

export type TwinChatSource = {
  id: KnowledgeItemId;
  title: string;
  summary: string;
};

export type TwinChatRequest = {
  question: string;
};

export type TwinChatMetadata = {
  sources: readonly TwinChatSource[];
  graphNodeIds: readonly KnowledgeItemId[];
  relatedGraphNodeIds: readonly KnowledgeItemId[];
};

export type TwinChatErrorCode = "rate_limit" | "not_configured" | "provider_error" | "invalid_request";

export type TwinChatStreamEvent =
  | ({ type: "metadata" } & TwinChatMetadata)
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; code: TwinChatErrorCode; message: string };

export type DigitalTwinMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: readonly TwinChatSource[];
  graphNodeIds?: readonly KnowledgeItemId[];
  relatedGraphNodeIds?: readonly KnowledgeItemId[];
};
