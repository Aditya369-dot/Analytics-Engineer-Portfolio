import { getTtsConfig } from "./config.ts";
import { synthesizeOpenAiSpeech } from "./openai-provider.ts";

export type SynthesizedSpeech = { audio: ArrayBuffer; contentType: "audio/mpeg" };

export async function synthesizeSpeech(text: string): Promise<SynthesizedSpeech> {
  const config = getTtsConfig();
  return { audio: await synthesizeOpenAiSpeech(text, config), contentType: "audio/mpeg" };
}
