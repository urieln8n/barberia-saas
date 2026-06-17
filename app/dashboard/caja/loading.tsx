export default function CajaLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)" }} />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]" />
        ))}
      </div>

      {/* Main panel */}
      <div className="h-64 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]" />

      {/* Movements table */}
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-xl border border-white/[0.06] bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}
