import { Suspense } from "react";
import RoadmapContent from "./page";

export default function OutputPage() {
  return (
    <Suspense
      fallback={
        <div className="z-10 max-w-lg w-full rounded-xl border border-gray-200 bg-white/90 p-6 shadow-lg">
          <p className="text-gray-800 font-medium mb-2">Loading roadmap...</p>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
