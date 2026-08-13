import assert from "node:assert/strict";
import test from "node:test";
import { synthesizeSpeech } from "./synthesize-speech.ts";

test("synthesizes speech through the isolated configured provider", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-key";
  globalThis.fetch = async (_input, init) => {
    assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer test-key");
    const body = JSON.parse(String(init?.body)) as { response_format?: string };
    assert.equal(body.response_format, "mp3");
    return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
  };

  try {
    const speech = await synthesizeSpeech("A grounded answer.");
    assert.equal(speech.contentType, "audio/mpeg");
    assert.equal(speech.audio.byteLength, 3);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
});
