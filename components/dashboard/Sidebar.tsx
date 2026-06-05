"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  CreditCard,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Megaphone,
  MoreHorizontal,
  Plus,
  Scissors,
  Settings,
  Sparkles,
  Star,
  Users,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Gold (Core):      #B88A2A  /  #A87412  /  #F3E7C9
// Purple (AI only): #6D28D9  /  #7C3AED  /  #F3E8FF
// Sidebar bg:       #F7F6F2   Card bg: #FFFFFF   Border: #EAE4D8
// Text primary:     #151515   Text secondary: #6F6F6F

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = "gold" | "purple" | "green" | "slate";

type NavItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  exact?: boolean;
  isAI?: boolean;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

// ─── Mobile bottom nav ────────────────────────────────────────────────────────

const MOBILE_QUICK = [
  { href: "/dashboard",        label: "Inicio",  icon: Home,        exact: true  } as const,
  { href: "/dashboard/agenda", label: "Agenda",  icon: CalendarDays              } as const,
  { href: "/dashboard/caja",   label: "Caja",    icon: Banknote                  } as const,
  { href: "/dashboard/studio", label: "Studio",  icon: Clapperboard              } as const,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: { href: string; exact?: boolean }): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// ─── PremiumBadge ─────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<BadgeVariant, string> = {
  gold:   "border-[#B88A2A]/30 bg-[#F3E7C9]/70 text-[#A87412]",
  purple: "border-[#A78BFA]/40 bg-[#F3E8FF] text-[#6D28D9]",
  green:  "border-green-200 bg-green-50 text-green-700",
  slate:  "border-slate-200 bg-slate-100 text-slate-500",
};

function PremiumBadge({ label, variant = "gold" }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${BADGE_STYLES[variant]}`}>
      {label}
    </span>
  );
}

// ─── PremiumSidebarItem ───────────────────────────────────────────────────────

function PremiumSidebarItem({
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

  const iconCls = item.isAI
    ? active ? "bg-[#6D28D9] text-white" : "bg-[#F3E8FF] text-[#6D28D9]"
    : active ? "bg-[#B88A2A]/12 text-[#A87412]" : "bg-[#F5F3EE] text-slate-500";

  const rowCls = item.isAI
    ? active
      ? "bg-[#F3E8FF]/60 shadow-[inset_3px_0_0_#6D28D9]"
      : "bg-[#F3E8FF]/20 hover:bg-[#F3E8FF]/50"
    : active
      ? "bg-white shadow-[inset_3px_0_0_#B88A2A]"
      : "hover:bg-[#F5F3EE]/70";

  const titleCls = item.isAI
    ? active ? "font-semibold text-[#4C1D95]" : "font-medium text-[#5B21B6]"
    : active   ? "font-semibold text-[#151515]" : "font-medium text-[#151515]";

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={item.description}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 px-3 py-[10px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ${
        item.isAI ? "focus-visible:ring-[#7C3AED]" : "focus-visible:ring-[#B88A2A]"
      } ${rowCls}`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${iconCls}`}>
        <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] leading-tight ${titleCls}`}>{item.title}</p>
        <p className="mt-[3px] truncate text-[11px] leading-tight text-[#6F6F6F]">{item.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {item.badge && <PremiumBadge label={item.badge} variant={item.badgeVariant} />}
        <ChevronRight size={12} className={active ? "text-slate-400" : "text-slate-300"} aria-hidden="true" />
      </div>
    </Link>
  );
}

// ─── PremiumSidebarSection ────────────────────────────────────────────────────

