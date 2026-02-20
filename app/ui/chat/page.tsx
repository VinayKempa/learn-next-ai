"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 p-4 rounded-lg ${message.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"}`}
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
      </form>
    </div>
  );
}
