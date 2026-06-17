import Link from "next/link";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import {
  Eye,
  CalendarCheck,
  MessageCircle,
  Navigation,
  Store,
  Star,
  TrendingUp,
  MapPin,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ShopRow = {
  id: string;
  barbershop_id: string;
  public_name: string;
  city: string | null;
  featured: boolean;
  is_published: boolean;
  marketplace_enabled: boolean;
  priority_score: number;
};

type EventRow = {
  barbershop_id: string;
  event_type: string;
};

type CityRow = {
  city: string;
  count: number;
};

export default async function AdminMarketplacePage() {
  await requirePlatformAdmin();
  const supabase = createServiceRoleClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { data: shops },
    { data: events },
    { count: publishedCount },
  ] = await Promise.all([
    supabase
      .from("barbershop_public_profiles")
      .select("id, barbershop_id, public_name, city, featured, is_published, marketplace_enabled, priority_score")
      .eq("marketplace_enabled", true)
      .eq("is_published", true)
      .order("priority_score", { ascending: false })
      .limit(30),
    supabase
      .from("marketplace_events")
      .select("barbershop_id, event_type")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("barbershop_public_profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .eq("marketplace_enabled", true),
  ]);

  const shopList = (shops ?? []) as ShopRow[];
  const eventList = (events ?? []) as EventRow[];

  // Aggregate events by barbershop
  const byShop = new Map<string, Record<string, number>>();
  for (const ev of eventList) {
    if (!byShop.has(ev.barbershop_id)) byShop.set(ev.barbershop_id, {});
    const m = byShop.get(ev.barbershop_id)!;
    m[ev.event_type] = (m[ev.event_type] ?? 0) + 1;
  }

  // City distribution
  const cityMap = new Map<string, number>();
  for (const ev of eventList) {
    const shop = shopList.find((s) => s.barbershop_id === ev.barbershop_id);
    if (shop?.city) cityMap.set(shop.city, (cityMap.get(shop.city) ?? 0) + 1);
  }
  const topCities: CityRow[] = Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Global totals
  const totalViews        = eventList.filter((e) => e.event_type === "profile_view").length;
  const totalBookingClics = eventList.filter((e) => e.event_type === "booking_click").length;
  const totalWhatsApp     = eventList.filter((e) => e.event_type === "whatsapp_click").length;
  const totalDirections   = eventList.filter((e) => e.event_type === "directions_click").length;
  const featuredCount     = shopList.filter((s) => s.featured).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <ChevronLeft size={15} />
          Admin
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-800">Marketplace</span>
      </div>

      <div>
        <h1 className="text-2xl font-black text-[#080A0F]">Marketplace · Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Últimos 30 días · Solo barberías con marketplace activo</p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard icon={Store}       label="En marketplace" value={publishedCount ?? shopList.length} />
        <KpiCard icon={Star}        label="Destacadas"      value={featuredCount} gold />
        <KpiCard icon={Eye}         label="Visitas"         value={totalViews} />
        <KpiCard icon={CalendarCheck} label="Clic Reservar" value={totalBookingClics} />
        <KpiCard icon={MessageCircle} label="Clic WhatsApp" value={totalWhatsApp} />
        <KpiCard icon={Navigation}  label="Cómo llegar"    value={totalDirections} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">

        {/* Shop table */}
        <section className="rounded-[20px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <p className="font-black text-[#080A0F]">Top barberías</p>
            <span className="text-xs text-slate-400">{shopList.length} mostradas</span>
          </div>
          <div className="divide-y divide-slate-100">
            {shopList.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                No hay barberías en el marketplace todavía.
              </p>
            )}
            {shopList.map((shop) => {
              const evs = byShop.get(shop.barbershop_id) ?? {};
              const views   = evs["profile_view"]    ?? 0;
              const booking = evs["booking_click"]   ?? 0;
              const wa      = evs["whatsapp_click"]  ?? 0;
              const dirs    = evs["directions_click"] ?? 0;
              return (
                <div key={shop.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-600">
                    {shop.public_name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-[#080A0F]">{shop.public_name}</p>
                      {shop.featured && (
                        <Star size={11} fill="currentColor" className="shrink-0 text-[#D5A84C]" />
                      )}
                    </div>
                    {shop.city && (
                      <p className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin size={9} />
                        {shop.city}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-[11px] font-bold tabular-nums text-slate-500">
                    <span title="Visitas" className="flex items-center gap-0.5">
                      <Eye size={10} /> {views}
                    </span>
                    <span title="Reservar clics" className="flex items-center gap-0.5">
                      <CalendarCheck size={10} /> {booking}
                    </span>
                    <span title="WhatsApp clics" className="flex items-center gap-0.5">
                      <MessageCircle size={10} /> {wa}
                    </span>
                    <span title="Cómo llegar" className="flex items-center gap-0.5">
                      <Navigation size={10} /> {dirs}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* City breakdown */}
        <section className="rounded-[20px] border border-slate-200 bg-white shadow-sm self-start">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <TrendingUp size={14} className="text-[#C9922A]" />
            <p className="font-black text-[#080A0F]">Eventos por ciudad</p>
          </div>
          <div className="divide-y divide-slate-100">
            {topCities.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-slate-400">Sin datos todavía</p>
            )}
            {topCities.map((row) => (
              <div key={row.city} className="flex items-center justify-between gap-3 px-5 py-2.5">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#080A0F]">
                  <MapPin size={11} className="text-slate-400" />
                  {row.city}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  gold,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  gold?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${gold ? "bg-[#D5A84C]/10" : "bg-slate-100"}`}>
        <Icon size={14} className={gold ? "text-[#8A641F]" : "text-slate-500"} />
      </div>
      <p className="text-2xl font-black tabular-nums text-[#080A0F]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
