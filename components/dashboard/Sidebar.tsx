"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  Megaphone,
  MoreHorizontal,
  Plus,
  QrCode,
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
// Gold:   #B88A2A / #A87412 / #F3E7C9
// Purple: #6D28D9 / #7C3AED / #F3E8FF  (AI only)
// Bg:     #F7F6F2   Card: #FFFFFF   Border: #EAE4D8

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
  notification?: number;
};

type NavSection = { section: string; items: NavItem[] };

type TodayStats = { total: number; completed: number; revenue: number };

// ─── Mobile bottom nav (static) ───────────────────────────────────────────────

const MOBILE_QUICK = [
  { href: "/dashboard",        label: "Inicio",  icon: Home,        exact: true  } as const,
  { href: "/dashboard/agenda", label: "Agenda",  icon: CalendarDays              } as const,
  { href: "/dashboard/caja",   label: "Caja",    icon: Banknote                  } as const,
  { href: "/dashboard/studio", label: "Studio",  icon: Clapperboard              } as const,
];

const PLAN_LABELS: Record<string, string> = {
  free: "Starter", starter: "Starter", pro: "Profesional", growth: "Growth", premium: "Premium",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(pathname: string, item: { href: string; exact?: boolean }): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
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

// ─── NotificationDot ──────────────────────────────────────────────────────────

function NotificationDot({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={`${count} pendiente${count > 1 ? "s" : ""}`}
      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white"
    >
      {count > 9 ? "9+" : count}
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
    ? active ? "bg-[#F3E8FF]/60 shadow-[inset_3px_0_0_#6D28D9]" : "bg-[#F3E8FF]/20 hover:bg-[#F3E8FF]/50"
    : active ? "bg-white shadow-[inset_3px_0_0_#B88A2A]"         : "hover:bg-[#F5F3EE]/70";

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
      {/* Icon with notification overlay */}
      <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${iconCls}`}>
        <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
        <NotificationDot count={item.notification ?? 0} />
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
          ? active ? "bg-[#6D28D9] text-white shadow-md focus-visible:ring-[#7C3AED]"
                   : "bg-[#F3E8FF] text-[#6D28D9] hover:bg-[#EDE9FE] focus-visible:ring-[#7C3AED]"
          : active ? "bg-white text-[#A87412] shadow-sm focus-visible:ring-[#B88A2A]"
                   : "text-slate-500 hover:bg-white hover:text-slate-700 focus-visible:ring-[#B88A2A]"
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.75} />
      <NotificationDot count={item.notification ?? 0} />
    </Link>
  );
}

// ─── HoyStrip ─────────────────────────────────────────────────────────────────

function HoyStrip({ stats }: { stats: TodayStats }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-[#EAE4D8] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between px-3.5 pb-1.5 pt-2.5">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">Hoy en vivo</span>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
          En vivo
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-[#F0EBE1] border-t border-[#F0EBE1]">
        <div className="flex flex-col items-center py-2.5">
          <span className="text-[17px] font-black leading-none text-[#151515]">{stats.total}</span>
          <span className="mt-0.5 text-[9px] text-[#6F6F6F]">reservas</span>
        </div>
        <div className="flex flex-col items-center py-2.5">
          <span className="text-[17px] font-black leading-none text-green-600">{stats.completed}</span>
          <span className="mt-0.5 text-[9px] text-[#6F6F6F]">completas</span>
        </div>
        <div className="flex flex-col items-center py-2.5">
          <span className="text-[17px] font-black leading-none text-[#B88A2A]">
            {stats.revenue > 0 ? `${stats.revenue}€` : "—"}
          </span>
          <span className="mt-0.5 text-[9px] text-[#6F6F6F]">ingresos</span>
        </div>
      </div>
    </div>
  );
}

// ─── MobileBottomNav ──────────────────────────────────────────────────────────

function MobileBottomNav({
  pathname,
  pendingAppts,
  onOpenMore,
}: {
  pathname: string;
  pendingAppts: number;
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
          const isAgenda = item.href.includes("agenda");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                active
                  ? isStudio ? "text-[#6D28D9] focus-visible:ring-[#7C3AED]"
                             : "text-[#B88A2A] focus-visible:ring-[#B88A2A]"
                  : "text-slate-500 hover:text-slate-800 focus-visible:ring-slate-400"
              }`}
            >
              <span className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.75}
                  aria-hidden="true"
                  className={active ? (isStudio ? "text-[#6D28D9]" : "text-[#B88A2A]") : "text-slate-500"}
                />
                {isAgenda && pendingAppts > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-black text-white">
                    {pendingAppts > 9 ? "9+" : pendingAppts}
                  </span>
                )}
              </span>
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

