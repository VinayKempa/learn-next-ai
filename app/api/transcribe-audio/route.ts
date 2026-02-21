import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File;
    if (!file) {
      return new Response("No audio file provided", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioData = new Uint8Array(arrayBuffer);

    const transcription = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: audioData,
    });

    return Response.json(transcription);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return new Response("Failed to transcribe audio", { status: 500 });
  }
}
