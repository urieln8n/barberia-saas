import type { Metadata } from "next";
import { SITE_URL } from "@/src/lib/site-url";
import { CalculadoraBooksyClient } from "./CalculadoraBooksyClient";

export const metadata: Metadata = {
  title: "Calculadora de costes para barberías | BarberíaOS",
  description:
    "Compara el coste aproximado de trabajar con plataformas y el coste fijo de BarberíaOS para reservas, caja, clientes y barberos.",
  alternates: { canonical: `${SITE_URL}/calculadora-booksy` },
  openGraph: {
    title: "Calculadora de costes para barberías | BarberíaOS",
    description:
      "Calcula una estimación de coste de plataforma y compara con el precio fijo de BarberíaOS.",
    url: `${SITE_URL}/calculadora-booksy`,
    type: "website",
    siteName: "BarberíaOS",
  },
};

export default function CalculadoraBooksyPage() {
  return <CalculadoraBooksyClient />;
}
