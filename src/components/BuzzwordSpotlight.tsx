import type { Buzzword } from "@/lib/issues";

export default function BuzzwordSpotlight({ buzzword }: { buzzword: Buzzword }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl animate-slide-up"
      style={{
        background: "linear-gradient(145deg, #ecfdf5 0%, #f0fdfa 40%, #e6fffa 70%, #f0fdf4 100%)",
        border: "1px solid #6ee7b7",
      }}
    >
      {/* Top accent bar — dark green → teal → emerald → cyan */}
      <div
        className="h-[3px] w-full"
        style={{ background: "linear-gradient(90deg, #064e3b, #047857, #0d9488, #10b981, #06b6d4)" }}
      />

      <div className="p-6">
        {/* Label */}
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-700 mb-4">
          🔍 Buzzword Spotlight
        </p>

        {/* Term — dark green → teal gradient text */}
        <h3
          className="text-2xl font-black mb-3 leading-tight"
          style={{
            background: "linear-gradient(90deg, #064e3b, #047857, #0d9488)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {buzzword.term}
        </h3>

        {/* Definition */}
        <p className="text-zinc-600 leading-relaxed mb-6 text-base">
          {buzzword.definition}
        </p>

        {/* Examples */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-700">
            You might hear it like this:
          </p>
          {buzzword.examples.map((ex, i) => (
            <blockquote
              key={i}
              className="pl-4 text-sm text-zinc-500 italic leading-relaxed"
              style={{ borderLeft: "2px solid #6ee7b7" }}
            >
              &ldquo;{ex}&rdquo;
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
