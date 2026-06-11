"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSidebarCollapse } from "./sidebar-context";
import { CommandPalette } from "./CommandPalette";
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock,
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
  Tv,
  Users,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── Design tokens ─────────────────────────────────────────────────────────
// Dark: #0D0D0F bg, #D4AF37 gold, #8B5CF6 violet
// Text: white/85 → white/45 → white/20
// Border: white/6. Active bg: white/7

// ─── Types ─────────────────────────────────────────────────────────────────
type NavItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  badgeVariant?: "gold" | "purple" | "green" | "slate";
  exact?: boolean;
  isAI?: boolean;
  notification?: number;
};

type NavSection  = { section: string; items: NavItem[] };
type TodayStats  = { total: number; completed: number; revenue: number };
type NextAppt    = { time: string; clientName: string; serviceName: string };

// ─── Constants ─────────────────────────────────────────────────────────────
const MOBILE_QUICK = [
  { href: "/dashboard",        label: "Inicio",  icon: Home,        exact: true  } as const,
  { href: "/dashboard/agenda", label: "Agenda",  icon: CalendarDays              } as const,
  { href: "/dashboard/caja",   label: "Caja",    icon: Banknote                  } as const,
  { href: "/dashboard/studio", label: "Studio",  icon: Clapperboard              } as const,
];

