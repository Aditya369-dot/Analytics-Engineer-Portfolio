import assert from "node:assert/strict";
import test from "node:test";

import { graphFocusFromKnowledgeIds, graphNeighborhood } from "./graph-data.ts";

test("manual and grounded data-engineering focus use the same canonical neighborhood", () => {
  const manualNeighborhood = graphNeighborhood("data-engineering");
  const groundedFocus = graphFocusFromKnowledgeIds(["data-engineering"], []);

  assert.equal(groundedFocus.source, "ai");
  assert.deepEqual(groundedFocus.primaryNodeIds, ["data-engineering"]);
  assert.deepEqual(new Set(groundedFocus.relatedNodeIds), new Set(manualNeighborhood));
  assert.ok(groundedFocus.relatedNodeIds.includes("microsoft-fabric"));
  assert.ok(groundedFocus.relatedNodeIds.includes("palantir-foundry"));
});

test("grounded focus combines retrieved relationships without duplicating primary nodes", () => {
  const focus = graphFocusFromKnowledgeIds(
    ["analytics-engineering"],
    ["semantic-layer", "power-bi"],
  );

  assert.ok(focus.relatedNodeIds.includes("semantic-layer"));
  assert.ok(focus.relatedNodeIds.includes("power-bi"));
  assert.ok(focus.relatedNodeIds.includes("data-quality"));
  assert.ok(!focus.relatedNodeIds.includes("analytics-engineering"));
});

test("unsupported retrieval IDs do not create random graph activation", () => {
  const focus = graphFocusFromKnowledgeIds(["career-future"], []);

  assert.equal(focus.source, null);
  assert.deepEqual(focus.primaryNodeIds, []);
  assert.deepEqual(focus.relatedNodeIds, []);
});
