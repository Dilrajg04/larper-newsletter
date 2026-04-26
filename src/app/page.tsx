import { getAllIssues } from "@/lib/issues";
import IssueFilter from "@/components/IssueFilter";
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
        <div className="flex flex-col gap-2 text-sm font-mono text-zinc-400">
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
      <div className="flex flex-col gap-3 mb-16 pb-16 border-b border-zinc-100">
        <span className="text-sm font-mono uppercase tracking-widest text-zinc-400">Used by students at</span>
        <div className="flex flex-wrap gap-6">
          <span className="text-xl font-black text-zinc-900 tracking-tight">UC San Diego</span>
          <span className="text-xl font-black text-zinc-900 tracking-tight">USC</span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600">Recent Issues</span>
        <div className="flex-1 h-px bg-zinc-100" />
        <span className="text-xs font-mono text-zinc-400">{issues.length} published</span>
      </div>

      {/* Issues grid with search + tag filter */}
      <section className="mb-6">
        <IssueFilter issues={issues} />
      </section>

      {/* Subscribe + Donate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 mt-8 mb-8">
        <SubscribeForm />
        <DonateButton />
      </div>

    </div>
  );
}