function PremiumSidebarSection({
  section,
  items,
  pathname,
  onItemClick,
}: {
  section: string;
  items: NavItem[];
  pathname: string;
  onItemClick?: () => void;
}) {
  return (
    <div>
      <p className="mb-1.5 px-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">
        {section}
      </p>
      <div className="overflow-hidden rounded-2xl border border-[#EAE4D8] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        {items.map((item, i) => (
          <div key={item.href}>
            {i > 0 && <div className="mx-3 h-px bg-[#F0EBE1]" aria-hidden="true" />}
            <PremiumSidebarItem item={item} pathname={pathname} onClick={onItemClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── IconNavLink (collapsed mode) ─────────────────────────────────────────────

function IconNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon   = item.icon;
  const active = isActive(pathname, item);
  return (
    <Link
      href={item.href}
      title={`${item.title} — ${item.description}`}
      aria-label={item.title}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
        item.isAI
          ? active
            ? "bg-[#6D28D9] text-white shadow-md focus-visible:ring-[#7C3AED]"
            : "bg-[#F3E8FF] text-[#6D28D9] hover:bg-[#EDE9FE] focus-visible:ring-[#7C3AED]"
          : active
            ? "bg-white text-[#A87412] shadow-sm focus-visible:ring-[#B88A2A]"
            : "text-slate-500 hover:bg-white hover:text-slate-700 focus-visible:ring-[#B88A2A]"
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.75} />
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
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAE4D8] bg-[#F7F6F2]/97 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_QUICK.map((item) => {
          const Icon     = item.icon;
          const active   = isActive(pathname, item);
          const isStudio = item.href.includes("studio");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                active
                  ? isStudio ? "text-[#6D28D9] focus-visible:ring-[#7C3AED]"
                             : "text-[#B88A2A] focus-visible:ring-[#B88A2A]"
                  : "text-slate-500 hover:text-slate-800 focus-visible:ring-slate-400"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.75}
                aria-hidden="true"
                className={active ? (isStudio ? "text-[#6D28D9]" : "text-[#B88A2A]") : "text-slate-500"}
              />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="Abrir menú completo"
          onClick={onOpenMore}
          className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1"
        >
          <MoreHorizontal size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>Más</span>
        </button>
      </div>
    </nav>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname              = usePathname();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail]   = useState("");

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const sections: NavSection[] = [
    {
      section: "Negocio",
      items: [
        { icon: CalendarDays, title: "Agenda",   description: "Reservas y disponibilidad", href: "/dashboard/agenda"   },
        { icon: Users,        title: "Clientes", description: "Historial y seguimiento",   href: "/dashboard/clientes" },
        { icon: Scissors,     title: "Barberos", description: "Equipo y comisiones",       href: "/dashboard/barberos" },
        { icon: Banknote,     title: "Caja",     description: "Cobros y ventas",           href: "/dashboard/caja"     },
      ],
    },
    {
      section: "Crecimiento",
      items: [
        {
          icon: Wand2, title: "Studio IA", description: "Contenido y videos automáticos",
          href: "/dashboard/studio", badge: "NUEVO", badgeVariant: "purple", isAI: true,
        },
        { icon: Gift,     title: "Fidelización", description: "Programas y recompensas", href: "/dashboard/fidelizacion" },
        { icon: Star,     title: "Reseñas",      description: "Opiniones y reputación",  href: "/dashboard/resenas"      },
        { icon: Megaphone,title: "Promociones",  description: "Ofertas y campañas",      href: "/dashboard/marketing"    },
      ],
    },
    {
      section: "Cuenta",
      items: [
        {
          icon: CreditCard, title: "Plan Profesional",
          description: "Funciones avanzadas para tu negocio",
          href: "/dashboard/ajustes", badge: "Activo", badgeVariant: "green",
        },
        { icon: Sparkles,   title: "Membresía",        description: "Premium · Growth", href: "/dashboard/studio/credits" },
        { icon: Mail,       title: "Correo electrónico", description: userEmail || "Mi cuenta", href: "/dashboard/ajustes" },
        { icon: Settings,   title: "Apariencia",       description: "Claro premium",    href: "/dashboard/ajustes"       },
      ],
    },
  ];

  // Primary items for collapsed icon list (skip account section)
  const primaryItems = sections
    .filter((s) => s.section !== "Cuenta")
    .flatMap((s) => s.items);

  return (
    <>
      {/* ── Mobile top header ──────────────────────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#EAE4D8] bg-[#F7F6F2]/97 px-4 shadow-[0_1px_0_#EAE4D8] backdrop-blur-xl md:hidden">
        <Link
          href="/dashboard"
          aria-label="BarberíaOS — Ir al dashboard"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
        >
          <BarberiaOSLogo variant="sidebar" size={28} />
          <span className="text-[14px] font-black text-[#151515]">
            Barbería<span className="text-[#B88A2A]">OS</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Nueva reserva → agenda con autoOpen */}
          <Link
            href="/dashboard/agenda?new=1"
            aria-label="Nueva reserva"
            className="flex h-9 items-center gap-1.5 rounded-xl bg-[#111111] px-3 text-[12px] font-black text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
          >
            <Plus size={13} aria-hidden="true" />
            <span>Reserva</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE4D8] bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
          >
            <LogOut size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <MobileBottomNav pathname={pathname} onOpenMore={() => setDrawerOpen(true)} />

      {/* ── Mobile drawer ────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed inset-0 z-50 transition-opacity duration-200 md:hidden ${
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
          tabIndex={drawerOpen ? 0 : -1}
        />
        <aside
          className={`absolute bottom-0 left-0 right-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[24px] bg-[#F7F6F2] shadow-[0_-24px_60px_rgba(15,23,42,0.14)] transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#EAE4D8]" aria-hidden="true" />
          <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
            <div>
              <p className="text-base font-black text-[#151515]">Navegación</p>
              <p className="text-[11px] text-[#6F6F6F]">Panel premium BarberíaOS</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE4D8] bg-white text-slate-500 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex shrink-0 gap-2 px-5 pb-4">
            <Link
              href="/dashboard/agenda?new=1"
              onClick={() => setDrawerOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2.5 text-[12px] font-black text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
            >
              <Plus size={12} aria-hidden="true" /> Nueva reserva
            </Link>
            <Link
              href="/dashboard/studio?type=fill_empty_slots"
              onClick={() => setDrawerOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-3 py-2.5 text-[12px] font-black text-white transition hover:from-[#5B21B6] hover:to-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
            >
              <Clapperboard size={12} aria-hidden="true" /> Crear video IA
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-4">
              {sections.map((s) => (
                <PremiumSidebarSection
                  key={s.section}
                  section={s.section}
                  items={s.items}
                  pathname={pathname}
                  onItemClick={() => setDrawerOpen(false)}
                />
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-[#EAE4D8] px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={async () => { setDrawerOpen(false); await handleLogout(); }}
              className="flex w-full items-center gap-3 rounded-xl border border-[#EAE4D8] bg-white px-4 py-3 text-sm font-semibold text-[#6F6F6F] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
            >
              <LogOut size={14} className="shrink-0" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ───────────────────────────────────────────────────── */}
      <aside
        aria-label="Navegación del panel"
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-[#EAE4D8] bg-[#F7F6F2] transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-4" : "w-72 px-3 py-4"
        }`}
        style={{ boxShadow: "1px 0 0 0 #EAE4D8" }}
      >
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#EAE4D8] bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
        >
          {collapsed
            ? <ChevronRight size={11} className="text-slate-500" aria-hidden="true" />
            : <ChevronLeft  size={11} className="text-slate-500" aria-hidden="true" />}
        </button>

        {/* ── Brand header ── */}
        {collapsed ? (
          <div className="mb-4 flex justify-center">
            <Link
              href="/dashboard"
              aria-label="BarberíaOS — Dashboard"
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
            >
              <BarberiaOSLogo variant="sidebar" size={36} />
            </Link>
          </div>
        ) : (
          <div className="mb-4 overflow-hidden rounded-2xl border border-[#EAE4D8] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
            <Link
              href="/dashboard"
              aria-label="BarberíaOS Dashboard"
              className="flex items-center gap-3.5 px-3.5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B88A2A]"
            >
              {/* Premium B mark — bigger for presence */}
              <BarberiaOSLogo variant="sidebar" size={44} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-black leading-none tracking-tight text-[#151515]">
                    Barbería<span
                      style={{
                        background: "linear-gradient(135deg, #B88A2A 0%, #D4AF37 45%, #B88A2A 80%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >OS</span>
                  </span>
                  <span className="rounded-full border border-[#B88A2A]/35 bg-[#F3E7C9]/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#A87412]">
                    Pro
                  </span>
                </div>
                <span className="mt-0.5 block text-[11px] font-medium text-[#6F6F6F]">Panel premium</span>
              </div>
            </Link>
          </div>
        )}

        {/* ── Quick actions ── */}
        {!collapsed && (
          <div className="mb-4 flex flex-col gap-2">
            {/* Nueva reserva → agenda con panel auto-abierto */}
            <Link
              href="/dashboard/agenda?new=1"
              aria-label="Crear nueva reserva"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2.5 text-[12px] font-black text-white transition hover:bg-[#333] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
            >
              <Plus size={13} aria-hidden="true" />
              Nueva reserva
            </Link>
            {/* Crear video IA → studio con tipo fill_empty_slots pre-seleccionado */}
            <Link
              href="/dashboard/studio?type=fill_empty_slots"
              aria-label="Crear video con Studio IA"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-3 py-2.5 text-[12px] font-black text-white transition hover:from-[#5B21B6] hover:to-[#6D28D9] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
            >
              <Clapperboard size={13} aria-hidden="true" />
              Crear video IA
            </Link>
          </div>
        )}

        {/* ── Navigation ── */}
        {collapsed ? (
          <nav
            aria-label="Navegación principal"
            className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Link
              href="/dashboard/agenda?new=1"
              aria-label="Nueva reserva"
              className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
            >
              <Plus size={15} aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard/studio?type=fill_empty_slots"
              aria-label="Crear video IA"
              className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#6D28D9] to-[#7C3AED] text-white transition hover:from-[#5B21B6] hover:to-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
            >
              <Clapperboard size={15} aria-hidden="true" />
            </Link>
            <div className="my-1 h-px w-8 bg-[#EAE4D8]" aria-hidden="true" />
            {primaryItems.map((item) => (
              <IconNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        ) : (
          <nav
            aria-label="Navegación principal"
            className="flex flex-1 flex-col gap-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s) => (
              <PremiumSidebarSection
                key={s.section}
                section={s.section}
                items={s.items}
                pathname={pathname}
              />
            ))}
          </nav>
        )}

        {/* ── Logout ── */}
        {collapsed ? (
          <div className="mt-3 flex flex-col items-center gap-1 border-t border-[#EAE4D8] pt-3">
            <Link
              href="/dashboard/soporte"
              aria-label="Soporte"
              title="Soporte — Ayuda y contacto"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
            >
              <HelpCircle size={15} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
            >
              <LogOut size={15} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-3 border-t border-[#EAE4D8] pt-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#6F6F6F] transition hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
            >
              <LogOut size={15} className="shrink-0" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
