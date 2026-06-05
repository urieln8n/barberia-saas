"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import {
  BarChart3,
  Banknote,
  Bot,
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
  Monitor,
  MoreHorizontal,
  Package,
  Plus,
  Scissors,
  Settings,
  Sparkles,
  Star,
  Users,
  UserX,
  Wand2,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeKind = "nuevo" | "pro" | "beta";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: BadgeKind;
  exact?: boolean;
  studio?: boolean; // extra highlight for Studio IA
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Inicio",
    items: [
      { href: "/dashboard",          label: "Dashboard",   icon: Home,         exact: true },
      { href: "/dashboard/agenda",   label: "Agenda",      icon: CalendarDays              },
      { href: "/dashboard/reservas", label: "Reservas",    icon: CalendarCheck             },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { href: "/dashboard/caja",      label: "Caja",          icon: Banknote  },
      { href: "/dashboard/pagos",     label: "Pagos",         icon: CreditCard },
      { href: "/dashboard/huecos",    label: "Huecos libres", icon: Zap        },
      { href: "/dashboard/inventario",label: "Inventario",    icon: Package    },
    ],
  },
  {
    label: "Clientes",
    items: [
      { href: "/dashboard/clientes",   label: "Clientes",         icon: Users  },
      { href: "/dashboard/fidelizacion",label: "Fidelización",    icon: Gift   },
      { href: "/dashboard/recuperacion",label: "Recuperación",    icon: UserX  },
      { href: "/dashboard/resenas",     label: "Reseñas",         icon: Star   },
      { href: "/dashboard/lounge",      label: "Sala de espera",  icon: Monitor},
    ],
  },
  {
    label: "Equipo",
    items: [
      { href: "/dashboard/barberos",  label: "Barberos",  icon: Scissors  },
      { href: "/dashboard/servicios", label: "Servicios", icon: Briefcase },
    ],
  },
  {
    label: "Crecimiento",
    items: [
      { href: "/dashboard/marketing",    label: "Marketing",    icon: Megaphone                 },
      { href: "/dashboard/ia",           label: "IA del Dueño", icon: Bot,      badge: "pro"   },
      { href: "/dashboard/estadisticas", label: "Reportes",     icon: BarChart3                },
    ],
  },
  {
    label: "Studio IA",
    items: [
      { href: "/dashboard/studio",         label: "Studio IA",       icon: Wand2,    badge: "nuevo", studio: true },
      { href: "/dashboard/studio/credits", label: "Créditos Studio", icon: Sparkles, badge: "pro"                },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings   },
      { href: "/dashboard/soporte", label: "Soporte", icon: HelpCircle },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

// Mobile bottom nav — 4 most-used
const MOBILE_PRIMARY: Pick<NavItem, "href" | "label" | "icon" | "exact">[] = [
  { href: "/dashboard",          label: "Inicio",   icon: Home,         exact: true },
  { href: "/dashboard/agenda",   label: "Agenda",   icon: CalendarDays              },
  { href: "/dashboard/caja",     label: "Caja",     icon: Banknote                  },
  { href: "/dashboard/studio",   label: "Studio",   icon: Clapperboard              },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: { href: string; exact?: boolean }): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function NavBadge({ kind }: { kind: BadgeKind }) {
  const styles: Record<BadgeKind, string> = {
    nuevo: "border-[#A78BFA]/40 bg-[#F6F3FF] text-[#6D28D9]",
    pro:   "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#92650A]",
    beta:  "border-slate-200 bg-slate-100 text-slate-500",
  };
  const labels: Record<BadgeKind, string> = { nuevo: "Nuevo", pro: "Pro", beta: "Beta" };
  return (
    <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${styles[kind]}`}>
      {labels[kind]}
    </span>
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
  const Icon   = item.icon;
  const active = isActive(pathname, item);

  // Studio IA item gets its own special styling
  if (item.studio) {
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-150 ${
          active
            ? "border-[#A78BFA]/50 bg-[#EDE9FE] shadow-[0_2px_8px_rgba(109,40,217,0.12),inset_3px_0_0_#6D28D9]"
            : "border-[#A78BFA]/25 bg-[#F6F3FF] hover:border-[#A78BFA]/50 hover:bg-[#EDE9FE] hover:shadow-[0_2px_8px_rgba(109,40,217,0.08)]"
        }`}
      >
        <span className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg transition-colors ${
          active ? "bg-[#6D28D9] text-white" : "bg-[#6D28D9]/15 text-[#6D28D9] group-hover:bg-[#6D28D9]/25"
        }`}>
          <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
        </span>
        <span className={`min-w-0 flex-1 truncate text-[13px] ${active ? "font-black text-[#4C1D95]" : "font-semibold text-[#5B21B6]"}`}>
          {item.label}
        </span>
        {item.badge && <NavBadge kind={item.badge} />}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 ${
        active
          ? "bg-white font-semibold text-[#111111] shadow-[0_1px_4px_rgba(15,23,42,0.08),inset_3px_0_0_#C9A227]"
          : "text-[#6B7280] hover:bg-white/70 hover:text-[#111111]"
      }`}
    >
      <span className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg transition-colors ${
        active ? "bg-[#C9A227]/12 text-[#92650A]" : "text-slate-400"
      }`}>
        <Icon size={14} strokeWidth={active ? 2.2 : 1.75} />
      </span>
      <span className={`min-w-0 flex-1 truncate text-[13px] ${active ? "font-black text-[#111111]" : "font-medium"}`}>
        {item.label}
      </span>
      {item.badge && <NavBadge kind={item.badge} />}
    </Link>
  );
}

// ─── IconNavLink (collapsed) ──────────────────────────────────────────────────

function IconNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon   = item.icon;
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      title={item.label}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
        item.studio
          ? active
            ? "bg-[#6D28D9] text-white shadow-md"
            : "bg-[#F6F3FF] text-[#6D28D9] hover:bg-[#EDE9FE]"
          : active
            ? "bg-white text-[#92650A] shadow-sm"
            : "text-slate-400 hover:bg-white hover:text-slate-700"
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.75} />
      {item.badge === "nuevo" && (
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#6D28D9]" />
      )}
    </Link>
  );
}

// ─── StudioFooterCard ─────────────────────────────────────────────────────────

function StudioFooterCard() {
  // TODO: replace mock with real wallet query once studio_credit_wallets table exists
  const credits = 5;
  const plan    = "Growth";

  return (
    <div className="overflow-hidden rounded-xl border border-[#A78BFA]/30 bg-[#F6F3FF]">
      <div className="px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#6D28D9]" />
            <span className="text-[10px] font-black uppercase tracking-wide text-[#6D28D9]">Studio IA</span>
          </div>
          <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-1.5 py-0.5 text-[9px] font-black text-[#92650A]">
            {plan}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-[#5B21B6]">{credits}</span>
          <span className="text-[11px] text-[#7C3AED]">créditos</span>
        </div>
      </div>
      <Link
        href="/dashboard/studio/credits"
        className="flex w-full items-center justify-center gap-1 border-t border-[#A78BFA]/20 bg-white/60 py-2 text-[11px] font-black text-[#6D28D9] transition hover:bg-[#EDE9FE]"
      >
        <Plus size={10} />
        Comprar créditos
      </Link>
    </div>
  );
}

// ─── MobileBottomNav ──────────────────────────────────────────────────────────

function MobileBottomNav({ pathname, onOpenMore }: { pathname: string; onOpenMore: () => void }) {
  const moreActive = ALL_ITEMS.some(
    (item) => !MOBILE_PRIMARY.some((p) => p.href === item.href) && isActive(pathname, item)
  );

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8E2D4] bg-[#FAFAF8]/97 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_PRIMARY.map((item) => {
          const Icon   = item.icon;
          const active = isActive(pathname, item);
          const isStudio = item.href.includes("studio");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors ${
                active
                  ? isStudio ? "text-[#6D28D9]" : "text-[#C9922A]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.75}
                className={active ? (isStudio ? "text-[#6D28D9]" : "text-[#C9922A]") : "text-slate-400"}
              />
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
          <MoreHorizontal size={20} strokeWidth={moreActive ? 2 : 1.75} className={moreActive ? "text-[#C9922A]" : "text-slate-400"} />
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
      className="flex flex-1 flex-col gap-0.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {NAV_GROUPS.map((group, gi) => {
        const isStudioGroup = group.label === "Studio IA";
        return (
          <div
            key={group.label}
            className={
              isStudioGroup
                ? "mt-2 rounded-xl border border-[#A78BFA]/25 bg-[#F6F3FF] px-2 py-2"
                : gi > 0
                ? "mt-1 border-t border-[#E8E2D4] pt-2"
                : ""
            }
          >
            <p
              className={`mb-1 px-1 text-[9px] font-black uppercase tracking-[0.15em] ${
                isStudioGroup ? "text-[#6D28D9]" : "text-[#B8A990]"
              }`}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
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

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Mobile header ──────────────────────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E8E2D4] bg-[#FAFAF8]/97 px-4 shadow-[0_1px_0_#E8E2D4] backdrop-blur-xl md:hidden">
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
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E2D4] bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <MobileBottomNav pathname={pathname} onOpenMore={() => setDrawerOpen(true)} />

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
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
          className={`absolute bottom-0 left-0 right-0 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-[24px] bg-[#FAFAF8] shadow-[0_-24px_60px_rgba(15,23,42,0.14)] transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Handle */}
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#E8E2D4]" />

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
            <p className="text-base font-black text-[#111111]">Navegación</p>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E2D4] bg-white text-slate-400 transition hover:border-slate-300"
            >
              <X size={15} />
            </button>
          </div>

          {/* Quick actions */}
          <div className="shrink-0 flex gap-2 px-5 pb-3">
            <Link
              href="/dashboard/reservas"
              onClick={() => setDrawerOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2.5 text-xs font-black text-white transition hover:bg-[#333]"
            >
              <Plus size={12} /> Nueva reserva
            </Link>
            <Link
              href="/dashboard/studio"
              onClick={() => setDrawerOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#6D28D9] px-3 py-2.5 text-xs font-black text-white transition hover:bg-[#5B21B6]"
            >
              <Clapperboard size={12} /> Crear video IA
            </Link>
          </div>

          {/* Nav groups scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_GROUPS.map((group, gi) => {
              const isStudioGroup = group.label === "Studio IA";
              return (
                <div
                  key={group.label}
                  className={
                    isStudioGroup
                      ? "mt-3 rounded-xl border border-[#A78BFA]/25 bg-[#F6F3FF] px-2 py-2"
                      : gi > 0
                      ? "mt-3 border-t border-[#E8E2D4] pt-3"
                      : "pt-1"
                  }
                >
                  <p
                    className={`mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.15em] ${
                      isStudioGroup ? "text-[#6D28D9]" : "text-[#B8A990]"
                    }`}
                  >
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
              );
            })}
          </div>

          {/* Footer logout */}
          <div className="shrink-0 border-t border-[#E8E2D4] px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={async () => { setDrawerOpen(false); await handleLogout(); }}
              className="flex w-full items-center gap-3 rounded-xl border border-[#E8E2D4] px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={14} className="shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-[#E8E2D4] bg-[#FAFAF8] transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-4" : "w-64 px-3 py-4"
        }`}
        style={{ boxShadow: "1px 0 0 0 #E8E2D4" }}
      >
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expandir" : "Colapsar"}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#E8E2D4] bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          {collapsed
            ? <ChevronRight size={11} className="text-slate-400" />
            : <ChevronLeft  size={11} className="text-slate-400" />}
        </button>

        {/* ── Brand header ── */}
        {collapsed ? (
          <div className="mb-4 flex justify-center">
            <Link href="/dashboard" title="BarberíaOS">
              <BarberiaOSLogo variant="sidebar" size={32} />
            </Link>
          </div>
        ) : (
          <div className="mb-3 overflow-hidden rounded-2xl border border-[#E8E2D4] bg-white px-3 py-2.5 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
            <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="BarberíaOS Dashboard">
              <BarberiaOSLogo variant="sidebar" size={30} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-black leading-none tracking-tight text-[#111111]">
                    Barbería<span className="text-[#C9A227]">OS</span>
                  </span>
                  <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#92650A]">
                    Pro
                  </span>
                </div>
                <span className="mt-0.5 block text-[10px] font-medium text-[#B8A990]">
                  Panel premium
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* ── Quick actions ── */}
        {!collapsed && (
          <div className="mb-3 flex flex-col gap-1.5">
            <Link
              href="/dashboard/reservas"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2.5 text-[12px] font-black text-white transition hover:bg-[#333] active:scale-[0.98]"
            >
              <Plus size={12} />
              Nueva reserva
            </Link>
            <Link
              href="/dashboard/studio"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#6D28D9] px-3 py-2.5 text-[12px] font-black text-white transition hover:bg-[#5B21B6] active:scale-[0.98]"
            >
              <Clapperboard size={12} />
              Crear video IA
            </Link>
          </div>
        )}

        {/* ── Navigation ── */}
        {collapsed ? (
          <nav
            className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Navegación principal"
          >
            {/* Quick actions collapsed */}
            <Link
              href="/dashboard/reservas"
              title="Nueva reserva"
              className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] text-white transition hover:bg-[#333]"
            >
              <Plus size={15} />
            </Link>
            <Link
              href="/dashboard/studio"
              title="Crear video IA"
              className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D28D9] text-white transition hover:bg-[#5B21B6]"
            >
              <Clapperboard size={15} />
            </Link>
            {/* Separator */}
            <div className="my-1 h-px w-8 bg-[#E8E2D4]" />
            {ALL_ITEMS.map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          <DesktopGroupedNav pathname={pathname} />
        )}

        {/* ── Studio footer card ── */}
        {!collapsed && (
          <div className="mt-2 border-t border-[#E8E2D4] pt-3">
            <StudioFooterCard />
          </div>
        )}

        {/* ── Logout ── */}
        {collapsed ? (
          <div className="mt-3 flex flex-col items-center border-t border-[#E8E2D4] pt-3">
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
          <div className="mt-2 border-t border-[#E8E2D4] pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-[#6B7280] transition hover:bg-red-50 hover:text-red-500"
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
