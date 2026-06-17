export default function AgendaLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header compacto */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="premium-skeleton h-4 w-24 rounded-lg" />
          <div className="premium-skeleton h-7 w-52 rounded-xl" />
        </div>
        <div className="premium-skeleton h-10 w-28 rounded-xl" />
      </div>

      {/* KPI chips strip */}
      <div className="flex gap-2 overflow-hidden">
        {[80, 72, 64, 88, 56, 70].map((w, i) => (
          <div key={i} className="premium-skeleton h-7 shrink-0 rounded-lg" style={{ width: w }} />
        ))}
      </div>

      {/* Date nav */}
      <div
        className="flex items-center justify-between rounded-2xl border border-white/[0.10] bg-[#0E0E1C] p-3"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)" }}
      >
        <div className="premium-skeleton h-8 w-8 rounded-xl" />
        <div className="premium-skeleton h-5 w-36 rounded-lg" />
        <div className="premium-skeleton h-8 w-8 rounded-xl" />
      </div>

      {/* Appointment cards */}
      <div className="space-y-2.5">
        {[1, 0.85, 0.7, 0.55].map((opacity, i) => (
          <div
            key={i}
            className="premium-skeleton h-[76px] rounded-xl"
            style={{ opacity }}
          />
        ))}
      </div>

      {/* Progress bar gold */}
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full w-2/5 animate-[shimmer_1.6s_ease-in-out_infinite] rounded-full bg-[#D4AF37]/40 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
