"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import {
  BarChart3,
  Banknote,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  CreditCard,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  Megaphone,
  MoreHorizontal,
  Plus,
  QrCode,
  Rocket,
  Scissors,
  Settings,
  Sparkles,
  Star,
  Tv,
  Users,
  UserX,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── Types ─────────────────────────────────────────────────────────────────────

type BadgeType = "Pro" | "Nuevo" | "Beta";
type SectionColor = "blue" | "emerald" | "violet" | "gold" | "pink" | "slate";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: BadgeType;
  exact?: boolean;
  color?: SectionColor;
};

type SidebarGroup = {
  label: string;
  color: SectionColor;
  items: NavItem[];
};

// ─── Color system per section ─────────────────────────────────────────────────

const SECTION_COLORS: Record<SectionColor, {
  icon: string;
  iconActive: string;
  iconBg: string;
  activeBg: string;
  activeBorder: string;
  groupLabel: string;
}> = {
  blue: {
    icon:         "text-blue-400",
    iconActive:   "text-blue-600",
    iconBg:       "bg-blue-50",
    activeBg:     "bg-blue-50/70",
    activeBorder: "shadow-[inset_3px_0_0_#3B82F6]",
    groupLabel:   "text-blue-400/80",
  },
  emerald: {
    icon:         "text-emerald-400",
    iconActive:   "text-emerald-600",
    iconBg:       "bg-emerald-50",
    activeBg:     "bg-emerald-50/70",
    activeBorder: "shadow-[inset_3px_0_0_#10B981]",
    groupLabel:   "text-emerald-400/80",
  },
  violet: {
    icon:         "text-violet-400",
    iconActive:   "text-violet-600",
    iconBg:       "bg-violet-50",
    activeBg:     "bg-violet-50/70",
    activeBorder: "shadow-[inset_3px_0_0_#7C3AED]",
    groupLabel:   "text-violet-400/80",
  },
  gold: {
    icon:         "text-[#C9922A]/70",
    iconActive:   "text-[#C9922A]",
    iconBg:       "bg-[#D4AF37]/10",
    activeBg:     "bg-[#D4AF37]/8",
    activeBorder: "shadow-[inset_3px_0_0_#D4AF37]",
    groupLabel:   "text-[#C9922A]/70",
  },
  pink: {
    icon:         "text-pink-400",
    iconActive:   "text-pink-600",
    iconBg:       "bg-pink-50",
    activeBg:     "bg-pink-50/70",
    activeBorder: "shadow-[inset_3px_0_0_#EC4899]",
    groupLabel:   "text-pink-400/80",
  },
  slate: {
    icon:         "text-slate-400",
    iconActive:   "text-slate-600",
    iconBg:       "bg-slate-100",
    activeBg:     "bg-slate-100/70",
    activeBorder: "shadow-[inset_3px_0_0_#64748B]",
    groupLabel:   "text-slate-400/80",
  },
};

