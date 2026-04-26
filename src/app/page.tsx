import { getAllIssues } from "@/lib/issues";
import IssueCard from "@/components/IssueCard";
import SubscribeForm from "@/components/SubscribeForm";
import DonateButton from "@/components/DonateButton";

export default function HomePage() {
  const issues = getAllIssues();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">

      {/* Hero */}
      <section className="pt-20 pb-24 animate-slide-up">
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 mb-6">
          Free · Every Monday · Written for students
        </p>
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-zinc-900 mb-8 leading-none">
          LARPER
        </h1>
        <p className="text-xl lg:text-2xl text-zinc-500 max-w-2xl leading-relaxed mb-10">
          AI and tech news made simple. Every issue breaks down what&apos;s happening,
          explains the jargon, and gives you a clear starting point — no background required.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-mono text-zinc-400">
          {[
            { label: "No prior knowledge needed", color: "text-emerald-500" },
            { label: "Every buzzword explained",  color: "text-amber-500" },
            { label: "Free forever",              color: "text-emerald-500" },
          ].map(({ label, color }, i) => (
            <span key={label} className={`animate-fade-in stagger-${i + 1} flex items-center gap-2`}>
              <span className={color}>✓</span>{label}
            </span>
          ))}
        </div>
      </section>

      {/* Used by */}
      <div className="flex flex-wrap items-center gap-6 mb-16 pb-16 border-b border-zinc-100">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Used by students at</span>
        <span className="text-sm font-bold text-zinc-700 tracking-tight">UC San Diego</span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600">Recent Issues</span>
        <div className="flex-1 h-px bg-zinc-100" />
        <span className="text-xs font-mono text-zinc-400">{issues.length} published</span>
      </div>

      {/* Issues grid */}
      <section className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          {issues.map((issue, i) => (
            <div key={issue.slug} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe + Donate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 mt-8 mb-8">
        <SubscribeForm />
        <DonateButton />
      </div>

    </div>
  );
}
