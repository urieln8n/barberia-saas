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
  Bot,
  Rocket,
  Settings,
  ShieldCheck,
  LogOut,
  QrCode,
  PackageCheck,
  HelpCircle,
  Boxes,
  ShoppingBag,
  Receipt,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  X,
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

type TabId = "operar" | "crecer" | "ajustes";

type MobilePrimaryItem =
  | NavItem
  | {
      type: "drawer";
      label: string;
      icon: LucideIcon;
    };

type MobileNavGroup = {
  title: string;
  items: NavItem[];
};

// ─── Navigation config ────────────────────────────────────────────────────────

const tabItems: Record<TabId, NavItem[]> = {
  operar: [
    { href: "/dashboard",                    label: "Inicio",             icon: Home,        exact: true },
    { href: "/dashboard/agenda",             label: "Agenda",             icon: CalendarDays             },
    { href: "/dashboard/reservas",           label: "Reservas",           icon: CalendarDays             },
    { href: "/dashboard/reservas/pipeline",  label: "Pipeline",           icon: Workflow                 },
    { href: "/dashboard/caja",               label: "Caja",               icon: Banknote                 },
    { href: "/dashboard/inventario",         label: "Productos",          icon: Boxes                    },
    { href: "/dashboard/barberos",           label: "Barberos",           icon: User                     },
    { href: "/dashboard/servicios",          label: "Servicios",          icon: Scissors                 },
    { href: "/dashboard/finanzas",   label: "Ventas",           icon: Wallet                   },
    { href: "/dashboard/pagos",      label: "Pagos",            icon: CreditCard               },
    { href: "/dashboard/estadisticas", label: "Estadísticas",   icon: TrendingUp               },
    { href: "/dashboard/fiscalidad", label: "Fiscalidad",       icon: Receipt                  },
  ],
  crecer: [
    { href: "/dashboard/clientes",         label: "Clientes CRM",     icon: Users                       },
    { href: "/dashboard/growth",           label: "Growth",           icon: Rocket,     badge: "Growth" },
    { href: "/dashboard/marketing",        label: "Marketing Studio", icon: Megaphone                   },
    { href: "/dashboard/resenas",          label: "Reseñas",          icon: Star                        },
    { href: "/dashboard/recuperacion",     label: "Clientes perdidos",icon: RotateCcw                  },
    { href: "/dashboard/agents",            label: "Agentes IA",       icon: Sparkles,   badge: "Nuevo"  },
    { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: Workflow,   badge: "Pro"    },
    { href: "/dashboard/ia",               label: "IA del Dueño",     icon: Bot,        badge: "IA"     },
    { href: "/dashboard/kit",              label: "BarberíaOS Kit",   icon: PackageCheck, badge: "Kit" },
    { href: "/dashboard/qr",               label: "QR y página pública", icon: QrCode                   },
    { href: "/dashboard/marketplace",      label: "Marketplace",      icon: ShoppingBag                 },
    { href: "/dashboard/security-audit",   label: "Auditoría Web",    icon: ShieldCheck, badge: "Beta" },
  ],
  ajustes: [
    { href: "/dashboard/ajustes",  label: "Configuración",   icon: Settings                    },
    { href: "/dashboard/whatsapp", label: "Soporte",         icon: HelpCircle, badge: "Guía"  },
  ],
};

const allItems: NavItem[] = [
  ...tabItems.operar,
  ...tabItems.crecer,
  ...tabItems.ajustes,
];

const primaryMobileNav: MobilePrimaryItem[] = [
  { href: "/dashboard", label: "Inicio", icon: Home, exact: true },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/caja", label: "Caja", icon: Banknote },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { type: "drawer", label: "Más", icon: MoreHorizontal },
];

