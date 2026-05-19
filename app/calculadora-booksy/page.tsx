import type { Metadata } from "next";
import { SITE_URL } from "@/src/lib/site-url";
import { CalculadoraBooksyClient } from "./CalculadoraBooksyClient";

export const metadata: Metadata = {
  title: "Calculadora de costes para barberías | BarberíaOS",
  description:
    "Calcula el coste mensual de tu sistema de reservas y compara cuotas, comisiones y margen con un modelo fijo para tu barbería.",
  alternates: { canonical: `${SITE_URL}/calculadora-booksy` },
  openGraph: {
    title: "Calculadora de costes para barberías | BarberíaOS",
    description:
      "Calcula tu coste real en Booksy (cuota + comisiones Boost) y compara con BarberíaOS en segundos.",
    url: `${SITE_URL}/calculadora-booksy`,
    type: "website",
    siteName: "BarberíaOS",
  },
};

export default function CalculadoraBooksyPage() {
  return <CalculadoraBooksyClient />;
}
