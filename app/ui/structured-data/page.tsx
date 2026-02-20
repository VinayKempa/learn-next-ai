"use client";

import { receipeSchema } from "@/app/api/structured-data/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import React from "react";

export default function StructuredDataPage() {
  const [dishName, setDishName] = React.useState("");
  const { object, isLoading, error, submit, stop } = useObject({
    api: "/api/structured-data",
    schema: receipeSchema,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit({ dishName });
    setDishName("");
  };
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {object?.receipe && (
        <div>
          <h2 className="text-2xl font-bold">{object.receipe.name}</h2>
          {(object.receipe.ingredients || []).map((ingredient, index) => (
            <div key={index}>
              {ingredient?.amount} of {ingredient?.name}
            </div>
          ))}
          {object?.receipe?.steps && (
            <div>
              <h3 className="text-xl font-semibold mt-4">Steps:</h3>
              <ol className="list-decimal ml-5">
                {(object.receipe.steps || []).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            name="input-form"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
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
              disabled={isLoading || !dishName.trim()}
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Generate
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
