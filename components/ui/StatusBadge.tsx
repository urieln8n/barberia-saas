type Status =
  | "pending"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "active"
  | "inactive";

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
};

const classes: Record<Status, string> = {
  pending: "border-amber-100 bg-amber-50 text-amber-700",
  scheduled: "border-amber-100 bg-amber-50 text-amber-700",
  confirmed: "border-blue-100 bg-blue-50 text-blue-700",
  completed: "border-emerald-100 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-100 bg-red-50 text-red-700",
  no_show: "border-red-100 bg-red-50 text-red-700",
  active: "border-emerald-100 bg-emerald-50 text-emerald-700",
  inactive: "border-neutral-200 bg-neutral-100 text-neutral-600",
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
    <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone} ${className}`}>
      {children ?? getStatusLabel(status)}
    </span>
  );
}
