import { resolve } from "node:path";
import { KnowledgeValidationError, parseKnowledgeDirectory } from "./core.ts";

try {
  const records = parseKnowledgeDirectory(resolve(process.cwd(), "knowledge"));
  process.stdout.write(`Knowledge library valid: ${records.length} record(s).\n`);
} catch (error) {
  if (error instanceof KnowledgeValidationError) {
    for (const issue of error.issues) process.stderr.write(`${issue}\n`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
