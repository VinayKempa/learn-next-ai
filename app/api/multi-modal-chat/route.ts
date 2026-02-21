import { UIMessage, streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating multi-modal chat:", error);
    return new Response("Failed to stream multi-modal chat completion", { status: 500 });
  }
}
