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
  HelpCircle,
  Boxes,
  ShoppingBag,
  Receipt,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
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
    { href: "/dashboard/huecos",     label: "Estadísticas",     icon: TrendingUp               },
    { href: "/dashboard/fiscalidad", label: "Fiscalidad",       icon: Receipt                  },
  ],
  crecer: [
    { href: "/dashboard/clientes",         label: "Clientes CRM",     icon: Users                       },
    { href: "/dashboard/growth",           label: "Growth",           icon: Rocket,     badge: "Growth" },
    { href: "/dashboard/marketing",        label: "Marketing Studio", icon: Megaphone                   },
    { href: "/dashboard/resenas",          label: "Reseñas",          icon: Star                        },
    { href: "/dashboard/recuperacion",     label: "Clientes perdidos",icon: RotateCcw                  },
    { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: Workflow,   badge: "Pro"    },
    { href: "/dashboard/ia",               label: "IA del Dueño",     icon: Bot,        badge: "IA"     },
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
      { href: "/dashboard/marketing", label: "Marketing Studio", icon: Megaphone },
      { href: "/dashboard/growth", label: "Growth", icon: Rocket, badge: "Growth" },
      { href: "/dashboard/resenas", label: "Reseñas", icon: Star },
      { href: "/dashboard/automatizaciones", label: "Automatizaciones", icon: Workflow, badge: "Pro" },
      { href: "/dashboard/ia", label: "IA del Dueño", icon: Bot, badge: "IA" },
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
      { href: "/dashboard/huecos", label: "Estadísticas", icon: TrendingUp },
      { href: "/dashboard/fiscalidad", label: "Fiscalidad", icon: Receipt },
      { href: "/dashboard/whatsapp", label: "Soporte", icon: HelpCircle, badge: "Guía" },
    ],
  },
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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E7E2D8] bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-1.5 shadow-[0_-12px_35px_rgba(17,17,17,0.08)] backdrop-blur md:hidden"
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
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
                  moreActive
                    ? "bg-[#C9922A]/10 text-[#080A0F]"
                    : "text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
                }`}
              >
                <Icon size={19} className={moreActive ? "text-[#C9922A]" : "text-neutral-400"} />
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
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition-colors ${
                active
                  ? "bg-[#C9922A]/10 text-[#080A0F]"
                  : "text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
              }`}
            >
              <Icon size={19} className={active ? "text-[#C9922A]" : "text-neutral-400"} />
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
    <div className="mb-4 flex overflow-hidden rounded-2xl border border-[#E7E2D8]">
      {tabConfig.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-[9px] text-[11px] font-black uppercase tracking-wide transition-all duration-150 ${
            activeTab === tab.id
              ? "bg-[#080A0F] text-[#C9922A]"
              : "bg-[#F8F5EF] text-neutral-400 hover:bg-[#EDE8E0] hover:text-neutral-700"
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

  // Auto-sync tab with current route
  useEffect(() => {
    setActiveTab(getActiveTab(pathname));
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
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E2D8] text-neutral-500 transition-colors hover:bg-[#F8F5EF] hover:text-neutral-950"
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
          className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"
        />
        <aside
          aria-label="Más opciones de navegación"
          className={`absolute bottom-0 left-0 right-0 flex max-h-[82vh] flex-col rounded-t-[28px] border-t border-[#E7E2D8] bg-white p-5 shadow-2xl transition-transform duration-200 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Mobile drawer header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-black leading-none text-neutral-950">Más opciones</p>
              <p className="mt-1 text-xs font-medium text-neutral-400">Herramientas agrupadas por uso.</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar más opciones"
              onClick={() => setDrawerOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E2D8] text-neutral-500 transition-colors hover:bg-[#F8F5EF] hover:text-neutral-950"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-5 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
            {groupedMobileNav.map((group) => (
              <section key={group.title} aria-labelledby={`mobile-nav-${group.title}`}>
                <h2
                  id={`mobile-nav-${group.title}`}
                  className="mb-2 px-1 text-[10px] font-black uppercase tracking-wide text-neutral-400"
                >
                  {group.title}
                </h2>
                <div className="grid gap-1.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      onClick={() => setDrawerOpen(false)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </nav>

          {/* Mobile footer */}
          <div className="mt-4 border-t border-[#E7E2D8] pt-3">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="nav-link border border-[#E7E2D8] bg-white font-medium text-neutral-500 hover:bg-[#F8F5EF] hover:text-neutral-950"
            >
              <ShieldCheck size={16} className="shrink-0" />
              Volver a la landing
            </Link>
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
                  Sistema operativo de barbería.
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
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          // Expanded: items for active tab only
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-2">
            {tabItems[activeTab].map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
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
