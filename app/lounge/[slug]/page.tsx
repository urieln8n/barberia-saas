import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicLoungeData } from "@/src/lib/lounge/get-public-lounge-data";
import { SITE_URL } from "@/src/lib/site-url";
import { LoungePage } from "./LoungePage";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug?.trim();
  if (!slug) return { title: "BarberíaOS Lounge" };

  const data = await getPublicLoungeData(slug);
  if (!data) return { title: "Lounge no encontrado | BarberíaOS" };

  const { barbershop } = data;

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

  const data = await getPublicLoungeData(slug);
  if (!data) notFound();

  const { barbershop, settings, promotions, services } = data;

  // Resolve booking URL
  const bookingUrl = `${SITE_URL}/r/${barbershop.slug}`;

  // Resolve whatsapp URL: lounge_settings.whatsapp_url > derived from phone
  const whatsappUrl = (() => {
    if (settings?.whatsapp_url) return settings.whatsapp_url;
    const phone = barbershop.phone?.replace(/[^\d]/g, "") ?? null;
    if (phone) {
      return `https://wa.me/${phone}?text=${encodeURIComponent(
        `Hola, estoy en ${barbershop.name} y quiero hacer una consulta.`
      )}`;
    }
    return null;
  })();

  // Resolve google review URL: lounge_settings.google_review_url > barbershop.google_business_url
  const googleReviewUrl =
    settings?.google_review_url ?? barbershop.google_business_url ?? null;

  // Resolve visibility flags (default to true if no settings)
  const showBooking = settings?.show_booking ?? true;
  const showReviews = settings?.show_reviews ?? true;
  const showWhatsapp = settings?.show_whatsapp ?? true;
  const showProducts = settings?.show_products ?? true;
  const showPromos = settings?.show_promos ?? true;

  // Resolve welcome text
  const welcomeTitle = settings?.welcome_title ?? null;
  const welcomeDescription = settings?.welcome_description ?? null;

  return (
    <LoungePage
      barbershopName={barbershop.name}
      barbershopSlug={barbershop.slug}
      bookingUrl={bookingUrl}
      whatsappUrl={showWhatsapp ? whatsappUrl : null}
      googleReviewUrl={showReviews ? googleReviewUrl : null}
      services={showProducts ? services : []}
      promotions={showPromos ? promotions : []}
      loungeUrl={`${SITE_URL}/lounge/${barbershop.slug}`}
      showBooking={showBooking}
      welcomeTitle={welcomeTitle}
      welcomeDescription={welcomeDescription}
    />
  );
}
