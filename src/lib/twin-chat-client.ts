import type {
  TwinChatErrorCode,
  TwinChatMetadata,
  TwinChatRequest,
  TwinChatStreamEvent,
} from "@/types/digital-twin-chat";

export class TwinChatClientError extends Error {
  readonly code: TwinChatErrorCode;

  constructor(message: string, code: TwinChatErrorCode = "provider_error") {
    super(message);
    this.name = "TwinChatClientError";
    this.code = code;
  }
}

type TwinChatStreamHandlers = {
  onMetadata: (metadata: TwinChatMetadata) => void;
  onDelta: (text: string) => void;
};

function handleEvent(event: TwinChatStreamEvent, handlers: TwinChatStreamHandlers) {
  if (event.type === "metadata") handlers.onMetadata(event);
  if (event.type === "delta") handlers.onDelta(event.text);
  if (event.type === "error") throw new TwinChatClientError(event.message, event.code);
}

export async function askDigitalTwin(
  question: string,
  handlers: TwinChatStreamHandlers,
): Promise<void> {
  const requestBody: TwinChatRequest = { question };
  const response = await fetch("/api/twin-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      code?: TwinChatErrorCode;
    } | null;
    throw new TwinChatClientError(
      payload?.error || "The digital twin could not generate an answer.",
      payload?.code,
    );
  }

  if (!response.body) {
    throw new TwinChatClientError("The digital twin returned an empty response stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.trim()) handleEvent(JSON.parse(line) as TwinChatStreamEvent, handlers);
    }

    if (done) break;
  }

  if (buffer.trim()) handleEvent(JSON.parse(buffer) as TwinChatStreamEvent, handlers);
}
