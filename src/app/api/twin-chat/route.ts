import { NextResponse } from "next/server";
import { answerQuestion } from "@/server/answer-twin-question";
import { LlmConfigurationError } from "@/server/llm/config";
import { LlmProviderError } from "@/server/llm/openai-provider";
import { checkTwinChatRateLimit } from "@/server/rate-limit";
import type {
  TwinChatErrorCode,
  TwinChatRequest,
  TwinChatStreamEvent,
} from "@/types/digital-twin-chat";

export const runtime = "nodejs";

function errorResponse(message: string, code: TwinChatErrorCode, status: number, retryAfter?: number) {
  return NextResponse.json(
    { error: message, code },
    {
      status,
      headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
    },
  );
}

function encodeEvent(event: TwinChatStreamEvent) {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: Request) {
  let body: Partial<TwinChatRequest>;

  try {
    body = (await request.json()) as Partial<TwinChatRequest>;
  } catch {
    return errorResponse("Request body must be valid JSON.", "invalid_request", 400);
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return errorResponse("Question is required.", "invalid_request", 400);
  }

  if (question.length > 500) {
    return errorResponse("Question must be 500 characters or fewer.", "invalid_request", 400);
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const rateLimit = checkTwinChatRateLimit(forwardedFor || "anonymous");
  if (!rateLimit.allowed) {
    return errorResponse(
      "Too many questions were submitted. Please wait before trying again.",
      "rate_limit",
      429,
      rateLimit.retryAfterSeconds,
    );
  }

  try {
    const answer = await answerQuestion(question);
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encodeEvent({
          type: "metadata",
          sources: answer.sources,
          graphNodeIds: answer.graphNodeIds,
          relatedGraphNodeIds: answer.relatedGraphNodeIds,
        }));

        try {
          for await (const text of answer.text) {
            controller.enqueue(encodeEvent({ type: "delta", text }));
          }
          controller.enqueue(encodeEvent({ type: "done" }));
        } catch {
          controller.enqueue(encodeEvent({
            type: "error",
            code: "provider_error",
            message: "The AI provider stopped before completing the answer.",
          }));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/x-ndjson; charset=utf-8",
      },
    });
  } catch (error) {
    if (error instanceof LlmConfigurationError) {
      return errorResponse(error.message, "not_configured", 503);
    }
    if (error instanceof LlmProviderError && error.status === 429) {
      return errorResponse(error.message, "rate_limit", 429, 30);
    }
    return errorResponse("The AI provider could not generate an answer.", "provider_error", 502);
  }
}
