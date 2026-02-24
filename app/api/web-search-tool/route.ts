import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  InferUITools,
  stepCountIs,
  streamText,
  UIDataTypes,
  UIMessage,
} from "ai";

const tools = {
  web_search_preview: openai.tools.webSearchPreview({
    searchContextSize: "low"
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();
    const result = streamText({
      model: openai.responses("gpt-5-nano"),
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });
    return result.toUIMessageStreamResponse({
      sendSources: true
    });
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
