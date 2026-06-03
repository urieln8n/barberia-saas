"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import {
  Home,
  CalendarDays,
  Clock,
  ClipboardList,
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
  Rocket,
  Settings,
  LogOut,
  QrCode,
  HelpCircle,
  Boxes,
  ShoppingBag,
  Receipt,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Sparkles,
  Tv,
  X,
  Gift,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── Types ─────────────────────────────────────────────────────────────────────

type BadgeType = "Pro" | "Nuevo" | "Beta";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: BadgeType;
  exact?: boolean;
};

type SidebarGroup = {
  label: string;
  items: NavItem[];
};

type MobilePrimaryItem =
  | NavItem
  | { type: "drawer"; label: string; icon: LucideIcon };

type MobileNavGroup = {
  title: string;
  items: NavItem[];
};

// ─── Navigation config ─────────────────────────────────────────────────────────

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard",           label: "Inicio",        icon: Home,        exact: true },
      { href: "/dashboard/agenda",    label: "Agenda",        icon: CalendarDays             },
      { href: "/dashboard/reservas",  label: "Reservas",      icon: ClipboardList            },
      { href: "/dashboard/clientes",  label: "Clientes",      icon: Users                    },
    ],
  },
  {
    label: "Operación",
    items: [
      { href: "/dashboard/barberos",   label: "Barberos",      icon: User                       },
      { href: "/dashboard/servicios",  label: "Servicios",     icon: Scissors                   },
      { href: "/dashboard/caja",       label: "Caja",          icon: Banknote                   },
      { href: "/dashboard/fidelizacion",label: "Fidelización", icon: Gift,        badge: "Nuevo" },
    ],
  },
  {
    label: "Crecimiento",
    items: [
      { href: "/dashboard/resenas",       label: "Reseñas",          icon: Star                   },
      { href: "/dashboard/marketing",     label: "Campañas",         icon: Megaphone              },
      { href: "/dashboard/estadisticas",  label: "Reportes",         icon: TrendingUp, badge: "Pro" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/dashboard/ajustes",   label: "Ajustes",       icon: Settings                   },
      { href: "/dashboard/soporte",   label: "Soporte",       icon: HelpCircle                 },
    ],
  },
];

// Extra items still accessible but in mobile drawer
const extraItems: NavItem[] = [
  { href: "/dashboard/huecos",        label: "Huecos libres",    icon: Clock                      },
  { href: "/dashboard/pagos",         label: "Pagos",            icon: CreditCard                 },
  { href: "/dashboard/finanzas",      label: "Finanzas",         icon: Wallet,        badge: "Pro" },
  { href: "/dashboard/inventario",    label: "Inventario",       icon: Boxes,         badge: "Pro" },
  { href: "/dashboard/recuperacion",  label: "Clientes perdidos",icon: RotateCcw                  },
  { href: "/dashboard/agents",        label: "Agentes IA",       icon: Sparkles,      badge: "Pro" },
  { href: "/dashboard/growth",        label: "Growth Engine",    icon: Rocket,        badge: "Pro" },
  { href: "/dashboard/qr",            label: "QR y reservas",    icon: QrCode                     },
  { href: "/dashboard/lounge",        label: "Sala de espera",   icon: Tv,            badge: "Pro" },
  { href: "/dashboard/automatizaciones",label:"Automatizaciones",icon: Workflow,      badge: "Pro" },
  { href: "/dashboard/marketplace",   label: "Marketplace",      icon: ShoppingBag                },
  { href: "/dashboard/fiscalidad",    label: "Fiscalidad",       icon: Receipt                    },
  { href: "/dashboard/whatsapp",      label: "WhatsApp",         icon: MessageCircle              },
];

const allItems: NavItem[] = [
  ...sidebarGroups.flatMap((g) => g.items),
  ...extraItems,
];

const primaryMobileNav: MobilePrimaryItem[] = [
  { href: "/dashboard",          label: "Inicio",   icon: Home,        exact: true },
  { href: "/dashboard/agenda",   label: "Agenda",   icon: CalendarDays             },
  { href: "/dashboard/caja",     label: "Caja",     icon: Banknote                 },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users                    },
  { type: "drawer", label: "Más", icon: MoreHorizontal },
];

