import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  MessageCircle,
  Package,
  Scissors,
  Share2,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { SITE_URL } from "@/src/lib/site-url";
import { LoungePage } from "./LoungePage";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

async function getBarbershopBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("barbershops")
    .select("id, name, slug, phone, address, city, instagram_url, google_business_url")
    .eq("slug", slug)
    .maybeSingle();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug?.trim();
  if (!slug) return { title: "BarberíaOS Lounge" };

  const { data: barbershop } = await getBarbershopBySlug(slug);
  if (!barbershop) return { title: "Lounge no encontrado | BarberíaOS" };

  return {
    title: `${barbershop.name} · Lounge`,
    description: `Mientras esperas en ${barbershop.name}, descubre más: reserva tu próxima cita, explora productos y servicios premium.`,
    alternates: { canonical: `/lounge/${barbershop.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/lounge/${barbershop.slug}`,
      title: `${barbershop.name} · Lounge`,
      description: `Mientras esperas en ${barbershop.name}, descubre más. Powered by BarberíaOS.`,
      siteName: "BarberíaOS",
    },
  };
}

export default async function PublicLoungePage({ params }: Props) {
  const slug = params.slug?.trim();
  if (!slug) notFound();

  const { data: barbershop, error } = await getBarbershopBySlug(slug);
  if (error || !barbershop) notFound();

  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes")
    .eq("barbershop_id", barbershop.id)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .limit(6);

  const bookingUrl = `${SITE_URL}/r/${barbershop.slug}`;
  const whatsappPhone = barbershop.phone?.replace(/[^\d]/g, "") ?? null;
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hola, estoy en ${barbershop.name} y quiero hacer una consulta.`)}`
    : null;
  const googleReviewUrl = barbershop.google_business_url ?? null;

  return (
    <LoungePage
      barbershopName={barbershop.name}
      barbershopSlug={barbershop.slug}
      bookingUrl={bookingUrl}
      whatsappUrl={whatsappUrl}
      googleReviewUrl={googleReviewUrl}
      services={(services ?? []) as { id: string; name: string; price: number; duration_minutes: number }[]}
      loungeUrl={`${SITE_URL}/lounge/${barbershop.slug}`}
    />
  );
}
