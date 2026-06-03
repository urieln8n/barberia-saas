import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Software de inventario para barberías | BarberíaOS",
  description:
    "Controla tu stock de productos y venta en mostrador desde BarberíaOS. Sin comisión. Gestiona ceras, champús y tratamientos junto a tu agenda y caja.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/software-inventario-barberia` },
  openGraph: {
    type: "website",
    url: `${BUSINESS_CONFIG.siteUrl}/software-inventario-barberia`,
    title: "Software de inventario para barberías | BarberíaOS",
    description:
      "Control de stock, productos y venta en mostrador integrado con tu agenda y caja. Sin comisión.",
    siteName: BUSINESS_CONFIG.commercialName,
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/software-inventario-barberia`}
      eyebrow="Inventario para barberías"
      h1="Controla tu stock de productos sin hojas de Excel ni sorpresas."
      intro="BarberíaOS integra el control de inventario con la agenda y la caja para que el dueño vea qué se vende, qué queda en stock y cuánto entra por mostrador — todo en el mismo panel."
      benefits={[
        "Registro de productos: ceras, champús, aceites y tratamientos.",
        "Venta en mostrador conectada al cierre de caja diario.",
        "Alertas de stock bajo para reponer a tiempo.",
        "Margen por producto visible junto al rendimiento de servicios.",
      ]}
      sections={[
        {
          title: "Stock integrado",
          text: "Cada producto vendido en mostrador descuenta unidades del inventario y suma al cierre diario sin trabajo manual.",
        },
        {
          title: "Venta en mostrador",
          text: "Registra la venta de productos al finalizar una cita o de forma independiente desde el panel de caja.",
        },
        {
          title: "Panel del dueño",
          text: "Ve de un vistazo qué servicios y productos generan más ingresos para tomar decisiones rápidas.",
        },
      ]}
      faq={[
        {
          q: "¿Puedo controlar el stock de productos junto a la agenda?",
          a: "Sí. BarberíaOS conecta inventario, agenda y caja en un solo panel para que el dueño no necesite sistemas separados.",
        },
        {
          q: "¿Se actualiza el stock automáticamente al vender?",
          a: "Sí. Cada venta en mostrador registrada en caja descuenta automáticamente las unidades del producto correspondiente.",
        },
        {
          q: "¿Sirve para barberías que solo venden servicios?",
          a: "Sí. El módulo de inventario es opcional. Puedes usarlo solo si vendes productos en tu barbería.",
        },
      ]}
    />
  );
}
