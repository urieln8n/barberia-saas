export default function BarberosLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="premium-skeleton h-3.5 w-20 rounded-lg" />
          <div className="premium-skeleton h-8 w-48 rounded-xl" />
        </div>
        <div className="premium-skeleton h-10 w-36 rounded-xl" />
      </div>

      {/* Barber cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 0.9, 0.75, 0.6].map((opacity, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.10] bg-[#0E0E1C] p-5"
            style={{ opacity, boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
          >
            <div className="flex items-center gap-4">
              <div className="premium-skeleton h-14 w-14 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="premium-skeleton h-4 w-28 rounded-lg" />
                <div className="premium-skeleton h-3 w-20 rounded" />
              </div>
              <div className="premium-skeleton h-6 w-16 rounded-xl" />
            </div>
            <div className="mt-4 flex gap-2 border-t border-white/[0.07] pt-4">
              <div className="premium-skeleton h-8 flex-1 rounded-xl" />
              <div className="premium-skeleton h-8 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
