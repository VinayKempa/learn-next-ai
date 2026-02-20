import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in API route:", error);
    return Response.json(
      { error: "An error occurred while processing the request." },
      { status: 500 },
    );
  }
}