// ─── Navigation config ─────────────────────────────────────────────────────────

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Operación diaria",
    color: "blue",
    items: [
      { href: "/dashboard",          label: "Dashboard",       icon: Home,         exact: true },
      { href: "/dashboard/agenda",   label: "Agenda",          icon: CalendarDays              },
      { href: "/dashboard/reservas", label: "Reservas",        icon: CalendarCheck             },
      { href: "/dashboard/lounge",   label: "Sala de espera",  icon: Tv                        },
    ],
  },
  {
    label: "Clientes",
    color: "emerald",
    items: [
      { href: "/dashboard/clientes",      label: "Clientes",         icon: Users                      },
      { href: "/dashboard/recuperacion",  label: "Clientes perdidos",icon: UserX                      },
      { href: "/dashboard/fidelizacion",  label: "Fidelización",     icon: Gift,      badge: "Nuevo"  },
      { href: "/dashboard/resenas",       label: "Reseñas",          icon: Star                       },
    ],
  },
  {
    label: "Equipo y servicios",
    color: "violet",
    items: [
      { href: "/dashboard/barberos",   label: "Barberos",   icon: Scissors              },
      { href: "/dashboard/servicios",  label: "Servicios",  icon: Briefcase             },
      { href: "/dashboard/inventario", label: "Inventario", icon: Wallet, badge: "Pro"  },
    ],
  },
  {
    label: "Ventas y control",
    color: "gold",
    items: [
      { href: "/dashboard/caja",         label: "Caja",      icon: Banknote              },
      { href: "/dashboard/pagos",        label: "Pagos",     icon: CreditCard            },
      { href: "/dashboard/estadisticas", label: "Reportes",  icon: BarChart3, badge: "Pro" },
    ],
  },
  {
    label: "Studio IA",
    color: "violet",
    items: [
      { href: "/dashboard/studio",   label: "Studio IA",     icon: Clapperboard, badge: "Nuevo" },
      { href: "/dashboard/marketing",label: "Campañas",      icon: Megaphone                    },
      { href: "/dashboard/growth",   label: "Growth Engine", icon: Rocket,       badge: "Pro"   },
    ],
  },
  {
    label: "Crecimiento",
    color: "pink",
    items: [
      { href: "/dashboard/qr",      label: "QR y reservas", icon: QrCode                },
      { href: "/dashboard/agents",  label: "Agentes IA",    icon: Sparkles, badge: "Pro"},
    ],
  },
  {
    label: "Configuración",
    color: "slate",
    items: [
      { href: "/dashboard/ajustes", label: "Ajustes",   icon: Settings   },
      { href: "/dashboard/soporte", label: "Soporte",   icon: HelpCircle },
    ],
  },
];

const allSidebarItems: NavItem[] = sidebarGroups.flatMap((g) =>
  g.items.map((item) => ({ ...item, color: g.color }))
);

