"use client";

import { useState, useMemo } from "react";
import IssueCard from "./IssueCard";
import type { IssueMeta } from "@/lib/issues";

export default function IssueFilter({ issues }: { issues: IssueMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [order, setOrder] = useState<"desc" | "asc">("desc");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    issues.forEach((issue) => issue.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [issues]);

  const filtered = useMemo(() => {
    return issues
      .filter((issue) => {
        const matchesTag = activeTag ? issue.tags.includes(activeTag) : true;
        const q = query.toLowerCase();
        const matchesQuery = q
          ? issue.title.toLowerCase().includes(q) ||
            issue.description.toLowerCase().includes(q) ||
            issue.tags.some((t) => t.toLowerCase().includes(q))
          : true;
        return matchesTag && matchesQuery;
      })
      .sort((a, b) => order === "desc" ? b.issue - a.issue : a.issue - b.issue);
  }, [issues, query, activeTag, order]);

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-5">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issues..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tag pills + sort toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full border bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-400 transition-colors"
        >
          {order === "desc" ? (
            <><span>↓</span> Newest first</>
          ) : (
            <><span>↑</span> Oldest first</>
          )}
        </button>
        <span className="text-zinc-200 text-sm">|</span>
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
            activeTag === null
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-400"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
              activeTag === tag
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm font-mono text-zinc-400 py-12 text-center">
          No issues match &ldquo;{query || activeTag}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          {filtered.map((issue, i) => (
            <div key={issue.slug} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
