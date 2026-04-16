import { getAllIssues } from "@/lib/issues";
import IssueCard from "@/components/IssueCard";
import SubscribeForm from "@/components/SubscribeForm";
import DonateButton from "@/components/DonateButton";

export default function HomePage() {
  const issues = getAllIssues();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
      {/* Hero */}
      <section className="mb-20 animate-slide-up">
        <p className="text-sm font-mono uppercase tracking-widest text-emerald-600 mb-6">
          Free · Every Monday · Written for students
        </p>
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-zinc-900 mb-7 leading-none">
          LARPER
        </h1>
        <p className="text-xl lg:text-2xl text-zinc-600 max-w-2xl leading-relaxed">
          AI and tech news made simple. Every issue breaks down what's happening,
          explains the jargon, and gives you a clear starting point — no background required.
        </p>
        <div className="flex flex-wrap gap-6 mt-8 text-sm font-mono text-zinc-500">
          {["No prior knowledge needed", "Every buzzword explained", "Free forever", "Student written"].map((item, i) => (
            <span key={item} className={`animate-fade-in stagger-${i + 1} flex items-center gap-1.5`}>
              <span className="text-emerald-500">✓</span>{item}
            </span>
          ))}
        </div>
      </section>

      {/* Issues grid */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-2 pb-5 border-b border-zinc-200">
          <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-600">
            Recent Issues
          </h2>
          <span className="text-sm font-mono text-zinc-400">
            {issues.length} published
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16">
          {issues.map((issue, i) => (
            <div key={issue.slug} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe + Donate side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16 mt-4">
        <SubscribeForm />
        <DonateButton />
      </div>
    </div>
  );
}
