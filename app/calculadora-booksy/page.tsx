import type { Metadata } from "next";
import { SITE_URL } from "@/src/lib/site-url";
import { CalculadoraBooksyClient } from "./CalculadoraBooksyClient";

export const metadata: Metadata = {
  title: "Calculadora Booksy: ¿Cuánto te cobra de verdad? | BarberíaOS",
  description:
    "Calcula exactamente cuánto te está costando Booksy entre cuota mensual y comisiones Boost. Introduce tus datos y descubre cuánto ahorrarías con BarberíaOS.",
  alternates: { canonical: `${SITE_URL}/calculadora-booksy` },
  openGraph: {
    title: "Calculadora Booksy: ¿Cuánto te cobra de verdad?",
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
