export function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      <p className="mt-2 text-sm text-neutral-500">{hint}</p>
    </div>
  );
}
