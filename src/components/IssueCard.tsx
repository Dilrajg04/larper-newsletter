import Link from "next/link";
import Image from "next/image";
import type { IssueMeta } from "@/lib/issues";


export default function IssueCard({ issue }: { issue: IssueMeta }) {
  const formatted = new Date(issue.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link href={`/issues/${issue.slug}`} className="group block">
      <article className="relative py-8 border-b border-zinc-100 transition-all duration-300 hover:-translate-y-0.5 pl-4">

        {/* Left accent bar — appears on hover */}
        <div className="absolute left-0 top-8 bottom-8 w-0.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Cover image with topic label */}
        {issue.coverImage && (
          <div className="flex items-start gap-5 mb-5">
            {issue.shortTitle && (
              <div className="shrink-0 w-28 pt-1">
                <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                  #{String(issue.issue).padStart(3, "0")}
                </span>
                <p className="text-2xl font-black text-zinc-900 leading-tight">
                  {issue.shortTitle}
                </p>
              </div>
            )}
            <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 shadow-sm">
              <Image
                src={issue.coverImage}
                alt={issue.title}
                fill
                unoptimized
                className="object-cover scale-[1.1] transition-transform duration-500 group-hover:scale-[1.13]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xs font-mono font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-md">
            #{String(issue.issue).padStart(3, "0")}
          </span>
          <span className="text-xs text-zinc-400 font-mono">{formatted}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 mb-2.5 leading-snug group-hover:text-zinc-500 transition-colors duration-200">
          {issue.title}
        </h2>

        {/* Description */}
        <p className="text-base text-zinc-500 line-clamp-2 leading-relaxed mb-4">
          {issue.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {issue.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 rounded border bg-zinc-50 text-zinc-500 border-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-zinc-400 hidden sm:block">
              Buzzword:{" "}
              <span className="font-semibold text-violet-500">{issue.buzzword.term}</span>
            </span>
            <svg
              className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-all duration-200 group-hover:translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
