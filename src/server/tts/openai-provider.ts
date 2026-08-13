import type { TtsConfig } from "./config.ts";

export async function synthesizeOpenAiSpeech(text: string, config: TtsConfig): Promise<ArrayBuffer> {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      voice: config.voice,
      input: text,
      response_format: "mp3",
      instructions: "Speak clearly, calmly, and conversationally, like a concise professional portfolio guide.",
    }),
  });
  if (!response.ok) throw new Error("The speech provider could not synthesize audio.");
  return response.arrayBuffer();
}
