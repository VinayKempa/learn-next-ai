import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  InferUITools,
  stepCountIs,
  streamText,
  tool,
  UIDataTypes,
  UIMessage,
} from "ai";
import { z } from "zod";

const tools = {
  getWeather: tool({
    description: "Get the weather for the given location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
        console.log(`Getting weather for ${city}...`);
      if (city === "Gotham City") {
        return "70°F and cloudy";
      } else if (city === "Metropolis") {
        return "80°F and sunny";
      } else {
        return "Unknown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();
    const result = streamText({
      model: openai("gpt-5-mini"),
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