const groupedMobileNav: MobileNavGroup[] = [
  {
    title: "Operación",
    items: [
      { href: "/dashboard/reservas", label: "Reservas", icon: CalendarDays },
      { href: "/dashboard/reservas/pipeline", label: "Pipeline", icon: Workflow },
      { href: "/dashboard/barberos", label: "Barberos", icon: User },
      { href: "/dashboard/servicios", label: "Servicios", icon: Scissors },
    ],
  },
  {
    title: "Crecimiento",
    items: [
      { href: "/dashboard/agents", label: "Agentes IA", icon: Sparkles, badge: "Nuevo" },
      { href: "/dashboard/marketing", label: "Marketing Studio", icon: Megaphone },
      { href: "/dashboard/growth", label: "Growth", icon: Rocket, badge: "Growth" },
      { href: "/dashboard/resenas", label: "Reseñas", icon: Star },
      { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: Workflow, badge: "Pro" },
      { href: "/dashboard/ia", label: "IA del Dueño", icon: Bot, badge: "IA" },
      { href: "/dashboard/kit", label: "BarberíaOS Kit", icon: PackageCheck, badge: "Kit" },
      { href: "/dashboard/recuperacion", label: "Clientes perdidos", icon: RotateCcw },
      { href: "/dashboard/security-audit", label: "Auditoría Web", icon: ShieldCheck, badge: "Beta" },
    ],
  },
  {
    title: "Negocio",
    items: [
      { href: "/dashboard/inventario", label: "Inventario", icon: Boxes },
      { href: "/dashboard/qr", label: "QR y página pública", icon: QrCode },
      { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
      { href: "/dashboard/ajustes", label: "Configuración", icon: Settings },
      { href: "/dashboard/finanzas", label: "Ventas", icon: Wallet },
      { href: "/dashboard/pagos", label: "Pagos", icon: CreditCard },
      { href: "/dashboard/estadisticas", label: "Estadísticas", icon: TrendingUp },
      { href: "/dashboard/fiscalidad", label: "Fiscalidad", icon: Receipt },
      { href: "/dashboard/whatsapp", label: "Soporte", icon: HelpCircle, badge: "Guía" },
    ],
  },
];

const quickMobileActions: NavItem[] = [
  { href: "/dashboard/reservas", label: "Nueva reserva", icon: CalendarDays },
  { href: "/dashboard/qr", label: "QR público", icon: QrCode },
  { href: "/dashboard/kit", label: "Kit", icon: PackageCheck, badge: "Kit" },
  { href: "/dashboard/growth", label: "Growth", icon: Rocket, badge: "Growth" },
  { href: "/dashboard/ia", label: "IA dueño", icon: Bot, badge: "IA" },
];

const tabConfig: { id: TabId; label: string }[] = [
  { id: "operar",  label: "Operar"  },
  { id: "crecer",  label: "Crecer"  },
  { id: "ajustes", label: "Ajustes" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function getActiveTab(pathname: string): TabId {
  for (const item of tabItems.crecer) {
    if (isActive(pathname, item)) return "crecer";
  }
  for (const item of tabItems.ajustes) {
    if (isActive(pathname, item)) return "ajustes";
  }
  return "operar";
}

function isGroupedMobileActive(pathname: string): boolean {
  return groupedMobileNav.some((group) =>
    group.items.some((item) => isActive(pathname, item))
  );
}

// ─── NavLink (expanded) ───────────────────────────────────────────────────────

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
              ? "font-semibold text-white shadow-[inset_3px_0_0_#D4AF66]"
            : "font-medium text-slate-300/85 hover:bg-white/[0.07] hover:text-white"
          : active
            ? "bg-[#C9922A]/10 font-semibold text-[#080A0F] shadow-[inset_3px_0_0_#C9922A]"
            : "font-medium text-neutral-500 hover:bg-[#C9922A]/5 hover:text-neutral-900"
      }`}
      style={dark && active ? { background: "linear-gradient(90deg, rgba(212,175,102,0.16) 0%, rgba(212,175,102,0.06) 60%, transparent 100%)" } : undefined}
    >
      <Icon
        size={18}
        className={`shrink-0 transition-colors ${active ? "text-[#D4AF66]" : dark ? "text-slate-400/75" : "text-neutral-400"}`}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${
          dark
            ? "border-[#C9922A]/20 bg-[#C9922A]/10 text-[#C9922A]"
            : "border-[#D5A84C]/25 bg-[#D5A84C]/10 text-[#8A641F]"
        }`}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── IconNavLink (collapsed) ──────────────────────────────────────────────────

function IconNavLink({ item, pathname, dark }: { item: NavItem; pathname: string; dark?: boolean }) {
  const Icon = item.icon;
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      title={item.label}
      className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150 ${
        dark
          ? active
            ? "shadow-[inset_3px_0_0_#D4AF66,0_0_14px_rgba(212,175,102,0.12)]"
            : "hover:bg-white/[0.07]"
          : active
            ? "bg-[#C9922A]/10 shadow-[inset_3px_0_0_#C9922A]"
            : "hover:bg-[#C9922A]/5"
      }`}
      style={dark && active ? { background: "linear-gradient(90deg, rgba(212,175,102,0.18), transparent)" } : undefined}
    >
      <Icon
        size={18}
        className={`transition-colors ${active ? "text-[#D4AF66]" : dark ? "text-slate-400/65" : "text-neutral-400"}`}
      />
    </Link>
  );
}

function MobileBottomNav({
  pathname,
  onOpenMore,
}: {
  pathname: string;
  onOpenMore: () => void;
}) {
  const moreActive = isGroupedMobileActive(pathname);

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
                    ? "bg-[#D4AF66]/18 text-white"
                    : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon size={21} className={moreActive ? "text-[#D4AF66]" : "text-slate-300/70"} />
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
                  ? "bg-[#D4AF66]/18 text-white"
                  : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <Icon size={21} className={active ? "text-[#D4AF66]" : "text-slate-300/70"} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Tab bar (expanded) ───────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <div className="mb-4 flex gap-0.5 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.05] p-0.5">
      {tabConfig.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-[14px] py-[9px] text-[11px] font-black uppercase tracking-wide transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-[#D4AF66] text-[#080A0F] shadow-[0_2px_10px_rgba(212,175,102,0.32)]"
              : "text-slate-400 hover:bg-white/[0.07] hover:text-slate-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname            = usePathname();
  const router              = useRouter();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab]   = useState<TabId>(() => getActiveTab(pathname));
  const [activeMobileGroup, setActiveMobileGroup] = useState<string>(() => {
    return (
      groupedMobileNav.find((group) =>
        group.items.some((item) => isActive(pathname, item))
      )?.title ?? groupedMobileNav[0].title
    );
  });

  // Auto-sync tab with current route
  useEffect(() => {
    setActiveTab(getActiveTab(pathname));
    const currentGroup = groupedMobileNav.find((group) =>
      group.items.some((item) => isActive(pathname, item))
    );
    if (currentGroup) {
      setActiveMobileGroup(currentGroup.title);
    }
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
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.09] px-4 shadow-[0_2px_28px_rgba(5,10,20,0.38)] backdrop-blur-xl md:hidden" style={{ background: "linear-gradient(135deg, rgba(15,32,64,0.97) 0%, rgba(8,17,30,0.97) 100%)" }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF66]/40 bg-[#D4AF66]/18 shadow-[0_0_16px_rgba(212,175,102,0.16)]">
            <Scissors size={16} className="text-[#D4AF66]" />
          </div>
          <span className="font-black tracking-tight text-white">BarberíaOS</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 shadow-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={17} />
        </button>
      </header>

      <MobileBottomNav pathname={pathname} onOpenMore={() => setDrawerOpen(true)} />

      {/* ── Mobile more sheet ── */}
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
          {/* Mobile drawer header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-black leading-none text-white">Más opciones</p>
              <p className="mt-1 text-sm font-medium text-slate-300">Herramientas agrupadas por uso.</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar más opciones"
              onClick={() => setDrawerOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 shadow-sm transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
            <section aria-labelledby="mobile-quick-actions">
              <h2
                id="mobile-quick-actions"
                className="mb-2 px-1 text-xs font-black uppercase tracking-wide text-[#D4AF66]"
              >
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
                      className={`min-h-[78px] rounded-[20px] border p-3 transition-colors ${
                        active
                          ? "border-[#D4AF66]/40 bg-[#D4AF66]/15 text-white"
                          : "border-white/10 bg-white/[0.06] text-slate-300 hover:border-[#D4AF66]/35 hover:bg-white/[0.10]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Icon
                          size={18}
                          className={active ? "text-[#8A641F]" : "text-slate-500"}
                        />
                        {item.badge && (
                          <span className="rounded-full border border-[#D4AF66]/30 bg-[#D4AF66]/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#8A641F]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="mt-3 block text-sm font-black leading-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="mobile-grouped-navigation" className="min-h-0">
              <h2
                id="mobile-grouped-navigation"
                className="mb-2 px-1 text-xs font-black uppercase tracking-wide text-[#D4AF66]"
              >
                Secciones
              </h2>
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
                          ? "bg-[#D4AF66] text-[#050A14] shadow-sm"
                          : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {group.title}
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-1.5">
                {(groupedMobileNav.find((group) => group.title === activeMobileGroup) ?? groupedMobileNav[0]).items.map((item) => (
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
          </nav>

          {/* Mobile footer */}
          <div className="mt-4 border-t border-white/10 pt-3">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="nav-link border border-white/10 bg-white/[0.06] font-bold text-slate-300 hover:bg-white/[0.10] hover:text-white"
            >
              <ShieldCheck size={16} className="shrink-0" />
              Volver a la landing
            </Link>
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-white/[0.09] shadow-[4px_0_32px_rgba(5,10,20,0.44)] transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-4" : "w-64 p-5"
        }`}
        style={{
          background:
            "radial-gradient(circle at 88% 4%, rgba(212,175,102,0.07), transparent 36%)," +
            "radial-gradient(circle at 6% 92%, rgba(37,99,235,0.09), transparent 42%)," +
            "linear-gradient(168deg, #0F2040 0%, #0B1A2E 44%, #07111E 100%)",
        }}
      >
        {/* Top gold accent line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,175,102,0.55) 50%, transparent 100%)" }}
        />
        {/* Toggle collapse button */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="absolute -right-3.5 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF66]/20 bg-[#0F2040] shadow-[0_2px_10px_rgba(5,10,20,0.45)] transition-all duration-150 hover:border-[#D4AF66]/50 hover:bg-[#D4AF66]/12 hover:shadow-[0_0_12px_rgba(212,175,102,0.20)]"
        >
          {collapsed ? (
            <ChevronRight size={13} className="text-[#D4AF66]/70" />
          ) : (
            <ChevronLeft size={13} className="text-[#D4AF66]/70" />
          )}
        </button>

        {/* Brand */}
        {collapsed ? (
          <div className="mb-3 flex justify-center">
            <Link href="/dashboard" title="BarberíaOS — Inicio">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF66]/40 bg-[#D4AF66]/15 shadow-[0_0_18px_rgba(212,175,102,0.18)]">
                <Scissors size={15} className="text-[#D4AF66]" />
              </div>
            </Link>
          </div>
        ) : (
          <div
            className="mb-5 rounded-[20px] border border-[#D4AF66]/18 px-3 py-3"
            style={{ background: "linear-gradient(135deg, rgba(212,175,102,0.08) 0%, rgba(255,255,255,0.03) 100%)" }}
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF66]/40 bg-[#D4AF66]/18 shadow-[0_0_20px_rgba(212,175,102,0.20)]">
                <Scissors size={15} className="text-[#D4AF66]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[15px] font-black leading-none tracking-tight text-white">BarberíaOS</span>
                <span className="mt-1 flex items-center gap-1.5">
                  <span className="block truncate text-[10px] font-semibold leading-tight text-slate-400">
                    Panel de control
                  </span>
                  <span className="shrink-0 rounded-full border border-[#D4AF66]/30 bg-[#D4AF66]/12 px-1.5 py-px text-[9px] font-black uppercase tracking-wide text-[#D4AF66]">
                    Pro
                  </span>
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Tab bar (expanded only) */}
        {!collapsed && (
          <TabBar activeTab={activeTab} onChange={setActiveTab} />
        )}

        {/* Nav */}
        {collapsed ? (
          // Collapsed: icon-only, all items
          <nav className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto py-1">
            {allItems.map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} dark />
            ))}
          </nav>
        ) : (
          // Expanded: items for active tab only
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-2">
            {tabItems[activeTab].map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} dark />
            ))}
          </nav>
        )}

        {/* Footer */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 border-t border-white/[0.08] pt-3">
            <Link
              href="/"
              title="Volver a la landing"
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400/70 transition-all duration-150 hover:bg-white/[0.08] hover:text-slate-200"
            >
              <ShieldCheck size={17} />
            </Link>
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
            <Link
              href="/"
              className="nav-link border border-white/[0.07] bg-white/[0.04] font-medium text-slate-400 transition-all duration-150 hover:border-white/[0.14] hover:bg-white/[0.09] hover:text-slate-200"
            >
              <ShieldCheck size={16} className="shrink-0 opacity-70" />
              Volver a la landing
            </Link>
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
