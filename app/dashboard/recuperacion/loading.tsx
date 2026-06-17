export default function RecuperacionLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-16 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)" }} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]" />
        ))}
      </div>

      <div className="h-64 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]" />
      <div className="h-48 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]" />
    </div>
  );
}