// Mobile bottom nav — los 4 más usados + drawer
const primaryMobileNav = [
  { href: "/dashboard",          label: "Inicio",   icon: Home,         exact: true  },
  { href: "/dashboard/agenda",   label: "Agenda",   icon: CalendarDays               },
  { href: "/dashboard/caja",     label: "Caja",     icon: Banknote                   },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users                      },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: { href: string; exact?: boolean }): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
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
  sectionColor,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
  sectionColor?: SectionColor;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item);
  const color = sectionColor ?? item.color ?? "slate";
  const c = SECTION_COLORS[color];

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`nav-link transition-all duration-150 ${
        active
          ? `bg-white font-semibold text-slate-900 ${c.activeBorder} shadow-[0_1px_3px_rgba(15,23,42,0.06)]`
          : "font-medium text-slate-600 hover:bg-white/70 hover:text-slate-900"
      }`}
    >
      <span className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg transition-colors ${
        active ? `${c.iconBg} ${c.iconActive}` : `${c.icon}`
      }`}>
        <Icon size={15} strokeWidth={active ? 2 : 1.75} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px]">{item.label}</span>
      {item.badge && <NavBadge badge={item.badge} />}
    </Link>
  );
}

// ─── IconNavLink (collapsed) ──────────────────────────────────────────────────

function IconNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isActive(pathname, item);
  const color = item.color ?? "slate";
  const c = SECTION_COLORS[color];

  return (
    <Link
      href={item.href}
      title={item.label}
      className={`group flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
        active
          ? `${c.iconBg} ${c.activeBorder} shadow-sm`
          : "hover:bg-slate-100"
      }`}
    >
      <Icon
        size={16}
        strokeWidth={active ? 2 : 1.75}
        className={active ? c.iconActive : c.icon}
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
  const moreActive = sidebarGroups
    .flatMap((g) => g.items)
    .some((item) => !primaryMobileNav.some((p) => p.href === item.href) && isActive(pathname, item));

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/97 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {primaryMobileNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors ${
                active ? "text-[#C9922A]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.75} className={active ? "text-[#D4AF37]" : "text-slate-400"} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="Abrir más opciones"
          onClick={onOpenMore}
          className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors ${
            moreActive ? "text-[#C9922A]" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <MoreHorizontal size={20} strokeWidth={moreActive ? 2 : 1.75} className={moreActive ? "text-[#D4AF37]" : "text-slate-400"} />
          <span>Más</span>
        </button>
      </div>
    </nav>
  );
}

// ─── Desktop grouped nav ──────────────────────────────────────────────────────

function DesktopGroupedNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="flex flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ paddingBottom: "0.5rem" }}
    >
      {sidebarGroups.map((group, i) => {
        const c = SECTION_COLORS[group.color];
        return (
          <div
            key={group.label}
            className={i > 0 ? "mt-1 border-t border-slate-100 pt-2" : ""}
          >
            <p className={`mb-1 px-3 text-[9px] font-black uppercase tracking-[0.14em] ${c.groupLabel}`}>
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  sectionColor={group.color}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Mobile header ── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/97 px-4 shadow-sm backdrop-blur-xl md:hidden">
        <Link href="/dashboard" className="flex items-center gap-3">
          <BarberiaOSLogo variant="full" size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/reservas"
            aria-label="Nueva reserva"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/8 text-[#C9922A] transition hover:bg-[#D4AF37]/15"
          >
            <Plus size={15} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={15} />
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
          aria-label="Menú completo"
          className={`absolute bottom-0 left-0 right-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-[24px] border-t border-slate-200 bg-white shadow-[0_-24px_60px_rgba(15,23,42,0.16)] transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Handle */}
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-slate-200" />

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
            <p className="text-base font-black text-slate-900">Navegación</p>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300"
            >
              <X size={15} />
            </button>
          </div>

          {/* All groups scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sidebarGroups.map((group, i) => {
              const c = SECTION_COLORS[group.color];
              return (
                <div key={group.label} className={i > 0 ? "mt-3 border-t border-slate-100 pt-3" : "pt-1"}>
                  <p className={`mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.14em] ${c.groupLabel}`}>
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        sectionColor={group.color}
                        onClick={() => setDrawerOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer logout */}
          <div className="shrink-0 border-t border-slate-100 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={async () => { setDrawerOpen(false); await handleLogout(); }}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={14} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-[60px] px-2 py-4" : "w-[220px] px-3 py-4"
        }`}
        style={{ boxShadow: "1px 0 0 0 #f1f5f9" }}
      >
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir" : "Colapsar"}
          className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          {collapsed
            ? <ChevronRight size={11} className="text-slate-400" />
            : <ChevronLeft  size={11} className="text-slate-400" />}
        </button>

        {/* Brand */}
        {collapsed ? (
          <div className="mb-4 flex justify-center">
            <Link href="/dashboard" title="BarberíaOS">
              <BarberiaOSLogo variant="sidebar" size={32} />
            </Link>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl border border-[#E8DDBF] bg-[#FFFEFB] px-2.5 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
            <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="Ir al dashboard de BarberíaOS">
              <BarberiaOSLogo variant="sidebar" size={30} className="shrink-0" />
              <div className="min-w-0">
                <span className="block text-[13px] font-black leading-none tracking-tight text-slate-900">
                  Barbería<span className="text-[#C9A227]">OS</span>
                </span>
                <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                  Panel de control
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Nueva cita CTA */}
        {!collapsed && (
          <Link
            href="/dashboard/reservas"
            className="mb-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/28 bg-[#D4AF37]/8 px-3 py-2 text-[12px] font-black text-[#C9922A] transition hover:bg-[#D4AF37]/14"
          >
            <Plus size={13} />
            Nueva cita
          </Link>
        )}

        {/* Nav */}
        {collapsed ? (
          <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allSidebarItems.map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          <DesktopGroupedNav pathname={pathname} />
        )}

        {/* Footer logout */}
        {collapsed ? (
          <div className="flex flex-col items-center border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="mt-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link w-full text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={14} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
