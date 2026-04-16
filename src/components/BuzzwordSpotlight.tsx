import type { Buzzword } from "@/lib/issues";

export default function BuzzwordSpotlight({ buzzword }: { buzzword: Buzzword }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl animate-slide-up"
      style={{
        background: "linear-gradient(145deg, #eef2ff 0%, #faf5ff 30%, #fff1f2 60%, #fffbeb 100%)",
        border: "1px solid #e9d5ff",
      }}
    >
      {/* Top accent bar — indigo → violet → rose → amber */}
      <div
        className="h-[3px] w-full"
        style={{ background: "linear-gradient(90deg, #818cf8, #c084fc, #fb7185, #fbbf24)" }}
      />

      <div className="p-6">
        {/* Label */}
        <p className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-4">
          🔍 Buzzword Spotlight
        </p>

        {/* Term — gradient text indigo → rose */}
        <h3
          className="text-2xl font-black mb-3 leading-tight"
          style={{
            background: "linear-gradient(90deg, #6366f1, #a855f7, #f43f5e)",
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
          <p className="text-xs font-mono uppercase tracking-widest text-violet-400">
            You might hear it like this:
          </p>
          {buzzword.examples.map((ex, i) => (
            <blockquote
              key={i}
              className="pl-4 text-sm text-zinc-500 italic leading-relaxed"
              style={{ borderLeft: "2px solid #d8b4fe" }}
            >
              &ldquo;{ex}&rdquo;
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
