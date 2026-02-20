"use client";

import { Spinner } from "@/components/spinner";
import Image from "next/image";
import { useState } from "react";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImgSrc(undefined);
    setPrompt("");
    
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      setImgSrc(`data:image/png;base64,${data}`);
    } catch (error) {
      console.error("Error generating image:", error);
      setError("An error occurred while generating the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-16">
          <Spinner />
        </div>
      ) : imageSrc ? (
        <div>
          <Image
            alt="Generated image"
            src={imageSrc}
            width={1024}
            height={1024}
            className="rounded-lg"
          />
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            name="input-form"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe image to generate"
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}
