import { NextResponse } from "next/server";
import { answerTwinQuestion } from "@/server/answer-twin-question";
import type { TwinChatRequest } from "@/types/digital-twin-chat";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<TwinChatRequest>;

  try {
    body = (await request.json()) as Partial<TwinChatRequest>;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  if (question.length > 500) {
    return NextResponse.json({ error: "Question must be 500 characters or fewer." }, { status: 400 });
  }

  return NextResponse.json(answerTwinQuestion(question));
}
