import {
  knowledgeById,
  knowledgeItems,
  type KnowledgeItemId,
  type PortfolioKnowledgeItem,
} from "../data/knowledge.ts";

const fieldWeights = {
  title: 8,
  tags: 6,
  summary: 4,
  type: 5,
  relatedIds: 2,
  content: 1,
} as const;

const stopWords = new Set(["a", "about", "and", "does", "has", "his", "is", "kind", "me", "of", "the", "tell", "what", "with"]);

type MatchField = keyof typeof fieldWeights;

export type RetrievedKnowledgeItem = {
  item: PortfolioKnowledgeItem;
  score: number;
  matchedFields: readonly MatchField[];
};

export type KnowledgeRetrievalResult = {
  items: readonly RetrievedKnowledgeItem[];
  graphNodeIds: readonly KnowledgeItemId[];
  relatedGraphNodeIds: readonly KnowledgeItemId[];
};

export type KnowledgeRetrievalOptions = {
  limit?: number;
  minimumScore?: number;
};

function assertServerRuntime() {
  if (typeof window !== "undefined") {
    throw new Error("Portfolio knowledge retrieval is server-only.");
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return [...new Set(normalize(value).split(" ").filter((token) => token.length > 1 && !stopWords.has(token)))];
}

function searchableRelatedText(item: PortfolioKnowledgeItem) {
  return item.relatedIds
    .map((id) => `${id} ${knowledgeById[id].title}`)
    .join(" ");
}

function scoreItem(item: PortfolioKnowledgeItem, query: string, queryTokens: readonly string[]) {
  const fields: Record<MatchField, string> = {
    title: item.title,
    tags: item.tags.join(" "),
    summary: item.shortSummary,
    type: item.type,
    relatedIds: searchableRelatedText(item),
    content: item.longContent,
  };
  const normalizedTitle = normalize(item.title);
  const matchedFields: MatchField[] = [];
  let score = normalizedTitle === query || query.includes(normalizedTitle) ? 12 : 0;

  for (const [field, value] of Object.entries(fields) as [MatchField, string][]) {
    const fieldTokens = new Set(tokenize(value));
    const matches = queryTokens.filter((token) => fieldTokens.has(token)).length;

    if (matches > 0) {
      matchedFields.push(field);
      score += matches * fieldWeights[field];
    }
  }

  return { score, matchedFields };
}

export function retrieveKnowledge(
  naturalLanguageQuery: string,
  { limit = 3, minimumScore = 2 }: KnowledgeRetrievalOptions = {},
): KnowledgeRetrievalResult {
  assertServerRuntime();

  const query = normalize(naturalLanguageQuery);
  const queryTokens = tokenize(query);
  if (!query || queryTokens.length === 0 || limit <= 0) {
    return { items: [], graphNodeIds: [], relatedGraphNodeIds: [] };
  }

  const items = knowledgeItems
    .map((item) => ({ item, ...scoreItem(item, query, queryTokens) }))
    .filter((result) => result.score >= minimumScore)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
    .slice(0, limit);

  const directlyMatchedItems = items.filter(({ matchedFields }) =>
    matchedFields.some((field) => field !== "relatedIds"),
  );
  const graphNodeIds = [...new Set(directlyMatchedItems.map(({ item }) => item.id))];
  const relevantIdSet = new Set(graphNodeIds);
  const relatedGraphNodeIds = [
    ...new Set(
      [
        ...directlyMatchedItems.flatMap(({ item }) => item.relatedIds),
        ...items.filter((item) => !directlyMatchedItems.includes(item)).map(({ item }) => item.id),
      ].filter((id) => !relevantIdSet.has(id)),
    ),
  ];

  return { items, graphNodeIds, relatedGraphNodeIds };
}
