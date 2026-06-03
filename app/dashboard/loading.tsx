import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[72vh] flex-col items-center justify-center gap-10 px-4">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <BarberiaOSLogo variant="icon" size={56} />
          <span className="absolute inset-0 animate-ping rounded-[22px] border border-[#C9922A]/30 motion-reduce:animate-none" />
        </div>
        <div className="text-center">
          <p className="text-base font-black tracking-tight text-slate-900">BarberíaOS</p>
          <p className="mt-1 text-sm text-slate-500">Preparando tu centro de control...</p>
        </div>
      </div>

      {/* Skeleton */}
      <div className="w-full max-w-4xl space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3">
          <div className="premium-skeleton h-8 w-8 rounded-xl" />
          <div className="premium-skeleton h-6 w-52 rounded-xl" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[0.95, 0.8, 0.65].map((opacity, i) => (
            <div
              key={i}
              className="premium-skeleton h-24 rounded-[20px]"
              style={{ opacity }}
            />
          ))}
        </div>

        {/* Gold progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-[shimmer_1.8s_ease-in-out_infinite] rounded-full bg-[#C9922A]/40 motion-reduce:animate-none" />
        </div>

        {/* Main content skeleton */}
        <div className="premium-skeleton h-44 rounded-[20px]" style={{ opacity: 0.7 }} />
      </div>
    </div>
  );
}
