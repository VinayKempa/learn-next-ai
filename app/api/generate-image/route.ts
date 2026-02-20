import { generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { prompt }: { prompt: string } = await request.json();
    const {image} = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          style: "vivid",
          quality: "hd",
        },
      },
    });
    return Response.json(image.base64);
  } catch (error) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
