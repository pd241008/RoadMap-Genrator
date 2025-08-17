/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import OutputRenderer from "@/components/OutputRenderer";
import ThreeBackground from "@/components/ThreeBackground";

export default function OutputPage() {
  const [roadmapData, setRoadmapData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setError(null);
    const dataParam = searchParams.get("data");

    if (!dataParam) {
      setRoadmapData(null);
      return;
    }

    try {
      // Supports both URI-encoded and raw JSON in the query
      const maybeDecoded = (() => {
        try {
          return decodeURIComponent(dataParam);
        } catch {
          return dataParam;
        }
      })();

      const parsed = JSON.parse(maybeDecoded);

      if (parsed && typeof parsed.roadmap === "string") {
        setRoadmapData(parsed.roadmap);
      } else if (typeof parsed === "string") {
        // in case you pass raw roadmap string directly
        setRoadmapData(parsed);
      } else {
        setRoadmapData(null);
        setError("Invalid payload. Expected { roadmap: string }.");
      }
    } catch (e) {
      setRoadmapData(null);
      setError("Failed to parse ?data JSON.");
    }
  }, [searchParams]);

  if (!roadmapData) {
    return (
      <main className="relative flex items-center justify-center min-h-screen p-4">
        <ThreeBackground />
        <div className="z-10 max-w-lg w-full rounded-xl border border-gray-200 bg-white/90 p-6 shadow-lg">
          <p className="text-gray-800 font-medium mb-2">
            No roadmap data found.
          </p>
          <p className="text-sm text-gray-600">
            Pass a <code className="rounded bg-gray-100 px-1 py-0.5">data</code>{" "}
            query param containing JSON like:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800">
            {`{
  "roadmap": "**Phase 1: Basics**\\n* HTML\\n* CSS\\n\\n**Phase 2: JS**\\n* ES6\\n* Async"
}`}
          </pre>
          {error && <p className="mt-3 text-sm text-red-600">Error: {error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen p-4">
      <ThreeBackground />
      <div className="relative z-10 mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-xl">
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            📚 Interactive Learning Roadmap
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Your roadmap is parsed from the URL and rendered dynamically.
            Progress is saved locally.
          </p>
        </header>
        <OutputRenderer raw={roadmapData} />
      </div>
    </main>
  );
}
