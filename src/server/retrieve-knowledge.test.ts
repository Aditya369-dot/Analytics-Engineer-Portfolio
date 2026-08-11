import assert from "node:assert/strict";
import test from "node:test";
import { retrieveKnowledge } from "./retrieve-knowledge.ts";

test("retrieves Palantir knowledge from a natural-language question", () => {
  const result = retrieveKnowledge("Tell me about Palantir.");

  assert.equal(result.items[0]?.item.id, "palantir-foundry");
  assert.ok(result.graphNodeIds.includes("palantir-foundry"));
  assert.ok(result.relatedGraphNodeIds.includes("analytics-engineering"));
});

test("retrieves career items for a career progression query", () => {
  const result = retrieveKnowledge("career progression", { limit: 5 });

  assert.ok(result.items.length > 0);
  assert.ok(result.items.every(({ item }) => item.type === "career"));
  assert.ok(result.items.some(({ item }) => item.id === "career-future"));
});

test("retrieves agent and RAG concepts for an AI agents query", () => {
  const result = retrieveKnowledge("AI agents", { limit: 5 });
  const ids = result.items.map(({ item }) => item.id);

  assert.equal(ids[0], "ai-agents");
  assert.ok(ids.includes("rag"));
  assert.ok(result.graphNodeIds.includes("semantic-layer"));
});

test("returns no results for an empty or unrelated query", () => {
  assert.deepEqual(retrieveKnowledge(""), { items: [], graphNodeIds: [], relatedGraphNodeIds: [] });
  assert.deepEqual(retrieveKnowledge("xylophone nebula"), { items: [], graphNodeIds: [], relatedGraphNodeIds: [] });
});
