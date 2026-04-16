import type { Buzzword } from "@/lib/issues";

export default function BuzzwordSpotlight({ buzzword }: { buzzword: Buzzword }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 animate-slide-up">
      <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-4">
        🔍 Buzzword Spotlight
      </p>
      <h3 className="text-2xl font-black text-amber-600 mb-3 leading-tight">
        {buzzword.term}
      </h3>
      <p className="text-zinc-700 leading-relaxed mb-6 text-base">
        {buzzword.definition}
      </p>
      <div className="space-y-3">
        <p className="text-xs font-mono uppercase tracking-widest text-amber-500">
          You might hear it used like this:
        </p>
        {buzzword.examples.map((ex, i) => (
          <blockquote
            key={i}
            className="border-l-2 border-amber-300 pl-4 text-sm text-zinc-600 italic leading-relaxed"
          >
            &ldquo;{ex}&rdquo;
          </blockquote>
        ))}
      </div>
    </div>
  );
}
