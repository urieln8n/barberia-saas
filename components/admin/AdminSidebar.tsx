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
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-[#0F172A] shadow-sm">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="h-8 w-8 rounded-xl border border-white/15 bg-[#2F6FEB]" />
        <div className="min-w-0">
          <span className="block text-sm font-black uppercase tracking-[0.2em] text-white">
            Admin
          </span>
          <span className="block text-[11px] font-medium text-slate-400">Founder CRM</span>
        </div>
        <span className="ml-auto rounded-full bg-[#2F6FEB]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-200">
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
                  ? "border border-white/10 bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} className={active ? "text-blue-200" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} />
          Volver al dashboard
        </Link>
      </div>
    </aside>
  );
}
