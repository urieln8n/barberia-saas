import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Caja para barberías | BarberíaOS",
  description:
    "Caja para barberías con cobros, productos, propinas, métodos de pago y cierre diario conectado a agenda y barberos.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/caja-para-barberias` },
};

export default function Page() {
  return (
    <SeoLandingPage
      eyebrow="Caja para barberías"
      h1="Controla caja, productos y cierre diario sin hojas sueltas."
      intro="BarberíaOS conecta cada servicio, producto y propina con el día real de trabajo para que el dueño sepa qué entra y de dónde viene."
      benefits={[
        "Registro de cobros por método de pago.",
        "Ventas y propinas vinculadas al cierre diario.",
        "Productos de mostrador visibles como ingresos reales.",
        "Lectura del rendimiento por barbero y por servicio.",
      ]}
      sections={[
        {
          title: "Cierre diario",
          text: "Consulta cuánto entró en servicios, productos y propinas sin reconstruir el día al final de la jornada.",
        },
        {
          title: "Productos",
          text: "Registra venta de ceras, champús, aceites o tratamientos para controlar stock y margen.",
        },
        {
          title: "Panel del dueño",
          text: "Caja, agenda y clientes viven en el mismo sistema para tomar decisiones operativas rápidas.",
        },
      ]}
      faq={[
        {
          q: "¿La caja está separada de la agenda?",
          a: "No. La idea de BarberíaOS es conectar reservas, servicios, barberos, productos y cierre diario.",
        },
        {
          q: "¿Sirve para barberías con varios barberos?",
          a: "Sí. El panel está pensado para controlar equipo, ventas y actividad por persona.",
        },
      ]}
    />
  );
}
