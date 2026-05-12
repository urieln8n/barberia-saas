"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import {
  Home,
  CalendarDays,
  Users,
  Scissors,
  User,
  CreditCard,
  Banknote,
  TrendingUp,
  Wallet,
  Star,
  RotateCcw,
  Workflow,
  Settings,
  ShieldCheck,
  LogOut,
  QrCode,
  HelpCircle,
  Boxes,
  ShoppingBag,
  Receipt,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

// ─── Navigation config ────────────────────────────────────────────────────────

const navGroups: NavGroup[] = [
  {
    id: "dia-a-dia",
    label: "Día a día",
    items: [
      { href: "/dashboard", label: "Hoy", icon: Home, exact: true },
      { href: "/dashboard/agenda", label: "Reservas", icon: CalendarDays },
      { href: "/dashboard/caja", label: "Caja", icon: Banknote },
      { href: "/dashboard/clientes", label: "Clientes", icon: Users },
    ],
  },
  {
    id: "crecimiento",
    label: "Crecimiento",
    items: [
      { href: "/dashboard/qr", label: "QR de reservas", icon: QrCode },
      { href: "/dashboard/huecos", label: "Huecos libres", icon: TrendingUp },
      { href: "/dashboard/resenas", label: "Reseñas", icon: Star },
      { href: "/dashboard/recuperacion", label: "Recuperar clientes", icon: RotateCcw },
      { href: "/dashboard/marketing", label: "Marketing", icon: Megaphone },
      { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: Workflow, badge: "Pro" },
    ],
  },
  {
    id: "gestion",
    label: "Gestión",
    items: [
      { href: "/dashboard/barberos", label: "Barberos", icon: User },
      { href: "/dashboard/servicios", label: "Servicios", icon: Scissors },
      { href: "/dashboard/inventario", label: "Inventario", icon: Boxes },
      { href: "/dashboard/finanzas", label: "Ventas", icon: Wallet },
      { href: "/dashboard/pagos", label: "Pagos", icon: CreditCard },
      { href: "/dashboard/fiscalidad", label: "Fiscalidad", icon: Receipt },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    items: [
      { href: "/dashboard/ajustes", label: "Configuración", icon: Settings },
      { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
      { href: "/dashboard/security-audit", label: "Auditoría web", icon: ShieldCheck, badge: "Beta" },
      { href: "/dashboard/whatsapp", label: "Soporte", icon: HelpCircle, badge: "Guía" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// ─── NavLink (expanded) ───────────────────────────────────────────────────────

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`nav-link transition-all duration-150 ${
        active
          ? "bg-[#C9922A]/10 font-semibold text-[#080A0F] shadow-[inset_3px_0_0_#C9922A]"
          : "font-medium text-neutral-500 hover:bg-[#C9922A]/5 hover:text-neutral-900"
      }`}
    >
      <Icon
        size={16}
        className={`shrink-0 transition-colors ${active ? "text-[#C9922A]" : "text-neutral-400"}`}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="shrink-0 rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#8A641F]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── IconNavLink (collapsed) ──────────────────────────────────────────────────

function IconNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      title={item.label}
      className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150 ${
        active
          ? "bg-[#C9922A]/10 shadow-[inset_3px_0_0_#C9922A]"
          : "hover:bg-[#C9922A]/5"
      }`}
    >
      <Icon
        size={18}
        className={`transition-colors ${active ? "text-[#C9922A]" : "text-neutral-400"}`}
      />
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname            = usePathname();
  const router              = useRouter();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  // ── Mobile header ────────────────────────────────────────────────────────────
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E7E2D8] bg-white/90 px-4 shadow-sm backdrop-blur md:hidden">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C89B3C]/25 bg-[#080A0F]">
            <Scissors size={14} className="text-[#C9922A]" />
          </div>
          <span className="font-black tracking-tight text-[#080A0F]">BarberíaOS</span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="btn-outline min-h-0 px-3 py-2"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9922A]" />
            Menu
          </span>
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 md:hidden ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-72 flex-col border-r border-[#E7E2D8] bg-white p-5 shadow-2xl transition-transform duration-200 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile drawer header */}
          <div className="mb-5 flex items-center justify-between">
            <Link href="/dashboard" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#C89B3C]/25 bg-[#080A0F]">
                <Scissors size={15} className="text-[#C9922A]" />
              </div>
              <div>
                <p className="text-[15px] font-black leading-none text-neutral-950">BarberíaOS</p>
                <p className="mt-0.5 text-[10px] font-medium text-neutral-400">Operación diaria de barbería.</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="btn-outline min-h-0 px-3 py-1.5 text-xs"
            >
              Cerrar
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto pb-2">
            {navGroups.map((group) => (
              <div key={group.id}>
                <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      onClick={() => setDrawerOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile footer */}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="nav-link border border-[#E7E2D8] bg-white font-medium text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
            >
              <ShieldCheck size={16} className="shrink-0" />
              Volver a la landing
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link w-full border border-[#E7E2D8] bg-white font-medium text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
            >
              <LogOut size={16} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-[#E7E2D8] bg-white/95 shadow-[0_18px_50px_rgba(17,17,17,0.05)] backdrop-blur transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-4" : "w-64 p-5"
        }`}
      >
        {/* Toggle collapse button */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="absolute -right-3.5 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#E7E2D8] bg-white shadow-md transition-colors hover:border-[#C9922A]/40 hover:bg-[#C9922A]/5"
        >
          {collapsed ? (
            <ChevronRight size={13} className="text-neutral-400" />
          ) : (
            <ChevronLeft size={13} className="text-neutral-400" />
          )}
        </button>

        {/* Brand */}
        {collapsed ? (
          <div className="mb-3 flex justify-center">
            <Link href="/dashboard" title="BarberíaOS — Inicio">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C89B3C]/25 bg-[#080A0F] shadow-sm">
                <Scissors size={15} className="text-[#C9922A]" />
              </div>
            </Link>
          </div>
        ) : (
          <div className="mb-5 rounded-[20px] border border-[#E7E2D8] bg-[#F8F5EF] px-3 py-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#C89B3C]/25 bg-[#080A0F] shadow-sm">
                <Scissors size={15} className="text-[#C9922A]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[15px] font-black leading-none text-neutral-950">BarberíaOS</span>
                <span className="mt-1 block truncate text-[10px] font-medium leading-tight text-neutral-400">
                  Operación diaria de barbería.
                </span>
              </div>
            </Link>
          </div>
        )}

        {collapsed ? (
          // Collapsed: icon-only, all items
          <nav className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto py-1">
            {navGroups.flatMap((group) => group.items).map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          // Expanded: grouped navigation
          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto pb-2">
            {navGroups.map((group) => (
              <div key={group.id}>
                <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        )}

        {/* Footer */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-0.5 border-t border-[#E7E2D8] pt-3">
            <Link
              href="/"
              title="Volver a la landing"
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-neutral-400 transition-colors hover:bg-[#C9922A]/5 hover:text-neutral-700"
            >
              <ShieldCheck size={17} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-neutral-400 transition-colors hover:bg-[#C9922A]/5 hover:text-neutral-700"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2 border-t border-[#E7E2D8] pt-4">
            <Link
              href="/"
              className="nav-link border border-[#E7E2D8] bg-white font-medium text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
            >
              <ShieldCheck size={16} className="shrink-0" />
              Volver a la landing
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link w-full border border-[#E7E2D8] bg-white font-medium text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
            >
              <LogOut size={16} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
