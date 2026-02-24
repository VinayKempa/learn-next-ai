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
      const result = await fetch(
        `http://api.weatherapi.com/v1/current.json?q=${city}&key=${process.env.WEATHER_API_KEY}&units=imperial`,
      );
      const data = await result.json();
      const weatherData = {
        location: {
          name: data.location.name,
          country: data.location.country,
          localTime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          condition: {
            code: data.current.condition.code,
            text: data.current.condition.text,
          },
        },
      };
      return weatherData;
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
