export default function ClientesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="premium-skeleton h-3.5 w-20 rounded-lg" />
          <div className="premium-skeleton h-8 w-64 rounded-xl" />
          <div className="premium-skeleton h-4 w-96 rounded-lg" />
        </div>
        <div className="premium-skeleton h-10 w-32 rounded-xl" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 0.9, 0.8, 0.7].map((opacity, i) => (
          <div key={i} className="premium-skeleton h-24 rounded-2xl" style={{ opacity }} />
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="flex gap-2 overflow-hidden">
        {[60, 52, 76, 64, 70, 88].map((w, i) => (
          <div key={i} className="premium-skeleton h-8 shrink-0 rounded-xl" style={{ width: w }} />
        ))}
        <div className="premium-skeleton ml-2 h-8 flex-1 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0E0E1C]" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}>
        {/* Header */}
        <div className="flex gap-4 border-b border-white/[0.07] bg-white/[0.03] px-5 py-3.5">
          {[140, 100, 120, 80, 80].map((w, i) => (
            <div key={i} className="premium-skeleton h-3 rounded" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {[1, 0.85, 0.72, 0.6, 0.5].map((opacity, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-white/[0.05] px-5 py-4" style={{ opacity }}>
            <div className="premium-skeleton h-9 w-9 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <div className="premium-skeleton h-3.5 w-36 rounded-lg" />
              <div className="premium-skeleton h-3 w-24 rounded" />
            </div>
            <div className="premium-skeleton h-3 w-20 rounded" />
            <div className="premium-skeleton h-5 w-8 rounded-lg" />
            <div className="premium-skeleton h-3 w-16 rounded" />
            <div className="flex gap-1">
              <div className="premium-skeleton h-7 w-7 rounded-xl" />
              <div className="premium-skeleton h-7 w-7 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
