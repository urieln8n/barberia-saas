import Link from "next/link";
import { CalendarDays, Users, Scissors, CreditCard, LayoutDashboard, UserRound } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/servicios", label: "Servicios", icon: Scissors },
  { href: "/dashboard/barberos", label: "Barberos", icon: UserRound },
  { href: "/dashboard/pagos", label: "Pagos", icon: CreditCard }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-neutral-200 bg-white p-6 lg:block">
      <Link href="/dashboard" className="text-2xl font-black">BarberíaOS</Link>
      <nav className="mt-10 space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