// ─── BarbershopIdentityRow ────────────────────────────────────────────────────

function BarbershopIdentityRow({ name, planLabel }: { name: string; planLabel: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5">
      {/* Gold avatar with initial */}
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-black text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #B88A2A 0%, #D4AF37 55%, #A87412 100%)" }}
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold leading-tight text-[#151515]">{name}</p>
        <p className="text-[10px] leading-tight text-[#6F6F6F]">Plan {planLabel}</p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname              = usePathname();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Live data state ──
  const [barbershopName, setBarbershopName] = useState("");
  const [planLabel, setPlanLabel]           = useState("Pro");
  const [todayStats, setTodayStats]         = useState<TodayStats | null>(null);
  const [pendingAppts, setPendingAppts]     = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // ── Fetch all sidebar data on mount ──
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );

    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Resolve barbershop_id
        let bsId: string | null = null;
        const { data: member } = await supabase
          .from("barbershop_members")
          .select("barbershop_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (member?.barbershop_id) {
          bsId = member.barbershop_id as string;
        } else {
          const { data: owned } = await supabase
            .from("barbershops")
            .select("id")
            .eq("owner_id", user.id)
            .maybeSingle();
          bsId = (owned?.id as string | undefined) ?? null;
        }
        if (!bsId) return;

        const today = getTodayISO();

        // Parallel fetches: shop name, plan, today appts, pending reviews
        const [shopRes, subRes, todayRes, pendingRes, reviewsRes] = await Promise.all([
          supabase.from("barbershops").select("name").eq("id", bsId).single(),
          supabase
            .from("subscriptions")
            .select("plan_name")
            .eq("barbershop_id", bsId)
            .in("status", ["trial", "active"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("appointments")
            .select("status, services(price)")
            .eq("barbershop_id", bsId)
            .eq("appointment_date", today)
            .in("status", ["scheduled", "pending", "confirmed", "completed"]),
          supabase
            .from("appointments")
            .select("id", { count: "exact", head: true })
            .eq("barbershop_id", bsId)
            .eq("appointment_date", today)
            .in("status", ["pending", "scheduled"]),
          supabase
            .from("reviews")
            .select("id", { count: "exact", head: true })
            .eq("business_id", bsId)
            .eq("status", "pending"),
        ]);

        if (shopRes.data?.name) setBarbershopName(shopRes.data.name as string);

        const rawPlan = subRes.data?.plan_name as string | undefined;
        if (rawPlan) setPlanLabel(PLAN_LABELS[rawPlan] ?? "Pro");

        if (todayRes.data) {
          type ApptRow = { status: string; services: { price: number | null } | null };
          const rows = todayRes.data as unknown as ApptRow[];
          const total     = rows.length;
          const completed = rows.filter((r) => r.status === "completed").length;
          const revenue   = rows
            .filter((r) => r.status === "completed")
            .reduce((sum, r) => sum + (r.services?.price ?? 0), 0);
          setTodayStats({ total, completed, revenue: Math.round(revenue) });
        }

        setPendingAppts(pendingRes.count ?? 0);
        setPendingReviews(reviewsRes.count ?? 0);
      } catch {
        // sidebar data is non-critical — fail silently
      }
    }

    fetchData();
  }, []);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  // ── Nav sections (re-computed when notification counts change) ──
  const sections: NavSection[] = useMemo(() => [
    {
      section: "Negocio",
      items: [
        { icon: CalendarDays, title: "Agenda",   description: "Reservas y disponibilidad", href: "/dashboard/agenda",   notification: pendingAppts },
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
        { icon: Gift,      title: "Fidelización", description: "Programas y recompensas", href: "/dashboard/fidelizacion"               },
        { icon: Star,      title: "Reseñas",      description: "Opiniones y reputación",  href: "/dashboard/resenas", notification: pendingReviews },
        { icon: Megaphone, title: "Promociones",  description: "Ofertas y campañas",      href: "/dashboard/marketing"                  },
      ],
    },
    {
      section: "Cuenta",
      items: [
        { icon: Settings, title: "Ajustes",        description: "Plan, negocio, horarios y facturación",  href: "/dashboard/ajustes",        badge: "Activo", badgeVariant: "green"                    },
        { icon: Sparkles, title: "Créditos Studio", description: "Gestiona créditos para videos IA",      href: "/dashboard/studio/credits", badge: "IA",     badgeVariant: "purple", isAI: true },
        { icon: QrCode,   title: "QR y enlace",    description: "Código QR y link público de reservas",  href: "/dashboard/qr"                                                                           },
      ],
    },
  ], [pendingAppts, pendingReviews]);

  const primaryItems = sections
    .filter((s) => s.section !== "Cuenta")
    .flatMap((s) => s.items);

  return (
    <>
      {/* ── Mobile top header ─────────────────────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#EAE4D8] bg-[#F7F6F2]/97 px-4 shadow-[0_1px_0_#EAE4D8] backdrop-blur-xl md:hidden">
        <Link
          href="/dashboard"
          aria-label="BarberíaOS — Dashboard"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
        >
          <BarberiaOSLogo variant="sidebar" size={28} />
          <div>
            <span className="text-[14px] font-black text-[#151515]">
              Barbería<span className="text-[#B88A2A]">OS</span>
            </span>
            {barbershopName && (
              <p className="text-[10px] leading-none text-[#6F6F6F]">{barbershopName}</p>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-2">
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

      <MobileBottomNav
        pathname={pathname}
        pendingAppts={pendingAppts}
        onOpenMore={() => setDrawerOpen(true)}
      />

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
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
              <p className="text-base font-black text-[#151515]">
                {barbershopName || "Navegación"}
              </p>
              <p className="text-[11px] text-[#6F6F6F]">Plan {planLabel} · BarberíaOS</p>
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

          {/* Hoy strip in drawer */}
          {todayStats !== null && (
            <div className="shrink-0 px-5 pb-3">
              <HoyStrip stats={todayStats} />
            </div>
          )}

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

      {/* ── Desktop sidebar ────────────────────────────────────────────────── */}
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
            {/* Logo + product name */}
            <Link
              href="/dashboard"
              aria-label="BarberíaOS Dashboard"
              className="flex items-center gap-3.5 px-3.5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B88A2A]"
            >
              <BarberiaOSLogo variant="sidebar" size={44} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-black leading-none tracking-tight text-[#151515]">
                    Barbería
                    <span style={{
                      background: "linear-gradient(135deg, #B88A2A 0%, #D4AF37 45%, #B88A2A 80%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>OS</span>
                  </span>
                  <span className="rounded-full border border-[#B88A2A]/35 bg-[#F3E7C9]/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#A87412]">
                    {planLabel}
                  </span>
                </div>
                <span className="mt-0.5 block text-[11px] font-medium text-[#6F6F6F]">Panel premium</span>
              </div>
            </Link>

            {/* ── Identity block — barbershop name + avatar ── */}
            {barbershopName && (
              <>
                <div className="mx-3.5 h-px bg-[#F0EBE1]" aria-hidden="true" />
                <BarbershopIdentityRow name={barbershopName} planLabel={planLabel} />
              </>
            )}
          </div>
        )}

        {/* ── Quick actions ── */}
        {!collapsed && (
          <div className="mb-4 flex flex-col gap-2">
            <Link
              href="/dashboard/agenda?new=1"
              aria-label="Crear nueva reserva"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2.5 text-[12px] font-black text-white transition hover:bg-[#333] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
            >
              <Plus size={13} aria-hidden="true" />
              Nueva reserva
            </Link>
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

        {/* ── Hoy en vivo strip ── */}
        {!collapsed && todayStats !== null && (
          <HoyStrip stats={todayStats} />
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