const PLAN_LABELS: Record<string, string> = {
  free: "Starter", starter: "Starter", pro: "Profesional", growth: "Growth", premium: "Premium",
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function isActive(pathname: string, item: { href: string; exact?: boolean }): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function minutesUntil(timeHHMM: string): number {
  const [h, m] = timeHHMM.split(":").map(Number);
  const now = new Date();
  return h * 60 + m - (now.getHours() * 60 + now.getMinutes());
}

function getOpenKey(bsId: string) {
  return `bs_open_${bsId}_${getTodayISO()}`;
}

// ─── SidebarNavItem ─────────────────────────────────────────────────────────
function SidebarNavItem({
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

  const accentColor   = item.isAI ? "#8B5CF6" : "#D4AF37";
  const activeIconBg  = item.isAI ? "bg-[#7C3AED]/[0.15]" : "bg-[#D4AF37]/[0.12]";
  const activeIconCls = item.isAI ? "text-[#A78BFA]"      : "text-[#E5C04C]";
  const activeLabelCls= item.isAI ? "text-[#C4B5FD]"      : "text-white/85";

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={item.description}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-[12.5px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset ${
        item.isAI ? "focus-visible:ring-[#7C3AED]" : "focus-visible:ring-[#D4AF37]/50"
      } ${active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
    >
      {active && (
        <span
          className="absolute left-0 top-2 h-5 w-[2px] rounded-r-full"
          style={{ background: accentColor }}
          aria-hidden="true"
        />
      )}

      <span
        className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
          active ? activeIconBg : "group-hover:bg-white/[0.06]"
        }`}
      >
        <Icon
          size={14}
          strokeWidth={active ? 2.2 : 1.75}
          className={
            active
              ? activeIconCls
              : "text-white/30 transition-colors group-hover:text-white/55"
          }
        />
        {(item.notification ?? 0) > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-black text-white ring-1 ring-[#0D0D0F]">
            {(item.notification ?? 0) > 9 ? "9+" : item.notification}
          </span>
        )}
      </span>

      <span
        className={`flex-1 truncate leading-none ${
          active
            ? activeLabelCls
            : "text-white/45 transition-colors group-hover:text-white/70"
        }`}
      >
        {item.title}
      </span>

      {item.badge && (
        <span
          className={`flex h-[18px] min-w-[28px] shrink-0 items-center justify-center rounded-full px-1.5 text-[9px] font-bold tracking-wide ${
            item.badgeVariant === "purple"
              ? "bg-[#7C3AED]/15 text-[#A78BFA]"
              : item.badgeVariant === "green"
              ? "bg-emerald-500/12 text-emerald-400"
              : "bg-[#D4AF37]/12 text-[#D4AF37]"
          }`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── SidebarSection ─────────────────────────────────────────────────────────
function SidebarSection({
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
    <div className="flex flex-col gap-0.5">
      <p className="mb-0.5 px-2 text-[9px] font-bold uppercase tracking-[0.1em] text-white/20">
        {section}
      </p>
      {items.map((item) => (
        <SidebarNavItem key={item.href} item={item} pathname={pathname} onClick={onItemClick} />
      ))}
    </div>
  );
}

// ─── IconNavLink (collapsed) ────────────────────────────────────────────────
function IconNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon   = item.icon;
  const active = isActive(pathname, item);

  const activeIconBg  = item.isAI ? "bg-[#7C3AED]/[0.15]" : "bg-[#D4AF37]/[0.1]";
  const activeIconCls = item.isAI ? "text-[#A78BFA]"       : "text-[#E5C04C]";

  return (
    <Link
      href={item.href}
      title={`${item.title} — ${item.description}`}
      aria-label={item.title}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
        item.isAI ? "focus-visible:ring-[#7C3AED]" : "focus-visible:ring-[#D4AF37]/50"
      } ${active ? `${activeIconBg} ${activeIconCls}` : "text-white/30 hover:bg-white/[0.05] hover:text-white/60"}`}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.75} aria-hidden="true" />
      {(item.notification ?? 0) > 0 && (
        <span
          className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-1 ring-[#0D0D0F]"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

// ─── HoyStrip ───────────────────────────────────────────────────────────────
function HoyStrip({ stats }: { stats: TodayStats | null }) {
  const loading = stats === null;
  const shimmer = "h-4 w-8 animate-pulse rounded bg-white/[0.08]";

  return (
    <div className="mb-2 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04]">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20">
          Hoy
        </span>
        <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
          En vivo
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
        <div className="flex flex-col items-center py-2.5">
          {loading
            ? <span className={shimmer} />
            : <span className="text-[15px] font-black leading-none text-white/80">{stats.total}</span>}
          <span className="mt-0.5 text-[9px] text-white/25">citas</span>
        </div>
        <div className="flex flex-col items-center py-2.5">
          {loading
            ? <span className={shimmer} />
            : <span className="text-[15px] font-black leading-none text-emerald-400">{stats.completed}</span>}
          <span className="mt-0.5 text-[9px] text-white/25">hechas</span>
        </div>
        <div className="flex flex-col items-center py-2.5">
          {loading
            ? <span className={shimmer} />
            : <span className="text-[15px] font-black leading-none text-[#E5C04C]">
                {stats.revenue > 0 ? `${stats.revenue}€` : "—"}
              </span>}
          <span className="mt-0.5 text-[9px] text-white/25">caja</span>
        </div>
      </div>
    </div>
  );
}

// ─── ProximaCitaCard ────────────────────────────────────────────────────────
function ProximaCitaCard({ appt, loaded }: { appt: NextAppt | null; loaded: boolean }) {
  const minsLeft = appt ? minutesUntil(appt.time) : 0;
  const imminent = appt !== null && minsLeft > 0 && minsLeft <= 10;
  const soon     = appt !== null && minsLeft > 0 && minsLeft <= 30;

  const cardBorder = imminent
    ? "border-red-500/20 bg-red-500/[0.05]"
    : soon
    ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.04]"
    : "border-white/[0.06] bg-white/[0.03]";

  const dotCls    = imminent ? "bg-red-500 animate-pulse"   : soon ? "bg-[#D4AF37] animate-pulse" : "bg-white/20";
  const timeColor = imminent ? "text-red-400"               : soon ? "text-[#E5C04C]"              : "text-white/30";

  return (
    <div className={`mb-2 overflow-hidden rounded-xl border p-3 transition-colors ${cardBorder}`}>
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20">
          Próxima cita
        </p>
        {appt && minsLeft > 0 && (
          <span className={`flex items-center gap-1 text-[9px] font-semibold ${timeColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotCls}`} aria-hidden="true" />
            {minsLeft < 60
              ? `${minsLeft} min`
              : `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m`}
          </span>
        )}
      </div>

      {!loaded ? (
        <div className="mt-2 space-y-1.5">
          <div className="h-3.5 w-28 animate-pulse rounded bg-white/[0.08]" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.06]" />
        </div>
      ) : appt ? (
        <div className="mt-1.5">
          <p className="text-[13px] font-bold leading-tight text-white/80">
            {appt.time} · {appt.clientName}
          </p>
          {appt.serviceName && (
            <p className="mt-0.5 truncate text-[11px] text-white/30">{appt.serviceName}</p>
          )}
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-white/25">Sin citas pendientes hoy</p>
      )}
    </div>
  );
}

// ─── OpenCloseToggle ────────────────────────────────────────────────────────
function OpenCloseToggle({
  isOpen,
  onToggle,
  disabled,
}: {
  isOpen: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isOpen ? "Marcar barbería como cerrada hoy" : "Marcar barbería como abierta hoy"}
      className={`mb-1.5 flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
        disabled
          ? "cursor-not-allowed opacity-25 border-white/[0.06] bg-transparent"
          : isOpen
          ? "border-emerald-500/20 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1]"
          : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full transition-colors ${isOpen ? "bg-emerald-500" : "bg-white/20"}`}
        aria-hidden="true"
      />
      <span
        className={`flex-1 text-left text-[11px] font-semibold transition-colors ${isOpen ? "text-emerald-400" : "text-white/25"}`}
      >
        {isOpen ? "Abierto hoy" : "Cerrado hoy"}
      </span>
      <span
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${isOpen ? "bg-emerald-500/40" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${isOpen ? "translate-x-3" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}

// ─── BarbershopIdentityRow ──────────────────────────────────────────────────
function BarbershopIdentityRow({ name, planLabel }: { name: string; planLabel: string }) {
  const loading = !name;
  const initial = name ? name.charAt(0).toUpperCase() : "B";

  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-[#0D0D0F]"
        style={{
          background: "linear-gradient(135deg, #D4AF37 0%, #F0C92A 55%, #B8941A 100%)",
        }}
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        {loading ? (
          <span className="block h-3 w-24 animate-pulse rounded bg-white/[0.08]" />
        ) : (
          <p className="truncate text-[11px] font-semibold leading-tight text-white/65">
            {name}
          </p>
        )}
        <p className="mt-0.5 text-[9.5px] leading-tight text-white/25">Plan {planLabel}</p>
      </div>
    </div>
  );
}

// ─── MobileBottomNav ────────────────────────────────────────────────────────
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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.07] bg-[#0D0D0F]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_QUICK.map((item) => {
          const Icon     = item.icon;
          const active   = isActive(pathname, item);
          const isStudio = item.href.includes("studio");
          const isAgenda = item.href.includes("agenda");
          const activeColor = isStudio ? "text-[#A78BFA]" : "text-[#E5C04C]";

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
                active
                  ? `${activeColor} focus-visible:ring-[#D4AF37]/50`
                  : "text-white/30 hover:text-white/60 focus-visible:ring-white/20"
              }`}
            >
              <span className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.75}
                  aria-hidden="true"
                  className={active ? activeColor : "text-white/30"}
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
          className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold text-white/30 transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0"
        >
          <MoreHorizontal size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>Más</span>
        </button>
      </div>
    </nav>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname              = usePathname();
  const { collapsed, toggle } = useSidebarCollapse();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [barbershopId, setBarbershopId]   = useState<string | null>(null);
  const [barbershopName, setBarbershopName] = useState("");
  const [planLabel, setPlanLabel]           = useState("Pro");
  const [todayStats, setTodayStats]         = useState<TodayStats | null>(null);
  const [nextAppt, setNextAppt]             = useState<NextAppt | null>(null);
  const [apptLoaded, setApptLoaded]         = useState(false);
  const [pendingAppts, setPendingAppts]     = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [isOpen, setIsOpen]                 = useState(true);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (!barbershopId) return;
    const stored = localStorage.getItem(getOpenKey(barbershopId));
    if (stored === "false") setIsOpen(false);
  }, [barbershopId]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );

    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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
        setBarbershopId(bsId);

        const today = getTodayISO();

        const [shopRes, subRes, todayRes, pendingRes, reviewsRes] = await Promise.allSettled([
          supabase.from("barbershops").select("name").eq("id", bsId).single(),
          supabase.from("subscriptions").select("plan_name").eq("barbershop_id", bsId).in("status", ["trial", "active"]).order("created_at", { ascending: false }).limit(1).maybeSingle(),
          supabase.from("appointments").select("status, start_time, clients(name), services(name, price)").eq("barbershop_id", bsId).eq("appointment_date", today).in("status", ["scheduled", "confirmed", "completed"]).order("start_time", { ascending: true }),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("barbershop_id", bsId).eq("appointment_date", today).eq("status", "scheduled"),
          supabase.from("reviews").select("id", { count: "exact", head: true }).eq("barbershop_id", bsId).eq("status", "pending"),
        ]);

        if (shopRes.status === "fulfilled" && shopRes.value.data?.name) {
          setBarbershopName(shopRes.value.data.name as string);
        }

        if (subRes.status === "fulfilled") {
          const rawPlan = subRes.value.data?.plan_name as string | undefined;
          if (rawPlan) setPlanLabel(PLAN_LABELS[rawPlan] ?? "Pro");
        }

        if (todayRes.status === "fulfilled" && todayRes.value.data) {
          type ApptRow = {
            status: string;
            start_time: string;
            clients: { name: string } | null;
            services: { name: string; price: number | null } | null;
          };
          const rows = todayRes.value.data as unknown as ApptRow[];

          const total     = rows.length;
          const completed = rows.filter((r) => r.status === "completed").length;
          const revenue   = rows
            .filter((r) => r.status === "completed")
            .reduce((s, r) => s + (r.services?.price ?? 0), 0);
          setTodayStats({ total, completed, revenue: Math.round(revenue) });

          const nowHHMM = new Date().toTimeString().slice(0, 5);
          const upcoming = rows.find(
            (r) =>
              ["scheduled", "confirmed"].includes(r.status) &&
              r.start_time.slice(0, 5) >= nowHHMM
          );
          setNextAppt(
            upcoming
              ? {
                  time: upcoming.start_time.slice(0, 5),
                  clientName: upcoming.clients?.name ?? "Cliente",
                  serviceName: upcoming.services?.name ?? "",
                }
              : null
          );
        }
        setApptLoaded(true);

        if (pendingRes.status === "fulfilled") setPendingAppts(pendingRes.value.count ?? 0);
        if (reviewsRes.status === "fulfilled") setPendingReviews(reviewsRes.value.count ?? 0);
      } catch {
        setApptLoaded(true);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function toggleOpen() {
    const next = !isOpen;
    setIsOpen(next);
    if (barbershopId) localStorage.setItem(getOpenKey(barbershopId), next ? "true" : "false");
  }

  // ── Nav sections ──
  const sections: NavSection[] = useMemo(
    () => [
      {
        section: "Negocio",
        items: [
          { icon: Home,         title: "Dashboard",     description: "Resumen general del negocio",    href: "/dashboard",              exact: true                },
          { icon: CalendarDays, title: "Agenda",         description: "Reservas y disponibilidad",      href: "/dashboard/agenda",       notification: pendingAppts },
          { icon: Clock,        title: "Sala de espera", description: "Cola de turnos en tiempo real",  href: "/dashboard/sala-espera"                             },
          { icon: Tv,           title: "Lounge",          description: "Pantalla de sala y promociones", href: "/dashboard/lounge"                                  },
          { icon: Users,        title: "Clientes",        description: "Historial y seguimiento",        href: "/dashboard/clientes"                                },
          { icon: Scissors,     title: "Barberos",        description: "Equipo y comisiones",            href: "/dashboard/barberos"                                },
          { icon: Banknote,     title: "Caja",            description: "Cobros y ventas",                href: "/dashboard/caja"                                    },
        ],
      },
      {
        section: "Crecimiento",
        items: [
          { icon: Wand2,     title: "Studio IA",    description: "Contenido y videos automáticos", href: "/dashboard/studio",       badge: "NUEVO", badgeVariant: "purple", isAI: true },
          { icon: Gift,      title: "Fidelización", description: "Programas y recompensas",        href: "/dashboard/fidelizacion"                                                       },
          { icon: Star,      title: "Reseñas",      description: "Opiniones y reputación",         href: "/dashboard/resenas",      notification: pendingReviews                        },
          { icon: Megaphone, title: "Promociones",  description: "Ofertas y campañas",             href: "/dashboard/marketing"                                                          },
        ],
      },
      {
        section: "Cuenta",
        items: [
          { icon: Settings, title: "Ajustes",          description: "Plan, negocio, horarios y facturación", href: "/dashboard/ajustes",        badge: "Activo", badgeVariant: "green"                    },
          { icon: Sparkles, title: "Créditos Studio",   description: "Gestiona créditos para videos IA",     href: "/dashboard/studio/credits", badge: "IA",     badgeVariant: "purple", isAI: true },
          { icon: QrCode,   title: "QR y enlace",      description: "Código QR y link público de reservas", href: "/dashboard/qr"                                                                           },
        ],
      },
    ],
    [pendingAppts, pendingReviews]
  );

  const primaryItems = sections
    .filter((s) => s.section !== "Cuenta")
    .flatMap((s) => s.items);

  return (
    <>
      {/* ── Mobile top header ─────────────────────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#0D0D0F]/95 px-4 backdrop-blur-xl md:hidden">
        <Link
          href="/dashboard"
          aria-label="BarberíaOS — Dashboard"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
        >
          <BarberiaOSLogo variant="sidebar" size={28} />
          <div>
            <span className="text-[14px] font-black tracking-tight text-white">
              Barbería<span style={{ color: "#D4AF37" }}>OS</span>
            </span>
            {barbershopName && (
              <p className="text-[10px] leading-none text-white/30">{barbershopName}</p>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/agenda?new=1"
            aria-label="Nueva reserva"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] px-3 text-[12px] font-bold text-[#E5C04C] transition hover:bg-[#D4AF37]/[0.14] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
          >
            <Plus size={13} aria-hidden="true" />
            <span>Reserva</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] text-white/30 transition hover:border-red-500/20 hover:bg-red-500/[0.07] hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
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
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          tabIndex={drawerOpen ? 0 : -1}
        />
        <aside
          className={`absolute bottom-0 left-0 right-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[24px] border-t border-white/[0.08] bg-[#0D0D0F] shadow-[0_-32px_80px_rgba(0,0,0,0.7)] transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/[0.1]" aria-hidden="true" />
          <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
            <div>
              <p className="text-[15px] font-black text-white/85">
                {barbershopName || "Menú"}
              </p>
              <p className="text-[11px] text-white/30">Plan {planLabel} · BarberíaOS</p>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/35 transition hover:border-white/[0.14] hover:text-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="shrink-0 px-4 pb-3">
            <HoyStrip stats={todayStats} />
          </div>
          <div className="flex shrink-0 gap-2 px-4 pb-4">
            <Link
              href="/dashboard/agenda?new=1"
              onClick={() => setDrawerOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] py-2.5 text-[12px] font-bold text-[#E5C04C] transition hover:bg-[#D4AF37]/[0.14] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            >
              <Plus size={12} aria-hidden="true" /> Nueva reserva
            </Link>
            <Link
              href="/dashboard/studio?type=fill_empty_slots"
              onClick={() => setDrawerOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] py-2.5 text-[12px] font-bold text-white transition hover:from-[#4C1D95] hover:to-[#6D28D9] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]/50"
            >
              <Clapperboard size={12} aria-hidden="true" /> Studio IA
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-4">
              {sections.map((s) => (
                <SidebarSection
                  key={s.section}
                  section={s.section}
                  items={s.items}
                  pathname={pathname}
                  onItemClick={() => setDrawerOpen(false)}
                />
              ))}
            </div>
          </div>
          <div className="shrink-0 border-t border-white/[0.06] px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={async () => {
                setDrawerOpen(false);
                await handleLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[12.5px] font-medium text-white/30 transition hover:bg-red-500/[0.07] hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
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
        className={`fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-white/[0.06] bg-[#0D0D0F] transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-16 px-2 py-4" : "w-[248px] px-3 py-4"
        }`}
      >
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.1] bg-[#1A1A1E] shadow-md transition hover:border-white/[0.18] hover:bg-[#222226] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
        >
          {collapsed
            ? <ChevronRight size={11} className="text-white/35" aria-hidden="true" />
            : <ChevronLeft  size={11} className="text-white/35" aria-hidden="true" />}
        </button>

        {/* ── Brand header ── */}
        {collapsed ? (
          <div className="mb-4 flex justify-center">
            <Link
              href="/dashboard"
              aria-label="BarberíaOS — Dashboard"
              className="rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            >
              <BarberiaOSLogo variant="sidebar" size={36} />
            </Link>
          </div>
        ) : (
          <div className="mb-4">
            <Link
              href="/dashboard"
              aria-label="BarberíaOS Dashboard"
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            >
              <BarberiaOSLogo variant="sidebar" size={30} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14.5px] font-black leading-none tracking-tight text-white">
                    Barbería<span style={{ color: "#D4AF37" }}>OS</span>
                  </span>
                  <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {planLabel}
                  </span>
                </div>
              </div>
            </Link>
            <div className="mt-1 overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]">
              <BarbershopIdentityRow name={barbershopName} planLabel={planLabel} />
            </div>
          </div>
        )}

        {/* ── Quick actions ── */}
        {!collapsed && (
          <div className="mb-3 flex gap-1.5">
            <Link
              href="/dashboard/agenda?new=1"
              aria-label="Crear nueva reserva"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] py-2 text-[11px] font-bold text-[#E5C04C] transition hover:bg-[#D4AF37]/[0.13] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            >
              <Plus size={12} aria-hidden="true" /> Nueva cita
            </Link>
            <Link
              href="/dashboard/studio?type=fill_empty_slots"
              aria-label="Crear video con Studio IA"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#7C3AED]/25 bg-[#5B21B6]/30 py-2 text-[11px] font-bold text-[#C4B5FD] transition hover:bg-[#5B21B6]/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]/50"
            >
              <Clapperboard size={12} aria-hidden="true" /> Studio IA
            </Link>
          </div>
        )}

        {/* ── ⌘K Search ── */}
        {!collapsed && <CommandPalette barbershopId={barbershopId} />}

        {/* ── Today stats ── */}
        {!collapsed && <HoyStrip stats={todayStats} />}

        {/* ── Next appointment ── */}
        {!collapsed && <ProximaCitaCard appt={nextAppt} loaded={apptLoaded} />}

        {/* ── Navigation ── */}
        {collapsed ? (
          <nav
            aria-label="Navegación principal"
            className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Link
              href="/dashboard/agenda?new=1"
              aria-label="Nueva reserva"
              className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] text-[#E5C04C] transition hover:bg-[#D4AF37]/[0.13] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            >
              <Plus size={15} aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard/studio?type=fill_empty_slots"
              aria-label="Crear video IA"
              className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-[#7C3AED]/25 bg-[#5B21B6]/30 text-[#C4B5FD] transition hover:bg-[#5B21B6]/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]/50"
            >
              <Clapperboard size={15} aria-hidden="true" />
            </Link>
            <div className="my-1 h-px w-6 rounded-full bg-white/[0.06]" aria-hidden="true" />
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
              <SidebarSection
                key={s.section}
                section={s.section}
                items={s.items}
                pathname={pathname}
              />
            ))}
          </nav>
        )}

        {/* ── Footer ── */}
        {collapsed ? (
          <div className="mt-3 flex flex-col items-center gap-1 border-t border-white/[0.06] pt-3">
            <button
              type="button"
              onClick={toggleOpen}
              aria-label={isOpen ? "Abierto — marcar como cerrado" : "Cerrado — marcar como abierto"}
              title={isOpen ? "Abierto hoy" : "Cerrado hoy"}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors ${isOpen ? "bg-emerald-500" : "bg-white/15"}`}
                aria-hidden="true"
              />
            </button>
            <Link
              href="/dashboard/soporte"
              aria-label="Soporte"
              title="Soporte — Ayuda y contacto"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/25 transition hover:bg-white/[0.05] hover:text-white/55 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            >
              <HelpCircle size={15} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/25 transition hover:bg-red-500/[0.08] hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
            >
              <LogOut size={15} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            <OpenCloseToggle isOpen={isOpen} onToggle={toggleOpen} disabled={!barbershopId} />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12.5px] font-medium text-white/25 transition hover:bg-red-500/[0.07] hover:text-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
            >
              <LogOut size={14} className="shrink-0" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        )}

        {collapsed && <CommandPalette barbershopId={barbershopId} />}
      </aside>
    </>
  );
}
