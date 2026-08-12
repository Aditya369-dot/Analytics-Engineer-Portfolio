import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import {
  knowledgeLibraryRecordTypes,
  type KnowledgeLibraryRecord,
  type KnowledgeLibraryRecordType,
  type KnowledgeLink,
  type KnowledgeTimeline,
  type KnowledgeVisibility,
} from "../../src/types/knowledge.ts";

const supportedTypes = new Set<string>(knowledgeLibraryRecordTypes);
const supportedVisibilities = new Set<KnowledgeVisibility>(["public", "private"]);

export class KnowledgeValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Knowledge validation failed with ${issues.length} issue(s).`);
    this.name = "KnowledgeValidationError";
    this.issues = issues;
  }
}

type ParsedDocument = {
  frontmatter: string;
  body: string;
};

function parseDocument(markdown: string, sourcePath: string): ParsedDocument {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) {
    throw new KnowledgeValidationError([`${sourcePath}: missing YAML frontmatter.`]);
  }
  return { frontmatter: match[1], body: match[2].trim() };
}

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function scalar(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? stripQuotes(match[1]) : undefined;
}

function sectionLines(frontmatter: string, key: string) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^${key}:\\s*$`).test(line));
  if (start < 0) return [];

  const section: string[] = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^[A-Za-z][\w-]*:/.test(lines[index])) break;
    section.push(lines[index]);
  }
  return section;
}

function stringList(frontmatter: string, key: string): string[] {
  const inline = frontmatter.match(new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, "m"));
  if (inline) {
    return inline[1].trim()
      ? inline[1].split(",").map(stripQuotes).filter(Boolean)
      : [];
  }

  return sectionLines(frontmatter, key)
    .map((line) => line.match(/^\s{2}-\s+(.+)$/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(stripQuotes);
}

function parseTimeline(frontmatter: string): KnowledgeTimeline | undefined {
  const lines = sectionLines(frontmatter, "timeline");
  if (lines.length === 0) return undefined;

  const values = new Map<string, string>();
  for (const line of lines) {
    const match = line.match(/^\s{2}([A-Za-z][\w-]*):\s*(.+)$/);
    if (match) values.set(match[1], stripQuotes(match[2]));
  }

  const startYear = values.get("startYear");
  const endYear = values.get("endYear");
  return {
    ...(startYear ? { startYear: Number(startYear) } : {}),
    ...(endYear ? { endYear: endYear === "present" ? "present" : Number(endYear) } : {}),
    ...(values.get("startDate") ? { startDate: values.get("startDate") } : {}),
    ...(values.get("endDate") ? { endDate: values.get("endDate") } : {}),
    ...(values.get("label") ? { label: values.get("label") } : {}),
  };
}

function parseLinks(frontmatter: string): KnowledgeLink[] | undefined {
  const lines = sectionLines(frontmatter, "links");
  if (lines.length === 0) return undefined;

  const links: Array<Partial<KnowledgeLink>> = [];
  for (const line of lines) {
    const firstProperty = line.match(/^\s{2}-\s+([A-Za-z][\w-]*):\s*(.+)$/);
    if (firstProperty) {
      links.push({ [firstProperty[1]]: stripQuotes(firstProperty[2]) });
      continue;
    }

    const property = line.match(/^\s{4}([A-Za-z][\w-]*):\s*(.+)$/);
    if (property && links.length > 0) {
      links[links.length - 1] = {
        ...links[links.length - 1],
        [property[1]]: stripQuotes(property[2]),
      };
    }
  }

  return links.map((link) => ({
    label: link.label ?? "",
    href: link.href ?? "",
    kind: link.kind === "project" ? "project" : "external",
  }));
}

function extractSummary(body: string) {
  const summarySection = body.match(/^# Summary\s*\r?\n+([\s\S]*?)(?=\r?\n#|$)/m)?.[1];
  const candidate = summarySection ?? body;
  return candidate
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/^#+\s+.*$/gm, "").trim())
    .find(Boolean) ?? "";
}

export function parseKnowledgeMarkdown(markdown: string, sourcePath: string): KnowledgeLibraryRecord {
  const { frontmatter, body } = parseDocument(markdown, sourcePath);
  const id = scalar(frontmatter, "id") ?? "";
  const type = scalar(frontmatter, "type") ?? "";
  const title = scalar(frontmatter, "title") ?? "";
  const visibility = scalar(frontmatter, "visibility") ?? "";
  const links = parseLinks(frontmatter);
  const timeline = parseTimeline(frontmatter);

  const issues: string[] = [];
  if (!id) issues.push(`${sourcePath}: id is required.`);
  if (!supportedTypes.has(type)) issues.push(`${sourcePath}: invalid record type "${type}".`);
  if (!title) issues.push(`${sourcePath}: title is required.`);
  if (!supportedVisibilities.has(visibility as KnowledgeVisibility)) {
    issues.push(`${sourcePath}: visibility must be public or private.`);
  }
  if (!body) issues.push(`${sourcePath}: Markdown body is required.`);
  if (links?.some((link) => !link.label || !link.href)) {
    issues.push(`${sourcePath}: every link requires label and href.`);
  }
  if (timeline?.startYear !== undefined && !Number.isInteger(timeline.startYear)) {
    issues.push(`${sourcePath}: timeline.startYear must be an integer.`);
  }
  if (typeof timeline?.endYear === "number" && !Number.isInteger(timeline.endYear)) {
    issues.push(`${sourcePath}: timeline.endYear must be an integer or present.`);
  }
  if (issues.length > 0) throw new KnowledgeValidationError(issues);

  return {
    id,
    type: type as KnowledgeLibraryRecordType,
    title,
    visibility: visibility as KnowledgeVisibility,
    shortSummary: extractSummary(body),
    longContent: body,
    tags: stringList(frontmatter, "tags"),
    relatedIds: stringList(frontmatter, "related"),
    ...(links ? { links } : {}),
    ...(timeline ? { timeline } : {}),
    sourcePath,
  };
}

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") return [path];
    return [];
  });
}

export function validateKnowledgeRecords(records: readonly KnowledgeLibraryRecord[]) {
  const issues: string[] = [];
  const byId = new Map<string, KnowledgeLibraryRecord>();

  for (const record of records) {
    if (byId.has(record.id)) {
      issues.push(`Duplicate knowledge id "${record.id}" in ${record.sourcePath}.`);
    } else {
      byId.set(record.id, record);
    }
  }

  for (const record of records) {
    for (const relatedId of record.relatedIds) {
      const target = byId.get(relatedId);
      if (!target) {
        issues.push(`${record.sourcePath}: related id "${relatedId}" does not exist.`);
      } else if (record.visibility === "public" && target.visibility !== "public") {
        issues.push(`${record.sourcePath}: public record cannot relate to private id "${relatedId}".`);
      }
    }
  }

  if (issues.length > 0) throw new KnowledgeValidationError(issues);
}

export function parseKnowledgeDirectory(directory: string) {
  const records = markdownFiles(directory).map((path) =>
    parseKnowledgeMarkdown(readFileSync(path, "utf8"), relative(directory, path).replaceAll("\\", "/")),
  );
  validateKnowledgeRecords(records);
  return records;
}

export function publicKnowledgeRecords(records: readonly KnowledgeLibraryRecord[]) {
  return records.filter((record) => record.visibility === "public");
}
