import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
    });
    // Create a NEW copy (this forces ArrayBuffer, not SharedArrayBuffer)
    const safeUint8 = new Uint8Array(audio.uint8Array);

    const blob = new Blob([safeUint8], {
      type: audio.mediaType || "audio/mpeg",
    });

    return new Response(blob, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return new Response("Failed to generate speech", { status: 500 });
  }
}
