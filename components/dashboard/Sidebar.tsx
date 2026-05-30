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
  MoreHorizontal,
  Plus,
  Sparkles,
  Tv,
  X,
  Gift,
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
    label: "Operación diaria",
    items: [
      { href: "/dashboard",           label: "Inicio",          icon: Home,          exact: true },
      { href: "/dashboard/agenda",    label: "Agenda",          icon: CalendarDays               },
      { href: "/dashboard/reservas",  label: "Reservas",        icon: ClipboardList              },
      { href: "/dashboard/huecos",    label: "Huecos libres",   icon: Clock                      },
      { href: "/dashboard/caja",      label: "Caja del día",    icon: Banknote                   },
      { href: "/dashboard/clientes",  label: "Clientes",        icon: Users                      },
    ],
  },
  {
    label: "Tu equipo",
    items: [
      { href: "/dashboard/barberos",  label: "Barberos",        icon: User                       },
      { href: "/dashboard/servicios", label: "Servicios",       icon: Scissors                   },
      { href: "/dashboard/inventario",label: "Inventario",      icon: Boxes,         badge: "Pro" },
    ],
  },
  {
    label: "Ingresos",
    items: [
      { href: "/dashboard/pagos",        label: "Pagos",        icon: CreditCard                 },
      { href: "/dashboard/finanzas",     label: "Finanzas",     icon: Wallet,        badge: "Pro" },
      { href: "/dashboard/estadisticas", label: "Estadísticas", icon: TrendingUp,    badge: "Pro" },
      { href: "/dashboard/fiscalidad",   label: "Fiscalidad",   icon: Receipt                    },
    ],
  },
  {
    label: "Crecer y fidelizar",
    items: [
      { href: "/dashboard/marketing",      label: "Marketing Studio",  icon: Megaphone              },
      { href: "/dashboard/fidelizacion",   label: "Fidelización",      icon: Gift,      badge: "Nuevo" },
      { href: "/dashboard/resenas",        label: "Reseñas",           icon: Star                   },
      { href: "/dashboard/recuperacion",   label: "Clientes perdidos", icon: RotateCcw              },
      { href: "/dashboard/agents",         label: "Agentes IA",        icon: Sparkles,  badge: "Pro" },
      { href: "/dashboard/growth",         label: "Growth Engine",     icon: Rocket,    badge: "Pro" },
    ],
  },
  {
    label: "Presencia online",
    items: [
      { href: "/dashboard/qr",               label: "QR y reservas",     icon: QrCode                 },
      { href: "/dashboard/lounge",            label: "Sala de espera",    icon: Tv,        badge: "Pro" },
      { href: "/dashboard/automatizaciones",  label: "Automatizaciones",  icon: Workflow,  badge: "Pro" },
      { href: "/dashboard/marketplace",       label: "Marketplace",       icon: ShoppingBag            },
    ],
  },
  {
    label: "Configuración",
    items: [
      { href: "/dashboard/ajustes",   label: "Mi barbería",  icon: Settings                       },
      { href: "/dashboard/whatsapp",  label: "Soporte",      icon: HelpCircle                     },
    ],
  },
];

const allItems: NavItem[] = sidebarGroups.flatMap((g) => g.items);

const primaryMobileNav: MobilePrimaryItem[] = [
  { href: "/dashboard",          label: "Inicio",   icon: Home,          exact: true },
  { href: "/dashboard/agenda",   label: "Agenda",   icon: CalendarDays               },
  { href: "/dashboard/caja",     label: "Caja",     icon: Banknote                   },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users                      },
  { type: "drawer", label: "Más", icon: MoreHorizontal },
];

