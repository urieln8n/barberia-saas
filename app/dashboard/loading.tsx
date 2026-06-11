import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      {/* Brand pulse — center stage while server fetches */}
      <div className="flex flex-col items-center justify-center gap-6 py-6">
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <span className="absolute h-24 w-24 animate-ping rounded-[32px] border border-[#D4AF37]/20 motion-reduce:animate-none" />
          <span
            className="absolute h-16 w-16 animate-ping rounded-[24px] border border-[#D4AF37]/30 motion-reduce:animate-none"
            style={{ animationDelay: "0.15s" }}
          />
          <BarberiaOSLogo variant="icon" size={52} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]/60">
          Cargando...
        </p>
      </div>

      {/* Page header skeleton */}
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04] px-6 py-6 md:px-8 md:py-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
        <div className="shimmer-gold mb-3 h-2.5 w-20 rounded-full" />
        <div className="shimmer-gold mb-3 h-8 w-72 max-w-full rounded-xl" />
        <div className="shimmer-gold h-2.5 w-96 max-w-[65%] rounded-full" />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5"
          >
            <div className="shimmer-gold mb-4 h-11 w-11 rounded-2xl" />
            <div className="shimmer-gold mb-2 h-9 w-24 rounded-xl" />
            <div className="shimmer-gold h-2.5 w-32 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main section */}
      <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04]">
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-5 py-4 md:px-6">
          <div className="shimmer-gold h-5 w-52 rounded-lg" />
          <div className="shimmer-gold h-8 w-28 rounded-xl" />
        </div>
        <div className="space-y-4 p-5 md:p-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="shimmer-gold h-11 w-11 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <div
                  className="shimmer-gold h-3.5 rounded-lg"
                  style={{ width: `${48 + ((i * 13) % 38)}%` }}
                />
                <div
                  className="shimmer-gold h-2.5 rounded-full"
                  style={{ width: `${28 + ((i * 9) % 28)}%` }}
                />
              </div>
              <div className="shimmer-gold h-6 w-16 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Secondary pair */}
      <div className="grid gap-5 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04]"
          >
            <div className="border-b border-white/[0.06] bg-white/[0.03] px-5 py-4 md:px-6">
              <div className="shimmer-gold h-5 w-40 rounded-lg" />
            </div>
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((j) => (
                <div key={j} className="shimmer-gold h-12 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
