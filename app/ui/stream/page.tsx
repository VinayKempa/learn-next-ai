"use client";

import { useCompletion } from "@ai-sdk/react";
import { is } from "zod/locales";

export default function StreamPage() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: "/api/streaming",
  });
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {isLoading && !completion && <div>Loading...</div>}
      {completion && <div className="whitespace-pre-wrap">{completion}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            name="input-form"
            onChange={handleInputChange}
            value={input}
            placeholder="How can I help you?"
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
          />
          {isLoading ? (
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
              disabled={isLoading}
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
