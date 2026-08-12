import { retrieveKnowledge } from "./retrieve-knowledge.ts";
import { streamOpenAIGroundedAnswer } from "./llm/openai-provider.ts";
import type { PortfolioKnowledgeItem } from "../data/knowledge.ts";
import type { TwinChatSource } from "../types/digital-twin-chat.ts";

const unsupportedAnswer =
  "I could not find enough relevant evidence in the curated portfolio knowledge base to answer that question.";

export type GroundedGenerationRequest = {
  question: string;
  context: readonly PortfolioKnowledgeItem[];
};

export type AnswerGenerator = (
  request: GroundedGenerationRequest,
) => Promise<AsyncIterable<string>>;

export type AnswerQuestionResult = {
  sources: readonly TwinChatSource[];
  graphNodeIds: readonly PortfolioKnowledgeItem["id"][];
  relatedGraphNodeIds: readonly PortfolioKnowledgeItem["id"][];
  text: AsyncIterable<string>;
};

async function* staticAnswer(text: string) {
  yield text;
}

export async function answerQuestion(
  question: string,
  generateAnswer: AnswerGenerator = streamOpenAIGroundedAnswer,
): Promise<AnswerQuestionResult> {
  const retrieval = retrieveKnowledge(question, { limit: 3 });
  const context = retrieval.items.map(({ item }) => item);
  const sources = context.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.shortSummary,
  }));

  if (context.length === 0) {
    return {
      sources: [],
      graphNodeIds: [],
      relatedGraphNodeIds: [],
      text: staticAnswer(unsupportedAnswer),
    };
  }

  return {
    sources,
    graphNodeIds: retrieval.graphNodeIds,
    relatedGraphNodeIds: retrieval.relatedGraphNodeIds,
    text: await generateAnswer({ question, context }),
  };
}
