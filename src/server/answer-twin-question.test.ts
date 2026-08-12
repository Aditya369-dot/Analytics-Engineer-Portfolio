import assert from "node:assert/strict";
import test from "node:test";
import {
  answerQuestion,
  type GroundedGenerationRequest,
} from "./answer-twin-question.ts";

async function collectText(stream: AsyncIterable<string>) {
  let text = "";
  for await (const chunk of stream) text += chunk;
  return text;
}

test("generates from only the retrieved portfolio context", async () => {
  let capturedRequest: GroundedGenerationRequest | undefined;
  const response = await answerQuestion("Tell me about his AI agents experience", async (request) => {
    capturedRequest = request;
    return (async function* generate() {
      yield "Grounded ";
      yield "answer.";
    })();
  });

  assert.equal(response.sources[0]?.id, "ai-agents");
  assert.equal(capturedRequest?.context.length, response.sources.length);
  assert.ok(capturedRequest?.context.every((item) => response.sources.some((source) => source.id === item.id)));
  assert.equal(await collectText(response.text), "Grounded answer.");
  assert.ok(response.graphNodeIds.includes("ai-agents"));
  assert.ok([...response.graphNodeIds, ...response.relatedGraphNodeIds].includes("rag"));
});

test("does not call the model when retrieval has no evidence", async () => {
  let called = false;
  const response = await answerQuestion("xylophone nebula", async () => {
    called = true;
    return (async function* generate() { yield "Unexpected"; })();
  });

  assert.equal(called, false);
  assert.equal(response.sources.length, 0);
  assert.match(await collectText(response.text), /could not find enough relevant evidence/i);
});
