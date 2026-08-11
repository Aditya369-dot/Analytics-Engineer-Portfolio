import assert from "node:assert/strict";
import test from "node:test";
import { answerTwinQuestion } from "./answer-twin-question.ts";

test("builds a deterministic answer from retrieved portfolio evidence", () => {
  const response = answerTwinQuestion("Tell me about his AI agents experience");

  assert.equal(response.sources[0]?.id, "ai-agents");
  assert.match(response.answer, /Applied AI systems/);
  assert.ok(response.graphNodeIds.includes("ai-agents"));
  assert.ok(response.relatedGraphNodeIds.includes("rag"));
  assert.ok(response.relatedGraphNodeIds.includes("semantic-layer"));
});

test("returns an explicit unsupported response without evidence", () => {
  const response = answerTwinQuestion("xylophone nebula");

  assert.equal(response.sources.length, 0);
  assert.equal(response.graphNodeIds.length, 0);
  assert.equal(response.relatedGraphNodeIds.length, 0);
  assert.match(response.answer, /could not find relevant evidence/i);
});
