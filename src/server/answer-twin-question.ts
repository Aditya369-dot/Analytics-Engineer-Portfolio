import { retrieveKnowledge } from "./retrieve-knowledge.ts";
import type { TwinChatResponse } from "../types/digital-twin-chat.ts";

export function answerTwinQuestion(question: string): TwinChatResponse {
  const retrieval = retrieveKnowledge(question, { limit: 3 });
  const sources = retrieval.items.map(({ item }) => ({
    id: item.id,
    title: item.title,
    summary: item.shortSummary,
  }));

  if (sources.length === 0) {
    return {
      answer: "I could not find relevant evidence in the curated portfolio knowledge base for that question yet.",
      sources,
      graphNodeIds: [],
      relatedGraphNodeIds: [],
    };
  }

  const [primary, ...supporting] = sources;
  const supportingTitles = supporting.map((source) => source.title).join(" and ");
  const answer = supportingTitles
    ? `${primary.summary} Related portfolio evidence includes ${supportingTitles}.`
    : primary.summary;

  return {
    answer,
    sources,
    graphNodeIds: retrieval.graphNodeIds,
    relatedGraphNodeIds: retrieval.relatedGraphNodeIds,
  };
}
