export type LlmConfig = {
  apiKey: string;
  model: string;
};

export class LlmConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LlmConfigurationError";
  }
}

function assertServerRuntime() {
  if (typeof window !== "undefined") {
    throw new LlmConfigurationError("LLM configuration is available only on the server.");
  }
}

export function getLlmConfig(): LlmConfig {
  assertServerRuntime();

  // Never rename this to NEXT_PUBLIC_OPENAI_API_KEY or return it from an API response.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new LlmConfigurationError("The digital twin is not configured with an AI provider key.");
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
  };
}
