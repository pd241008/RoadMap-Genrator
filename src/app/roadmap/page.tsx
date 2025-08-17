/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ThreeBackground from "@/components/ThreeBackground";

export default function RoadmapPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(
        `/roadmap/output?data=${encodeURIComponent(
          JSON.stringify({ roadmap: data.result })
        )}`
      );
    } catch (err: any) {
      alert(err.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen p-4 font-inter">
      {/* Animated 3D Background */}
      <ThreeBackground />

      {/* Card Content */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 z-10 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          🚀 AI Roadmap Generator
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="text"
            placeholder="Enter a topic (e.g. Data Science, Web Dev)"
            className="flex-1 px-4 py-2 border-2 border-black rounded-xl font-mono shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          <button
            type="submit"
            className="px-4 py-2 border-2 border-black rounded-xl font-bold text-sm shadow-[4px_4px_0px_black] bg-white hover:bg-blue-500 hover:text-white transition-colors"
            disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
      </div>
    </main>
  );
}
