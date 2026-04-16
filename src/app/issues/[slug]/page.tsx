import { getIssueBySlug, getAllSlugs } from "@/lib/issues";
import BuzzwordSpotlight from "@/components/BuzzwordSpotlight";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const issue = await getIssueBySlug(slug);
    return {
      title: `${issue.title} — LARPER`,
      description: issue.description,
    };
  } catch {
    return { title: "Issue Not Found — LARPER" };
  }
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;

  let issue;
  try {
    issue = await getIssueBySlug(slug);
  } catch {
    notFound();
  }

  const formatted = new Date(issue.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-mono text-zinc-500 hover:text-zinc-900 transition-colors duration-200 mb-12 group"
      >
        <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Issues
      </Link>

      {/* Header — full width */}
      <header className="mb-10 animate-slide-up max-w-4xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm font-mono text-emerald-600">
            Issue #{String(issue.issue).padStart(3, "0")}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-sm text-zinc-500 font-mono">{formatted}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 leading-tight mb-5">
          {issue.title}
        </h1>
        <p className="text-xl text-zinc-600 leading-relaxed">
          {issue.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {issue.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded border bg-zinc-50 text-zinc-600 border-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <hr className="border-zinc-200 mb-10" />

      {/* Two-column on desktop: article left, buzzword sidebar right */}
      <div className="flex flex-col lg:flex-row lg:gap-16">
        {/* Buzzword — above article on mobile, sidebar on desktop */}
        <aside className="order-first lg:order-last lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24">
            <BuzzwordSpotlight buzzword={issue.buzzword} />
          </div>
        </aside>

        {/* Article */}
        <article className="flex-1 min-w-0 animate-fade-in">
          <div
            className="prose-larper"
            dangerouslySetInnerHTML={{ __html: issue.contentHtml }}
          />
        </article>
      </div>

      <hr className="border-zinc-200 my-14" />

      {/* Footer CTA */}
      <div className="space-y-3">
        <p className="text-zinc-600 text-base">
          Found this helpful?{" "}
          <Link href="/#subscribe" className="text-zinc-900 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-900 transition-all duration-200">
            Subscribe for free
          </Link>{" "}
          or{" "}
          <Link href="/#donate" className="text-zinc-900 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-900 transition-all duration-200">
            support LARPER
          </Link>
          .
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 font-mono group"
        >
          <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Browse all issues
        </Link>
      </div>
    </div>
  );
}
