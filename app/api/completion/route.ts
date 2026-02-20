import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json(); // Read the request body (if needed for future use)
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });
    return Response.json({ text });
  } catch (error) {
    console.error("Error in API route:", error);
    return Response.json(
      { error: "An error occurred while processing the request." },
      { status: 500 },
    );
  }
}
