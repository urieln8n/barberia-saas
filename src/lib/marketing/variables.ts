export type MarketingVariables = {
  shopName?: string | null;
  bookingUrl?: string | null;
  city?: string | null;
  phone?: string | null;
  selectedServiceName?: string | null;
  selectedBarberName?: string | null;
  clientName?: string | null;
  inactiveClientsCount?: number | null;
  todaySlotsSummary?: string | null;
};

// [NOMBRE] intentionally absent — it's always a per-client manual placeholder
const PLACEHOLDER_MAP: Record<string, keyof MarketingVariables> = {
  "[NOMBRE_BARBERIA]":    "shopName",
  "[LINK_RESERVAS]":      "bookingUrl",
  "[CIUDAD]":             "city",
  "[TELEFONO]":           "phone",
  "[WHATSAPP]":           "phone",
  "[SERVICIO]":           "selectedServiceName",
  "[BARBERO]":            "selectedBarberName",
  "[NOMBRE_CLIENTE]":     "clientName",
  "[CLIENTES_INACTIVOS]": "inactiveClientsCount",
  "[HUECOS_HOY]":         "todaySlotsSummary",
};

export function resolveMarketingTemplate(
  template: string,
  variables: MarketingVariables,
): string {
  let result = template;
  for (const [placeholder, key] of Object.entries(PLACEHOLDER_MAP)) {
    const raw = variables[key];
    if (raw != null) {
      const value = String(raw).trim();
      if (value !== "") result = result.split(placeholder).join(value);
    }
  }
  return result;
}

export function getUnresolvedPlaceholders(text: string): string[] {
  const matches = text.match(/\[[A-Z_]+\]/g) ?? [];
  return [...new Set(matches)];
}
