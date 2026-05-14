export type OwnerInsightInput = {
  todayAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  noShows: number;
  freeSlots: number;
  estimatedRevenue: number;
  collectedRevenue: number;
  servicesCompleted: number;
  productsSold: number;
  newClients: number;
  recurrentClients: number;
  dormantClients: number;
  lowStockProducts: number;
  topServiceName: string | null;
  topBarberName: string | null;
};

export type OwnerInsight = {
  title: string;
  value: string;
  description: string;
  tone: "gold" | "blue" | "green" | "amber" | "red" | "neutral";
};

export function formatInsightCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function buildOwnerInsights(input: OwnerInsightInput): OwnerInsight[] {
  const revenueGap = Math.max(input.estimatedRevenue - input.collectedRevenue, 0);
  const hasOperationalRisk = input.noShows > 0 || input.cancelledAppointments > 0;

  return [
    {
      title: "Resumen del dia",
      value: `${input.todayAppointments} citas`,
      description:
        input.todayAppointments > 0
          ? `${input.confirmedAppointments} confirmadas, ${input.pendingAppointments} pendientes y ${input.servicesCompleted} servicios completados.`
          : "Aun no hay citas para hoy. Comparte tu pagina publica o una promo rapida.",
      tone: "gold",
    },
    {
      title: "Clientes en riesgo",
      value: `${input.dormantClients}`,
      description:
        input.dormantClients > 0
          ? "Clientes llevan mas de 45 dias sin volver. Prioriza WhatsApp con una oferta concreta."
          : "No se detectan clientes dormidos con los datos actuales.",
      tone: input.dormantClients > 0 ? "amber" : "green",
    },
    {
      title: "Oportunidad de facturacion",
      value: formatInsightCurrency(revenueGap),
      description:
        input.freeSlots > 0
          ? `Hay ${input.freeSlots} huecos libres. Llenarlos puede acercarte a la caja estimada.`
          : "Hoy no se detectan huecos libres con la disponibilidad actual.",
      tone: input.freeSlots > 0 ? "blue" : "neutral",
    },
    {
      title: "Producto recomendado",
      value: `${input.lowStockProducts} bajo stock`,
      description:
        input.lowStockProducts > 0
          ? "Revisa reposicion antes de perder ventas desde caja."
          : input.productsSold > 0
            ? `${input.productsSold} productos vendidos hoy. Mantiene visible el bloque de retail.`
            : "Cuando vendas productos, la IA priorizara margen y rotacion.",
      tone: input.lowStockProducts > 0 ? "red" : "neutral",
    },
    {
      title: "Promocion sugerida",
      value: input.topServiceName ?? "Sin patron",
      description:
        input.topServiceName
          ? `Empuja ${input.topServiceName} en horas flojas y lista clientes frecuentes para WhatsApp.`
          : "Necesitas mas citas completadas para sugerir una promocion fiable.",
      tone: "green",
    },
    {
      title: "Riesgo operativo",
      value: hasOperationalRisk ? "Atencion" : "Controlado",
      description:
        hasOperationalRisk
          ? `${input.cancelledAppointments} canceladas y ${input.noShows} no-shows. Refuerza recordatorios.`
          : `Sin no-shows relevantes. ${input.topBarberName ?? "El equipo"} puede enfocarse en ticket medio.`,
      tone: hasOperationalRisk ? "red" : "green",
    },
  ];
}

export function buildTodayRecommendation(input: OwnerInsightInput) {
  if (input.freeSlots >= 3) {
    return `Hoy tienes ${input.freeSlots} huecos libres. Lanza una promo por WhatsApp a clientes frecuentes o dormidos.`;
  }

  if (input.dormantClients >= 5) {
    return `Tienes ${input.dormantClients} clientes sin volver hace mas de 45 dias. Prepara una campana de reactivacion.`;
  }

  if (input.lowStockProducts > 0) {
    return `${input.lowStockProducts} productos estan en stock bajo. Reponer hoy evita perder ventas en caja.`;
  }

  if (input.topServiceName) {
    return `El servicio con mas traccion es ${input.topServiceName}. Usalo como gancho para esta semana.`;
  }

  return "Sigue registrando citas, cobros y productos. Con mas actividad BarberiaOS IA afinara recomendaciones.";
}
