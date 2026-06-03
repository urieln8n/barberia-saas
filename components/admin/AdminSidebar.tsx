"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, TrendingUp, PieChart, CheckSquare, LogOut, Store, ShieldCheck } from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

const navItems = [
  { href: "/admin",                label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/leads",          label: "Leads",       icon: Users           },
  { href: "/admin/deals",          label: "Pipeline",    icon: TrendingUp      },
  { href: "/admin/tareas",         label: "Tareas",      icon: CheckSquare     },
  { href: "/admin/suscripciones",  label: "MRR",         icon: PieChart        },
  { href: "/admin/marketplace",    label: "Marketplace", icon: Store           },
  { href: "/admin/shield",         label: "Shield",      icon: ShieldCheck     },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-black/5 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl print:hidden">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-black/5 px-5">
        <BarberiaOSLogo variant="sidebar" size={36} />
        <div className="min-w-0">
          <span className="block text-sm font-black uppercase tracking-[0.2em] text-[#050A14]">
            Admin
          </span>
          <span className="block text-xs font-bold text-slate-600">Founder CRM</span>
        </div>
        <span className="ml-auto rounded-full border border-[#D4AF66]/25 bg-[#D4AF66]/12 px-2 py-0.5 text-xs font-black uppercase tracking-wide text-[#8A641F]">
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
            className={`flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "border border-[#D4AF66]/30 bg-[#D4AF66]/15 text-[#050A14] shadow-sm"
                  : "text-slate-600 hover:bg-[#F8F5EF] hover:text-[#050A14]"
              }`}
            >
              <Icon size={17} className={active ? "text-[#8A641F]" : "text-slate-500"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-black/5 px-3 py-3">
        <Link
          href="/dashboard"
          className="flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-[#F8F5EF] hover:text-[#050A14]"
        >
          <LogOut size={16} />
          Volver al dashboard
        </Link>
      </div>
    </aside>
  );
}