const groupedMobileNav: MobileNavGroup[] = [
  {
    title: "Operación",
    items: [
      { href: "/dashboard/reservas",    label: "Reservas",      icon: ClipboardList              },
      { href: "/dashboard/huecos",      label: "Huecos libres", icon: Clock                      },
      { href: "/dashboard/barberos",    label: "Barberos",      icon: User                       },
      { href: "/dashboard/servicios",   label: "Servicios",     icon: Scissors                   },
      { href: "/dashboard/inventario",  label: "Inventario",    icon: Boxes,         badge: "Pro" },
      { href: "/dashboard/fidelizacion",label: "Fidelización",  icon: Gift,          badge: "Nuevo"},
    ],
  },
  {
    title: "Crecer",
    items: [
      { href: "/dashboard/marketing",     label: "Campañas",         icon: Megaphone              },
      { href: "/dashboard/resenas",       label: "Reseñas",          icon: Star                   },
      { href: "/dashboard/recuperacion",  label: "Clientes perdidos",icon: RotateCcw              },
      { href: "/dashboard/agents",        label: "Agentes IA",       icon: Sparkles,  badge: "Pro" },
      { href: "/dashboard/lounge",        label: "Sala de espera",   icon: Tv,        badge: "Pro" },
      { href: "/dashboard/growth",        label: "Growth Engine",    icon: Rocket,    badge: "Pro" },
    ],
  },
  {
    title: "Negocio",
    items: [
      { href: "/dashboard/pagos",         label: "Pagos",            icon: CreditCard             },
      { href: "/dashboard/finanzas",      label: "Finanzas",         icon: Wallet,    badge: "Pro" },
      { href: "/dashboard/estadisticas",  label: "Reportes",         icon: TrendingUp,badge: "Pro" },
      { href: "/dashboard/qr",            label: "QR público",       icon: QrCode                 },
      { href: "/dashboard/marketplace",   label: "Marketplace",      icon: ShoppingBag            },
      { href: "/dashboard/ajustes",       label: "Ajustes",          icon: Settings               },
      { href: "/dashboard/soporte",       label: "Soporte",          icon: HelpCircle             },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function getInitialMobileGroup(pathname: string): string {
  return (
    groupedMobileNav.find((g) => g.items.some((item) => isActive(pathname, item)))?.title ??
    groupedMobileNav[0].title
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function NavBadge({ badge }: { badge: BadgeType }) {
  const styles: Record<BadgeType, string> = {
    Pro:   "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#A07820]",
    Nuevo: "border-emerald-300/40 bg-emerald-50 text-emerald-700",
    Beta:  "border-slate-200 bg-slate-100 text-slate-500",
  };
  return (
    <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${styles[badge]}`}>
      {badge}
    </span>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

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
      className={`nav-link ${
        active
          ? "bg-[#D4AF37]/8 font-semibold text-slate-900 shadow-[inset_3px_0_0_#D4AF37]"
          : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon
        size={17}
        strokeWidth={1.75}
        className={`shrink-0 transition-colors ${active ? "text-[#D4AF37]" : "text-slate-400"}`}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && <NavBadge badge={item.badge} />}
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
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
        active
          ? "bg-[#D4AF37]/10 shadow-[inset_2px_0_0_#D4AF37]"
          : "hover:bg-slate-100"
      }`}
    >
      <Icon
        size={17}
        strokeWidth={1.75}
        className={active ? "text-[#D4AF37]" : "text-slate-400"}
      />
    </Link>
  );
}

// ─── MobileBottomNav ──────────────────────────────────────────────────────────

function MobileBottomNav({
  pathname,
  onOpenMore,
}: {
  pathname: string;
  onOpenMore: () => void;
}) {
  const moreActive = groupedMobileNav.some((g) =>
    g.items.some((item) => isActive(pathname, item))
  );

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {primaryMobileNav.map((item) => {
          const Icon = item.icon;

          if ("type" in item) {
            return (
              <button
                key={item.label}
                type="button"
                aria-label="Abrir más opciones"
                aria-current={moreActive ? "page" : undefined}
                onClick={onOpenMore}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors ${
                  moreActive
                    ? "text-[#C9922A]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={20} className={moreActive ? "text-[#D4AF37]" : "text-slate-400"} />
                <span className="max-w-full truncate">{item.label}</span>
              </button>
            );
          }

          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors ${
                active
                  ? "text-[#C9922A]"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={20} className={active ? "text-[#D4AF37]" : "text-slate-400"} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Desktop grouped nav ──────────────────────────────────────────────────────

function DesktopGroupedNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex flex-1 flex-col overflow-y-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {sidebarGroups.map((group, i) => (
        <div key={group.label} className={i > 0 ? "mt-3 border-t border-slate-100 pt-3" : ""}>
          <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
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
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen]             = useState(false);
  const [activeMobileGroup, setActiveMobileGroup] = useState<string>(() =>
    getInitialMobileGroup(pathname)
  );

  useEffect(() => {
    const match = groupedMobileNav.find((g) =>
      g.items.some((item) => isActive(pathname, item))
    );
    if (match) setActiveMobileGroup(match.title);
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

  return (
    <>
      {/* ── Mobile header ── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-xl md:hidden">
        <Link href="/dashboard" className="flex items-center gap-3">
          <BarberiaOSLogo size={36} />
          <span className="font-black tracking-tight text-slate-900">BarberíaOS</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/reservas"
            aria-label="Nueva reserva"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/8 text-[#C9922A] transition-colors hover:bg-[#D4AF37]/15"
          >
            <Plus size={16} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <MobileBottomNav pathname={pathname} onOpenMore={() => setDrawerOpen(true)} />

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
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        />
        <aside
          aria-label="Más opciones de navegación"
          className={`absolute bottom-0 left-0 right-0 flex max-h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-t-[28px] border-t border-slate-200 bg-white shadow-[0_-24px_60px_rgba(15,23,42,0.18)] transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Drawer handle */}
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-slate-200" />

          {/* Drawer header */}
          <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
            <div>
              <p className="text-lg font-black text-slate-900">Más opciones</p>
              <p className="text-sm text-slate-500">Accede a cualquier sección</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setDrawerOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Group tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {groupedMobileNav.map((group) => {
                const active = group.title === activeMobileGroup;
                return (
                  <button
                    key={group.title}
                    type="button"
                    onClick={() => setActiveMobileGroup(group.title)}
                    className={`min-h-9 rounded-lg text-xs font-black transition-all ${
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {group.title}
                  </button>
                );
              })}
            </div>

            {/* Group items */}
            <div className="grid gap-1">
              {(
                groupedMobileNav.find((g) => g.title === activeMobileGroup) ??
                groupedMobileNav[0]
              ).items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={() => setDrawerOpen(false)}
                />
              ))}
            </div>
          </nav>

          <footer className="shrink-0 border-t border-slate-100 px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4">
            <button
              type="button"
              onClick={async () => { setDrawerOpen(false); await handleLogout(); }}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={15} className="shrink-0" />
              Cerrar sesión
            </button>
          </footer>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-slate-200 bg-white shadow-[1px_0_0_0_#f1f5f9] transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-5" : "w-64 p-5"
        }`}
      >
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="absolute -right-3.5 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md"
        >
          {collapsed ? (
            <ChevronRight size={12} className="text-slate-500" />
          ) : (
            <ChevronLeft size={12} className="text-slate-500" />
          )}
        </button>

        {/* Brand */}
        {collapsed ? (
          <div className="mb-5 flex justify-center">
            <Link href="/dashboard" title="BarberíaOS — Inicio">
              <BarberiaOSLogo size={36} />
            </Link>
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <BarberiaOSLogo size={36} className="shrink-0" />
              <div className="min-w-0">
                <span className="block text-[15px] font-black leading-none tracking-tight text-slate-900">
                  BarberíaOS
                </span>
                <span className="mt-1 block truncate text-[10px] font-semibold leading-tight text-slate-400">
                  Panel de control
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Quick CTA */}
        {!collapsed && (
          <Link
            href="/dashboard/reservas"
            className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/8 px-4 py-2.5 text-sm font-black text-[#C9922A] transition-all hover:bg-[#D4AF37]/14 hover:border-[#D4AF37]/45"
          >
            <Plus size={14} />
            Nueva cita
          </Link>
        )}

        {/* Nav */}
        {collapsed ? (
          <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allItems.map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          <DesktopGroupedNav pathname={pathname} />
        )}

        {/* Footer */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link w-full font-medium text-slate-500 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={15} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
