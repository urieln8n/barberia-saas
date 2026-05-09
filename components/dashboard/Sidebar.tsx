"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Home,
  CalendarDays,
  Users,
  Scissors,
  User,
  CreditCard,
  Banknote,
  Wallet,
  Calculator,
  QrCode,
  MessageCircle,
  Star,
  RotateCcw,
  Workflow,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

type NavItem  = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Operación",
    items: [
      { href: "/dashboard",                  label: "Dashboard",        icon: Home          },
      { href: "/dashboard/agenda",           label: "Agenda",           icon: CalendarDays  },
      { href: "/dashboard/clientes",         label: "Clientes",         icon: Users         },
      { href: "/dashboard/servicios",        label: "Servicios",        icon: Scissors      },
      { href: "/dashboard/barberos",         label: "Barberos",         icon: User          },
    ],
  },
  {
    label: "Negocio",
    items: [
      { href: "/dashboard/pagos",            label: "Pagos",            icon: CreditCard    },
      { href: "/dashboard/caja",             label: "Caja",             icon: Banknote      },
      { href: "/dashboard/finanzas",         label: "Finanzas",         icon: Wallet        },
      { href: "/dashboard/fiscalidad",       label: "Fiscalidad",       icon: Calculator    },
    ],
  },
  {
    label: "Crecimiento",
    items: [
      { href: "/dashboard/automatizaciones", label: "Automatizaciones",  icon: Workflow      },
      { href: "/dashboard/qr",               label: "QR Reservas",      icon: QrCode        },
      { href: "/dashboard/whatsapp",         label: "Asistente WhatsApp", icon: MessageCircle },
      { href: "/dashboard/resenas",          label: "Reseñas",           icon: Star          },
      { href: "/dashboard/recuperacion",     label: "Recuperación",      icon: RotateCcw     },
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
      className={`nav-link ${
        active
          ? "border border-[#C89B3C]/25 bg-[#F8F5EF] font-bold text-[#111111] shadow-sm"
          : "font-semibold text-neutral-600 hover:bg-[#F8F5EF] hover:text-neutral-950"
      }`}
    >
      <Icon
        size={16}
        className={`shrink-0 transition-colors ${active ? "text-[#8A641F]" : "text-neutral-400"}`}
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
      <p className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
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
    <Link href="/dashboard" onClick={onClick} className="flex items-center gap-3 rounded-2xl">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C89B3C]/25 bg-[#111111] shadow-sm">
        <Scissors size={15} className="text-white" />
      </div>
      <div className="min-w-0">
        <span className="block text-lg font-black leading-none text-neutral-950">BarberiaOS</span>
        <span className="mt-1 block text-[11px] font-medium text-neutral-500">Gestión premium</span>
      </div>
    </Link>
  );
}

function LogoutBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="nav-link w-full border border-[#E7E2D8] bg-white font-semibold text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
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
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E7E2D8] bg-white/90 px-4 shadow-sm backdrop-blur md:hidden">
        <BrandLogo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-outline min-h-0 px-3 py-2"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
            Menu
          </span>
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
          className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-72 flex-col border-r border-[#E7E2D8] bg-white p-5 shadow-2xl transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <BrandLogo onClick={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline min-h-0 px-3 py-1.5"
            >
              Cerrar
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
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#E7E2D8] bg-white/90 p-5 shadow-[0_18px_50px_rgba(17,17,17,0.05)] backdrop-blur md:flex">
        <div className="mb-8 rounded-[22px] border border-[#E7E2D8] bg-[#F8F5EF] p-3">
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
