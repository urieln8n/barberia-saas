export default function ReservasLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04] px-6 py-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="shimmer-gold h-2.5 w-20 rounded-full" />
            <div className="shimmer-gold h-8 w-64 rounded-xl" />
            <div className="shimmer-gold h-2.5 w-80 max-w-full rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="shimmer-gold h-10 w-36 rounded-2xl" />
            <div className="shimmer-gold h-10 w-28 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* KPI bar (6 cards) */}
      <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5"
          >
            <div className="shimmer-gold mb-3 h-10 w-10 rounded-xl" />
            <div className="shimmer-gold mb-1.5 h-7 w-14 rounded-lg" />
            <div className="shimmer-gold h-2.5 w-24 rounded-full" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04]">
        <div className="flex gap-1 border-b border-white/[0.06] px-3 pt-3 pb-0">
          {[64, 40, 72, 56, 80, 48, 56].map((w, i) => (
            <div
              key={i}
              className="shimmer-gold mb-0 h-8 rounded-t-lg"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="flex gap-2 p-3">
          <div className="shimmer-gold h-9 flex-1 rounded-xl" />
          <div className="shimmer-gold h-9 w-44 rounded-xl" />
        </div>
      </div>

      {/* Appointment cards */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04]"
          >
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="shimmer-gold h-4 w-12 rounded" />
                <div className="shimmer-gold h-3 w-24 rounded" />
              </div>
              <div className="shimmer-gold h-5 w-20 rounded-full" />
            </div>
            {/* Card body */}
            <div className="space-y-2 px-4 py-3">
              <div className="shimmer-gold h-4 w-36 rounded-lg" />
              <div className="shimmer-gold h-3 w-48 max-w-full rounded" />
              <div className="shimmer-gold h-3 w-28 rounded" />
            </div>
            {/* Card actions */}
            <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3">
              <div className="shimmer-gold h-7 w-20 rounded-lg" />
              <div className="shimmer-gold h-7 w-16 rounded-lg" />
              <div className="shimmer-gold ml-auto h-4 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
