import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  KnowledgeValidationError,
  parseKnowledgeDirectory,
  parseKnowledgeMarkdown,
  publicKnowledgeRecords,
} from "./core.ts";

function record(id: string, overrides = "") {
  return `---\nid: ${id}\ntype: project\ntitle: ${id}\nvisibility: public\ntags:\n  - test\nrelated: []\n${overrides}---\n\n# Summary\n\nA fictional test record.\n`;
}

test("parses timeline, links, body, and visibility into the canonical model", () => {
  const parsed = parseKnowledgeMarkdown(
    record("example", "timeline:\n  startDate: 2099-01\n  endDate: present\nlinks:\n  - label: Example\n    href: https://example.com\n    kind: external\n"),
    "example.md",
  );

  assert.equal(parsed.shortSummary, "A fictional test record.");
  assert.equal(parsed.timeline?.startDate, "2099-01");
  assert.equal(parsed.links?.[0]?.href, "https://example.com");
  assert.equal(parsed.visibility, "public");
});

test("rejects invalid record types", () => {
  assert.throws(
    () => parseKnowledgeMarkdown(record("invalid").replace("type: project", "type: unknown"), "invalid.md"),
    KnowledgeValidationError,
  );
});

test("rejects duplicate IDs and broken relationships", () => {
  const directory = mkdtempSync(join(tmpdir(), "knowledge-test-"));
  try {
    mkdirSync(join(directory, "records"));
    writeFileSync(join(directory, "records", "one.md"), record("duplicate").replace("related: []", "related:\n  - missing"));
    writeFileSync(join(directory, "records", "two.md"), record("duplicate"));
    assert.throws(() => parseKnowledgeDirectory(directory), KnowledgeValidationError);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("exposes only public records", () => {
  const publicRecord = parseKnowledgeMarkdown(record("public"), "public.md");
  const privateRecord = parseKnowledgeMarkdown(
    record("private").replace("visibility: public", "visibility: private"),
    "private.md",
  );
  assert.deepEqual(publicKnowledgeRecords([publicRecord, privateRecord]).map(({ id }) => id), ["public"]);
});
