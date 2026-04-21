import { fetchHNStories, fetchGuardianNews, hnDomain, timeAgo } from "@/lib/news";
import { getAllIssues } from "@/lib/issues";
import CopyButton from "./CopyButton";
import SendIssueButton from "./SendIssueButton";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export const revalidate = 1800;

export default async function AdminPage() {
  const [hnStories, guardianNews, issues] = await Promise.all([
    fetchHNStories(30),
    fetchGuardianNews(20),
    Promise.resolve(getAllIssues()),
  ]);

  const hasGuardian = !!process.env.GUARDIAN_API_KEY;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-200">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 mb-1">Admin</p>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">LARPER Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Send issues, browse stories, write the next one.</p>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/" className="text-sm font-mono text-zinc-400 hover:text-zinc-900 transition-colors">
            ← Back to site
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* ── Send Issues ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-black text-zinc-900">Published Issues</h2>
          <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
            {issues.length} total
          </span>
        </div>
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          {issues.map((issue, i) => {
            const formatted = new Date(issue.date).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
            });
            return (
              <div
                key={issue.slug}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 ${
                  i < issues.length - 1 ? "border-b border-zinc-100" : ""
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <span className="text-sm font-mono text-emerald-600 shrink-0">
                    #{String(issue.issue).padStart(3, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 text-sm leading-snug truncate">
                      {issue.title}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">{formatted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/issues/${issue.slug}`}
                    target="_blank"
                    className="text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    Preview ↗
                  </Link>
                  <SendIssueButton
                    slug={issue.slug}
                    title={issue.title}
                    issueNum={issue.issue}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── News sources ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

        {/* HackerNews */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-black text-zinc-900">HackerNews Top Stories</h2>
            <span className="text-xs font-mono bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {hnStories.length} stories
            </span>
          </div>
          <div className="space-y-1">
            {hnStories.map((story) => (
              <div
                key={story.id}
                className="group flex items-start gap-3 py-3.5 px-4 rounded-lg hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200"
              >
                <div className="shrink-0 w-10 text-center pt-0.5">
                  <span className="text-sm font-black text-orange-500">{story.score}</span>
                  <p className="text-xs text-zinc-400 font-mono leading-none mt-0.5">pts</p>
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-zinc-900 hover:text-emerald-600 transition-colors leading-snug block mb-1"
                  >
                    {story.title}
                  </a>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-zinc-400">{hnDomain(story.url)}</span>
                    <span className="text-zinc-300 text-xs">·</span>
                    <span className="text-xs text-zinc-400">{timeAgo(story.time)}</span>
                    <span className="text-zinc-300 text-xs">·</span>
                    <span className="text-xs text-zinc-400">{story.descendants} comments</span>
                  </div>
                </div>
                <div className="shrink-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={story.title} label="Title" />
                  <CopyButton text={story.url} label="URL" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guardian AI News */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-black text-zinc-900">The Guardian — Tech &amp; AI</h2>
            {hasGuardian ? (
              <span className="text-xs font-mono bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                {guardianNews.length} articles
              </span>
            ) : (
              <span className="text-xs font-mono bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                No API key
              </span>
            )}
          </div>
          {!hasGuardian ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-zinc-600 leading-relaxed">
              <p className="font-bold text-zinc-800 mb-2">Add a free Guardian API key to enable this section.</p>
              <ol className="list-decimal pl-4 space-y-1 text-zinc-600">
                <li>Register free at <span className="font-mono text-zinc-800">open-platform.theguardian.com</span></li>
                <li>Copy your API key from the dashboard</li>
                <li>Add <span className="font-mono bg-white px-1 rounded border border-amber-200">GUARDIAN_API_KEY=your_key</span> to <span className="font-mono">.env.local</span></li>
                <li>Restart the dev server</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-1">
              {guardianNews.map((article, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 py-3.5 px-4 rounded-lg hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200"
                >
                  <div className="shrink-0 w-10 text-center pt-0.5">
                    <span className="text-xs font-mono text-zinc-400 leading-tight block">
                      {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-zinc-900 hover:text-emerald-600 transition-colors leading-snug block mb-1"
                    >
                      {article.title}
                    </a>
                    {article.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-1">
                        {article.description}
                      </p>
                    )}
                    <span className="text-xs font-mono text-zinc-400">The Guardian · {article.section}</span>
                  </div>
                  <div className="shrink-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={article.title} label="Title" />
                    <CopyButton text={article.url} label="URL" />
                    {article.description && (
                      <CopyButton text={article.description} label="Desc" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <p className="text-xs font-mono text-zinc-400 text-center mt-12">
        Stories refresh every 30 minutes · HackerNews API + NewsAPI
      </p>
    </div>
  );
}
