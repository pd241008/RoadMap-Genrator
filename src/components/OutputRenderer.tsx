"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Circle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";

/** Types */
interface Step {
  title: string;
  content: string[];
}
interface PersistState {
  /** completed steps keyed by a stable id */
  completed: Record<string, boolean>;
  /** expanded phases keyed by phase title */
  expanded: Record<string, boolean>;
}

/** Helpers */
const STORAGE_KEY = "roadmap-progress-v1";

/** Create a stable id for a phase item */
function makeItemId(phaseTitle: string, itemText: string) {
  return `${phaseTitle}::${itemText}`.toLowerCase();
}

/** Load/save progress from localStorage */
function loadState(): PersistState {
  if (typeof window === "undefined") return { completed: {}, expanded: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, expanded: {} };
    const parsed = JSON.parse(raw) as PersistState;
    return {
      completed: parsed.completed || {},
      expanded: parsed.expanded || {},
    };
  } catch {
    return { completed: {}, expanded: {} };
  }
}
function saveState(next: PersistState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/** Parse LLM output */
function parseRoadmap(raw: string): Step[] {
  if (!raw || typeof raw !== "string") return [];

  const sections = raw
    .split(/(?=^\*\*Phase\s+\d+:[^\n]*\*\*)/m)
    .filter((section) => section.trim())
    .filter((section) => section.includes("* "));

  return sections.map((section) => {
    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    let title = "Untitled Phase";
    const firstLine = lines[0] || "";
    const titleMatch = firstLine.match(/^\*\*Phase\s+\d+:\s+([^\*]+)\*\*/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    const content = lines
      .slice(1)
      .filter((line) => line.startsWith("* "))
      .map((line) =>
        line.replace(/^\*\s*(\*\*Step\s+\d+\.\d+:\s+(.+?)\*\*)?/, "").trim()
      )
      .filter((line) => line.length > 0);

    return { title, content };
  });
}

const OutputRenderer: React.FC<{ raw: string }> = ({ raw }) => {
  const [persist, setPersist] = useState<PersistState>({
    completed: {},
    expanded: {},
  });
  const [query, setQuery] = useState("");

  // Parse steps whenever raw changes
  const steps = useMemo(() => parseRoadmap(raw), [raw]);

  // Initialize persisted UI state
  useEffect(() => setPersist(loadState()), []);
  useEffect(() => saveState(persist), [persist]);

  // Derived: filtered view by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return steps;
    const q = query.toLowerCase();
    return steps
      .map((s) => ({
        ...s,
        content: s.content.filter((c) => c.toLowerCase().includes(q)),
      }))
      .filter((s) => s.title.toLowerCase().includes(q) || s.content.length > 0);
  }, [steps, query]);

  // Progress calculation
  const totalItems = useMemo(
    () => steps.reduce((acc, s) => acc + s.content.length, 0),
    [steps]
  );
  const completedCount = useMemo(() => {
    let count = 0;
    for (const s of steps) {
      for (const item of s.content) {
        if (persist.completed[makeItemId(s.title, item)]) count++;
      }
    }
    return count;
  }, [steps, persist.completed]);
  const progressPct =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // UI actions
  const togglePhase = (title: string) =>
    setPersist((p) => ({
      ...p,
      expanded: { ...p.expanded, [title]: !p.expanded[title] },
    }));

  const toggleItem = (phaseTitle: string, item: string) => {
    const id = makeItemId(phaseTitle, item);
    setPersist((p) => ({
      ...p,
      completed: { ...p.completed, [id]: !p.completed[id] },
    }));
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-gray-200 bg-white/80">
        <p className="text-gray-500 italic">
          No roadmap data available to display.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Header: search + progress */}
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Learning Progress
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Track, search, and complete items. State persists locally.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phase or item..."
              className="w-full rounded-xl border border-gray-300 bg-white px-10 py-2 text-sm outline-none focus:border-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <span>
              {completedCount}/{totalItems} completed
            </span>
            <span>{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* vertical spine */}
        <div className="absolute left-6 top-0 bottom-0 w-1 rounded-full bg-gray-300" />

        <ul className="space-y-6 ml-16">
          {filtered.map((step, idx) => {
            const isExpanded = persist.expanded[step.title] ?? true; // default open
            const isLast = idx === filtered.length - 1;

            // Phase completion (all items complete)
            const phaseTotal = step.content.length;
            const phaseDone = step.content.filter(
              (c) => persist.completed[makeItemId(step.title, c)]
            ).length;
            const phaseComplete = phaseTotal > 0 && phaseDone === phaseTotal;

            return (
              <li
                key={step.title}
                className="relative">
                {/* node bullet */}
                <div className="absolute -left-16 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-black shadow-sm">
                  {isLast || phaseComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                {/* Phase card */}
                <div className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => togglePhase(step.title)}
                    className="flex w-full items-center justify-between"
                    aria-expanded={isExpanded}
                    aria-controls={`phase-${idx}`}>
                    <div className="text-left">
                      <h2 className="text-base md:text-lg font-bold text-blue-700">
                        {step.title}
                      </h2>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {phaseDone}/{phaseTotal} items completed
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      id={`phase-${idx}`}
                      className="mt-4">
                      <ul className="space-y-2">
                        {step.content.map((line) => {
                          const id = makeItemId(step.title, line);
                          const done = !!persist.completed[id];
                          return (
                            <li
                              key={id}
                              className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={() => toggleItem(step.title, line)}
                                className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded border border-gray-400"
                                aria-pressed={done}
                                aria-label={
                                  done ? "Mark incomplete" : "Mark complete"
                                }>
                                {done ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                              <p
                                className={`text-sm ${
                                  done
                                    ? "text-gray-500 line-through"
                                    : "text-gray-800"
                                }`}>
                                {line}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OutputRenderer;
