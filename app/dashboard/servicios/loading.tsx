export default function ServiciosLoading() {
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

      {/* Service cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 0.9, 0.8, 0.7, 0.6, 0.5].map((opacity, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" style={{ opacity }}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="premium-skeleton h-4 w-32 rounded-lg" />
                <div className="premium-skeleton h-3 w-48 rounded" />
              </div>
              <div className="premium-skeleton h-7 w-14 rounded-xl" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="premium-skeleton h-6 w-16 rounded-lg" />
              <div className="premium-skeleton h-6 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
