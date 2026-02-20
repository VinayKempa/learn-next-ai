import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { receipeSchema } from "./schema";

export async function POST(request: Request) {
  try {
    const { dish } = await request.json();
    const result = streamObject({
      model: openai("gpt-5-nano"),
      prompt: `Generate a receipe for ${dish}`,
      schema: receipeSchema,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response("Error generating recipe", { status: 500 });
  }
}
