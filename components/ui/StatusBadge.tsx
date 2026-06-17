type Status =
  | "pending"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "active"
  | "inactive"
  | "paid"
  | "trial"
  | "overdue";

type StatusBadgeProps = {
  status?: Status | string | null;
  children?: React.ReactNode;
  className?: string;
};

const labels: Record<Status, string> = {
  pending: "Pendiente",
  scheduled: "Programada",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No apareció",
  active: "Activo",
  inactive: "Inactivo",
  paid: "Pagado",
  trial: "Prueba",
  overdue: "Pendiente de pago",
};

const classes: Record<Status, string> = {
  pending: "border-amber-100 bg-amber-50 text-amber-700",
  scheduled: "border-amber-100 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400",
  completed: "border-emerald-100 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-100 bg-red-50 text-red-700",
  no_show: "border-red-100 bg-red-50 text-red-700",
  active: "border-emerald-100 bg-emerald-50 text-emerald-700",
  inactive: "border-neutral-200 bg-neutral-100 text-neutral-600",
  paid: "border-emerald-100 bg-emerald-50 text-emerald-700",
  trial: "border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] text-[#D4AF37]",
  overdue: "border-red-100 bg-red-50 text-red-700",
};

export function getStatusLabel(status?: string | null) {
  if (!status) return "Sin estado";
  return labels[status as Status] ?? status;
}

export function StatusBadge({
  status,
  children,
  className = "",
}: StatusBadgeProps) {
  const tone =
    status && status in classes
      ? classes[status as Status]
      : "border-neutral-200 bg-neutral-100 text-neutral-600";

  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-bold ${tone} ${className}`}>
      {children ?? getStatusLabel(status)}
    </span>
  );
}
