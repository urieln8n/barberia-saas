"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, TrendingUp, PieChart, CheckSquare, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin",               label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/leads",         label: "Leads",       icon: Users           },
  { href: "/admin/deals",         label: "Pipeline",    icon: TrendingUp      },
  { href: "/admin/tareas",        label: "Tareas",      icon: CheckSquare     },
  { href: "/admin/suscripciones", label: "MRR",         icon: PieChart        },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[#E5E2D9] bg-[#0D0D0D]">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="h-2 w-2 rounded-full bg-[#C89B3C]" />
        <span className="text-sm font-black uppercase tracking-[0.2em] text-white">
          Admin
        </span>
        <span className="ml-auto rounded-full bg-[#C89B3C]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#C89B3C]">
          Founder
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#C89B3C]/20 text-[#C89B3C]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} />
          Volver al dashboard
        </Link>
      </div>
    </aside>
  );
}
