"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Home,
  CalendarDays,
  CalendarCheck,
  Users,
  Scissors,
  User,
  CreditCard,
  Megaphone,
  Zap,
  QrCode,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Core",
    items: [
      { href: "/dashboard",                   label: "Dashboard",        icon: Home            },
      { href: "/dashboard/agenda",             label: "Agenda",           icon: CalendarDays    },
      { href: "/dashboard/reservas",           label: "Reservas",         icon: CalendarCheck   },
      { href: "/dashboard/clientes",           label: "Clientes",         icon: Users           },
      { href: "/dashboard/servicios",          label: "Servicios",        icon: Scissors        },
      { href: "/dashboard/barberos",           label: "Barberos",         icon: User            },
      { href: "/dashboard/pagos",              label: "Pagos",            icon: CreditCard      },
    ],
  },
  {
    label: "Crecimiento",
    items: [
      { href: "/dashboard/marketing",          label: "Marketing",        icon: Megaphone       },
      { href: "/dashboard/automatizaciones",   label: "Automatizaciones", icon: Zap             },
      { href: "/dashboard/qr",                 label: "QR Reservas",      icon: QrCode          },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/dashboard/ajustes",            label: "Ajustes",          icon: Settings        },
    ],
  },
];

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-neutral-950 text-white"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
      }`}
    >
      <Icon size={16} className="shrink-0" />
      {item.label}
    </Link>
  );
}

function NavGroup({ group, pathname, onLinkClick }: { group: NavGroup; pathname: string; onLinkClick?: () => void }) {
  return (
    <div>
      <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {group.label}
      </p>
      <div className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onClick={onLinkClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* ── Mobile header ── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Scissors size={18} className="text-red-700" />
          <span className="text-lg font-black tracking-tight text-neutral-950">BarberíaOS</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Menú
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <Scissors size={16} className="text-red-700" />
                <span className="text-lg font-black tracking-tight text-neutral-950">BarberíaOS</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
              {navGroups.map((group) => (
                <NavGroup
                  key={group.label}
                  group={group}
                  pathname={pathname}
                  onLinkClick={() => setOpen(false)}
                />
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
            >
              <LogOut size={16} className="shrink-0" />
              Cerrar sesión
            </button>
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-neutral-200 bg-white p-5 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950">
            <Scissors size={15} className="text-red-700" />
          </div>
          <span className="text-lg font-black tracking-tight text-neutral-950">BarberíaOS</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
          {navGroups.map((group) => (
            <NavGroup key={group.label} group={group} pathname={pathname} />
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
        >
          <LogOut size={16} className="shrink-0" />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}
