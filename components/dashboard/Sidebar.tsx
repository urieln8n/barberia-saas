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
  Wallet,
  Calculator,
  Megaphone,
  Zap,
  QrCode,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

type NavItem  = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Core",
    items: [
      { href: "/dashboard",                  label: "Dashboard",        icon: Home          },
      { href: "/dashboard/agenda",           label: "Agenda",           icon: CalendarDays  },
      { href: "/dashboard/reservas",         label: "Reservas",         icon: CalendarCheck },
      { href: "/dashboard/clientes",         label: "Clientes",         icon: Users         },
      { href: "/dashboard/servicios",        label: "Servicios",        icon: Scissors      },
      { href: "/dashboard/barberos",         label: "Barberos",         icon: User          },
      { href: "/dashboard/pagos",            label: "Pagos",            icon: CreditCard    },
      { href: "/dashboard/finanzas",         label: "Finanzas",         icon: Wallet        },
      { href: "/dashboard/fiscalidad",       label: "Fiscalidad",       icon: Calculator    },
    ],
  },
  {
    label: "Crecimiento",
    items: [
      { href: "/dashboard/marketing",        label: "Marketing",        icon: Megaphone     },
      { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: Zap           },
      { href: "/dashboard/qr",               label: "QR Reservas",      icon: QrCode        },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/dashboard/ajustes",          label: "Ajustes",          icon: Settings      },
    ],
  },
];

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-150 ${
        active
          ? "bg-[#0D0D0D] font-semibold text-white"
          : "font-medium text-neutral-500 hover:bg-[#F5F2EA] hover:text-[#0D0D0D]"
      }`}
    >
      <Icon
        size={16}
        className={`shrink-0 transition-colors ${active ? "text-[#C89B3C]" : ""}`}
      />
      {item.label}
    </Link>
  );
}

function NavGroupSection({
  group,
  pathname,
  onLinkClick,
}: {
  group: NavGroup;
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-[0.15em] text-neutral-400">
        {group.label}
      </p>
      {group.items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={pathname === item.href}
          onClick={onLinkClick}
        />
      ))}
    </div>
  );
}

function BrandLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/dashboard" onClick={onClick} className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D0D0D]">
        <Scissors size={15} className="text-[#C89B3C]" />
      </div>
      <span className="text-lg font-black tracking-tight text-[#0D0D0D]">BarberíaOS</span>
    </Link>
  );
}

function LogoutBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#E5E2D9] px-3 py-2.5 text-sm font-medium text-neutral-500 transition-all duration-150 hover:bg-[#F5F2EA] hover:text-[#0D0D0D]"
    >
      <LogOut size={16} className="shrink-0" />
      Cerrar sesión
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
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
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E5E2D9] bg-white px-4 md:hidden">
        <BrandLogo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-[#E5E2D9] px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F5F2EA]"
        >
          Menú
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40"
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-5 shadow-2xl transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <BrandLogo onClick={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-[#E5E2D9] px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-[#F5F2EA]"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
            {navGroups.map((group) => (
              <NavGroupSection
                key={group.label}
                group={group}
                pathname={pathname}
                onLinkClick={() => setOpen(false)}
              />
            ))}
          </nav>

          <div className="mt-4">
            <LogoutBtn onClick={handleLogout} />
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#E5E2D9] bg-white p-5 md:flex">
        <div className="mb-8">
          <BrandLogo />
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
          {navGroups.map((group) => (
            <NavGroupSection key={group.label} group={group} pathname={pathname} />
          ))}
        </nav>

        <div className="mt-4">
          <LogoutBtn onClick={handleLogout} />
        </div>
      </aside>
    </>
  );
}