const groupedMobileNav: MobileNavGroup[] = [
  {
    title: "Operación",
    items: [
      { href: "/dashboard/reservas",  label: "Reservas",    icon: ClipboardList              },
      { href: "/dashboard/huecos",    label: "Huecos libres", icon: Clock                    },
      { href: "/dashboard/barberos",  label: "Barberos",    icon: User                       },
      { href: "/dashboard/servicios", label: "Servicios",   icon: Scissors                   },
      { href: "/dashboard/inventario",label: "Inventario",  icon: Boxes,         badge: "Pro" },
    ],
  },
  {
    title: "Crecer",
    items: [
      { href: "/dashboard/marketing",     label: "Marketing Studio",  icon: Megaphone              },
      { href: "/dashboard/fidelizacion",  label: "Fidelización",      icon: Gift,      badge: "Nuevo" },
      { href: "/dashboard/resenas",       label: "Reseñas",           icon: Star                   },
      { href: "/dashboard/recuperacion",  label: "Clientes perdidos", icon: RotateCcw              },
      { href: "/dashboard/agents",        label: "Agentes IA",        icon: Sparkles,  badge: "Pro" },
      { href: "/dashboard/lounge",        label: "Sala de espera",    icon: Tv,        badge: "Pro" },
      { href: "/dashboard/growth",        label: "Growth Engine",     icon: Rocket,    badge: "Pro" },
    ],
  },
  {
    title: "Negocio",
    items: [
      { href: "/dashboard/pagos",        label: "Pagos",        icon: CreditCard                 },
      { href: "/dashboard/finanzas",     label: "Finanzas",     icon: Wallet,        badge: "Pro" },
      { href: "/dashboard/estadisticas", label: "Estadísticas", icon: TrendingUp,    badge: "Pro" },
      { href: "/dashboard/qr",           label: "QR público",   icon: QrCode                     },
      { href: "/dashboard/marketplace",  label: "Marketplace",  icon: ShoppingBag                },
      { href: "/dashboard/ajustes",      label: "Configuración",icon: Settings                   },
      { href: "/dashboard/whatsapp",     label: "Soporte",      icon: HelpCircle                 },
    ],
  },
];

