import { NextResponse } from "next/server";
import { synthesizeSpeech } from "@/server/tts/synthesize-speech";
import { TtsConfigurationError } from "@/server/tts/config";
import { checkTwinChatRateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 2400) {
    return NextResponse.json({ error: "Speech text must be between 1 and 2400 characters." }, { status: 400 });
  }
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const rateLimit = checkTwinChatRateLimit(`tts:${forwardedFor}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many speech requests." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }
  try {
    const speech = await synthesizeSpeech(text);
    return new Response(speech.audio, {
      headers: { "Cache-Control": "no-store", "Content-Type": speech.contentType },
    });
  } catch (error) {
    const status = error instanceof TtsConfigurationError ? 503 : 502;
    return NextResponse.json({ error: "Spoken responses are temporarily unavailable." }, { status });
  }
}
