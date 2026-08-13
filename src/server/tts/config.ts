export type TtsConfig = {
  provider: "openai";
  apiKey: string;
  model: string;
  voice: string;
};

export class TtsConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsConfigurationError";
  }
}

export function getTtsConfig(): TtsConfig {
  const provider = (process.env.TTS_PROVIDER?.trim().toLowerCase() || "openai");
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (provider !== "openai" || !apiKey) {
    throw new TtsConfigurationError("Text-to-speech is not configured.");
  }
  return {
    provider,
    apiKey,
    model: process.env.TTS_MODEL?.trim() || "gpt-4o-mini-tts",
    voice: process.env.TTS_VOICE?.trim() || "alloy",
  };
}
