import type { TwinChatRequest, TwinChatResponse } from "@/types/digital-twin-chat";

export async function askDigitalTwin(question: string): Promise<TwinChatResponse> {
  const requestBody: TwinChatRequest = { question };
  const response = await fetch("/api/twin-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("The digital twin could not retrieve portfolio evidence.");
  }

  return (await response.json()) as TwinChatResponse;
}
