import { getLlmConfig } from "./config.ts";
import type { GroundedGenerationRequest } from "../answer-twin-question.ts";

export class LlmProviderError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "LlmProviderError";
    this.status = status;
  }
}

function buildGroundedInput({ question, context }: GroundedGenerationRequest) {
  const evidence = context
    .map(
      (item, index) =>
        `[Source ${index + 1}: ${item.id}]\nTitle: ${item.title}\nType: ${item.type}\nSummary: ${item.shortSummary}\nContent: ${item.longContent}\nTags: ${item.tags.join(", ")}`,
    )
    .join("\n\n");

  return `Visitor question:\n${question}\n\nCurated portfolio evidence:\n${evidence}`;
}

function parseEventData(block: string) {
  const data = block
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .join("\n");

  if (!data || data === "[DONE]") return null;
  return JSON.parse(data) as { type?: string; delta?: string; message?: string };
}

async function* readResponseDeltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const event = parseEventData(block);
        if (event?.type === "response.output_text.delta" && event.delta) {
          yield event.delta;
        }
        if (event?.type === "error" || event?.type === "response.failed" || event?.type === "response.incomplete") {
          throw new LlmProviderError(event.message || "The AI provider could not complete the answer.");
        }
      }

      if (done) break;
    }

    const finalEvent = parseEventData(buffer);
    if (finalEvent?.type === "response.output_text.delta" && finalEvent.delta) {
      yield finalEvent.delta;
    }
    if (finalEvent?.type === "error" || finalEvent?.type === "response.failed" || finalEvent?.type === "response.incomplete") {
      throw new LlmProviderError(finalEvent.message || "The AI provider could not complete the answer.");
    }
  } finally {
    reader.releaseLock();
  }
}

export async function streamOpenAIGroundedAnswer(
  request: GroundedGenerationRequest,
): Promise<AsyncIterable<string>> {
  const config = getLlmConfig();
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      instructions:
        "You are Aditya Bholla's portfolio digital twin. Speak in first person as Aditya, using I, my, and I've. Never describe Aditya as he, him, his, or Aditya unless using the name is absolutely required for clarification. Answer naturally and conversationally in a professional, human voice rather than sounding like a resume parser. Stay strictly grounded in the supplied curated portfolio evidence. Never infer or invent experience, skills, projects, employers, credentials, metrics, dates, or achievements. If the evidence is insufficient, say so clearly. Keep normal answers concise, generally 2-4 sentences unless the visitor asks for more detail.",
      input: buildGroundedInput(request),
      max_output_tokens: 420,
      reasoning: { effort: "low" },
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const message = response.status === 429
      ? "The AI provider rate limit was reached."
      : "The AI provider could not start the answer.";
    throw new LlmProviderError(message, response.status === 429 ? 429 : 502);
  }

  return readResponseDeltas(response.body);
}