const quickMobileActions: NavItem[] = [
  { href: "/dashboard/reservas",  label: "Nueva reserva",    icon: ClipboardList },
  { href: "/dashboard/huecos",    label: "Huecos libres",    icon: Clock         },
  { href: "/dashboard/qr",        label: "QR público",       icon: QrCode        },
  { href: "/dashboard/marketing", label: "Marketing",        icon: Megaphone     },
  { href: "/dashboard/agents",    label: "Agentes IA",       icon: Sparkles      },
  { href: "/dashboard/resenas",   label: "Reseñas",          icon: Star          },
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

// ─── Badge component ──────────────────────────────────────────────────────────

function NavBadge({ badge, dark }: { badge: BadgeType; dark?: boolean }) {
  const styles: Record<BadgeType, string> = {
    Pro:   dark ? "border-[#B88917]/25 bg-[#B88917]/12 text-[#B88917]"
                : "border-[#D5A84C]/25 bg-[#D5A84C]/10 text-[#8A641F]",
    Nuevo: dark ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                : "border-emerald-600/25 bg-emerald-600/10 text-emerald-700",
    Beta:  dark ? "border-slate-500/30 bg-slate-500/10 text-slate-400"
                : "border-slate-400/30 bg-slate-100 text-slate-500",
  };
  return (
    <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${styles[badge]}`}>
      {badge}
    </span>
  );
}

// ─── NavLink (expanded) ────────────────────────────────────────────────────────

function NavLink({
  item,
  pathname,
  onClick,
  dark,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
  dark?: boolean;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`nav-link transition-all duration-150 ${
        dark
          ? active
            ? "font-semibold text-white shadow-[inset_3px_0_0_#D4AF37]"
            : "font-medium text-slate-300/85 hover:bg-white/[0.07] hover:text-white"
          : active
            ? "bg-[#B88917]/10 font-semibold text-[#080A0F] shadow-[inset_3px_0_0_#B88917]"
            : "font-medium text-neutral-500 hover:bg-[#B88917]/5 hover:text-neutral-900"
      }`}
      style={
        dark && active
          ? { background: "linear-gradient(90deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 60%, transparent 100%)" }
          : undefined
      }
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        className={`shrink-0 transition-colors ${
          active ? "text-[#D4AF37]" : dark ? "text-slate-400/75" : "text-neutral-400"
        }`}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && <NavBadge badge={item.badge} dark={dark} />}
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
          ? "shadow-[inset_3px_0_0_#D4AF37,0_0_14px_rgba(212,175,55,0.12)]"
          : "hover:bg-white/[0.07]"
      }`}
      style={active ? { background: "linear-gradient(90deg, rgba(212,175,55,0.18), transparent)" } : undefined}
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        className={`transition-colors ${active ? "text-[#D4AF37]" : "text-slate-400/65"}`}
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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.09] px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 shadow-[0_-16px_40px_rgba(5,10,20,0.42)] backdrop-blur-xl md:hidden"
      style={{ background: "linear-gradient(0deg, rgba(8,17,30,0.97) 0%, rgba(12,24,44,0.95) 100%)" }}
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
                className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-bold transition-colors ${
                  moreActive
                    ? "bg-[#D4AF37]/18 text-white"
                    : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon size={21} className={moreActive ? "text-[#D4AF37]" : "text-slate-300/70"} />
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
              className={`flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-bold transition-colors ${
                active
                  ? "bg-[#D4AF37]/18 text-white"
                  : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <Icon size={21} className={active ? "text-[#D4AF37]" : "text-slate-300/70"} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Desktop sidebar grouped nav ──────────────────────────────────────────────

function DesktopGroupedNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex flex-1 flex-col overflow-y-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {sidebarGroups.map((group, i) => (
        <div key={group.label} className={i > 0 ? "mt-2 border-t border-white/[0.07] pt-3" : ""}>
          <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-[0.12em] text-slate-500/80">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} dark />
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

  // ── Mobile header ────────────────────────────────────────────────────────────
  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.09] px-4 shadow-[0_2px_28px_rgba(5,10,20,0.38)] backdrop-blur-xl md:hidden"
        style={{ background: "linear-gradient(135deg, rgba(15,32,64,0.97) 0%, rgba(8,17,30,0.97) 100%)" }}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <BarberiaOSLogo size={40} />
          <span className="font-black tracking-tight text-white">BarberíaOS</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/reservas"
            aria-label="Nueva reserva"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37] shadow-sm transition-colors hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/45"
          >
            <Plus size={17} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 shadow-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <MobileBottomNav pathname={pathname} onOpenMore={() => setDrawerOpen(true)} />

      {/* ── Mobile more drawer ── */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 md:hidden ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-[#050A14]/55 backdrop-blur-[3px]"
        />
        <aside
          aria-label="Más opciones de navegación"
          className={`absolute bottom-0 left-0 right-0 flex max-h-[82vh] flex-col rounded-t-[2rem] border-t border-white/10 bg-[#07101F] p-5 shadow-[0_-24px_60px_rgba(5,10,20,0.42)] transition-transform duration-200 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Drawer header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-black leading-none text-white">Más opciones</p>
              <p className="mt-1 text-sm font-medium text-slate-400">Accede a cualquier sección</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setDrawerOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 shadow-sm transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
            {/* Quick actions */}
            <section aria-labelledby="mobile-quick-actions">
              <h2 id="mobile-quick-actions" className="mb-2 px-1 text-xs font-black uppercase tracking-wide text-[#D4AF37]">
                Accesos rápidos
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {quickMobileActions.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`min-h-[72px] rounded-[20px] border p-3 transition-colors ${
                        active
                          ? "border-[#D4AF37]/40 bg-[#D4AF37]/15 text-white"
                          : "border-white/10 bg-white/[0.06] text-slate-300 hover:border-[#D4AF37]/35 hover:bg-white/[0.10]"
                      }`}
                    >
                      <Icon size={18} className={active ? "text-[#D4AF37]" : "text-slate-500"} />
                      <span className="mt-3 block text-sm font-black leading-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Grouped nav */}
            <section aria-labelledby="mobile-grouped-nav" className="min-h-0">
              <h2 id="mobile-grouped-nav" className="mb-2 px-1 text-xs font-black uppercase tracking-wide text-[#D4AF37]">
                Secciones
              </h2>
              {/* Group tabs */}
              <div className="mb-3 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/[0.05] p-1">
                {groupedMobileNav.map((group) => {
                  const active = group.title === activeMobileGroup;
                  return (
                    <button
                      key={group.title}
                      type="button"
                      onClick={() => setActiveMobileGroup(group.title)}
                      className={`min-h-10 rounded-xl text-xs font-black transition-colors ${
                        active
                          ? "bg-[#D4AF37] text-[#050A14] shadow-sm"
                          : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {group.title}
                    </button>
                  );
                })}
              </div>
              {/* Group items */}
              <div className="grid gap-1.5">
                {(
                  groupedMobileNav.find((g) => g.title === activeMobileGroup) ??
                  groupedMobileNav[0]
                ).items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClick={() => setDrawerOpen(false)}
                    dark
                  />
                ))}
              </div>
            </section>

            {/* Logout */}
            <div className="border-t border-white/[0.08] pt-3">
              <button
                type="button"
                onClick={async () => { setDrawerOpen(false); await handleLogout(); }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-400 transition-colors hover:bg-[#E5484D]/8 hover:text-[#E5484D]/80"
              >
                <LogOut size={16} className="shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </nav>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-white/[0.09] shadow-[4px_0_32px_rgba(5,10,20,0.44)] transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-4" : "w-64 p-5"
        }`}
        style={{
          background:
            "radial-gradient(circle at 88% 4%, rgba(212,175,55,0.07), transparent 36%)," +
            "radial-gradient(circle at 6% 92%, rgba(37,99,235,0.09), transparent 42%)," +
            "linear-gradient(168deg, #0F2040 0%, #0B1A2E 44%, #07111E 100%)",
        }}
      >
        {/* Top gold accent line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)" }}
        />

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="absolute -right-3.5 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#0F2040] shadow-[0_2px_10px_rgba(5,10,20,0.45)] transition-all duration-150 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/12 hover:shadow-[0_0_12px_rgba(212,175,55,0.20)]"
        >
          {collapsed ? (
            <ChevronRight size={13} className="text-[#D4AF37]/70" />
          ) : (
            <ChevronLeft size={13} className="text-[#D4AF37]/70" />
          )}
        </button>

        {/* Brand */}
        {collapsed ? (
          <div className="mb-4 flex justify-center">
            <Link href="/dashboard" title="BarberíaOS — Inicio">
              <BarberiaOSLogo size={40} />
            </Link>
          </div>
        ) : (
          <div
            className="mb-5 rounded-[20px] border border-[#D4AF37]/18 px-3 py-3"
            style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.03) 100%)" }}
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <BarberiaOSLogo size={40} className="shrink-0" />
              <div className="min-w-0">
                <span className="block text-[15px] font-black leading-none tracking-tight text-white">
                  BarberíaOS
                </span>
                <span className="mt-1 flex items-center gap-1.5">
                  <span className="block truncate text-[10px] font-semibold leading-tight text-slate-400">
                    Panel de control
                  </span>
                  <span className="shrink-0 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/12 px-1.5 py-px text-[9px] font-black uppercase tracking-wide text-[#D4AF37]">
                    Pro
                  </span>
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Quick CTA — Nueva cita */}
        {!collapsed && (
          <Link
            href="/dashboard/reservas"
            className="mb-3 flex items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/22 bg-[#D4AF37]/10 px-4 py-2.5 text-sm font-black text-[#D4AF37] transition-all duration-150 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/18"
          >
            <Plus size={15} />
            Nueva cita
          </Link>
        )}

        {/* Nav */}
        {collapsed ? (
          <nav className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allItems.map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          <DesktopGroupedNav pathname={pathname} />
        )}

        {/* Footer */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 border-t border-white/[0.08] pt-3">
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400/70 transition-all duration-150 hover:bg-[#E5484D]/10 hover:text-[#E5484D]/80"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-1.5 border-t border-white/[0.08] pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link w-full border border-white/[0.07] bg-white/[0.04] font-medium text-slate-400 transition-all duration-150 hover:border-[#E5484D]/25 hover:bg-[#E5484D]/8 hover:text-[#E5484D]/85"
            >
              <LogOut size={16} className="shrink-0 opacity-70" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
