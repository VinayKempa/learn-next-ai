"use client";

import { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";

export default function MultiModalPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/multi-modal-chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 p-4 text-gray-800 rounded-lg ${message.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"}`}
        >
          <div className="font-bold mb-2">
            {message.role === "user" ? "You:" : "AI:"}
          </div>
          {message.parts.map((part, partIndex) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    key={`${message.id}-${partIndex}`}
                    className="whitespace-pre-wrap"
                  >
                    {part.text}
                  </div>
                );
              case "file":
                if (part.mediaType?.startsWith("image/")) {
                  return (
                    <Image
                      key={`${message.id}-${partIndex}`}
                      src={part.url}
                      alt={part.filename || "Uploaded image"}
                      className="max-w-full h-auto rounded-lg"
                      width={500}
                      height={500}
                    />
                  );
                }
                return null;

              default:
                return null;
            }
          })}
        </div>
      ))}
      {status === "submitted" || status === "streaming" ? (
        <div className="mb-4 p-4 rounded-lg bg-gray-100 self-start">
          <div className="font-bold mb-2">AI:</div>
          <div>...</div>
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              {files?.length
                ? `${files.length} file${files.length > 1 ? "s" : ""} attached`
                : "Attach files"}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
            />
          </div>
          <div className="flex gap-2">
            <input
              name="input-form"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can I help you?"
              className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            />
            {status === "streaming" || status === "submitted" ? (
              <button
                type="button"
                onClick={stop}
                className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={status !== "ready"}
                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
