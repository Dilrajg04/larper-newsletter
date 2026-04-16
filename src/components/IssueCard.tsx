import Link from "next/link";
import type { IssueMeta } from "@/lib/issues";

export default function IssueCard({ issue }: { issue: IssueMeta }) {
  const formatted = new Date(issue.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <article className="py-7 border-b border-zinc-100 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-mono text-emerald-600">
            #{String(issue.issue).padStart(3, "0")}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-sm text-zinc-500 font-mono">{formatted}</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 mb-2 leading-snug group-hover:text-zinc-500 transition-colors duration-200">
          {issue.title}
        </h2>
        <p className="text-base text-zinc-600 line-clamp-2 leading-relaxed mb-4">
          {issue.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {issue.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-mono text-zinc-500 hidden sm:block">
              Buzzword: <span className="text-amber-500 font-semibold">{issue.buzzword.term}</span>
            </span>
            <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-all duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
