import "server-only";

export const OWNER_AI_SYSTEM_PROMPT = [
  "Eres la IA del Dueño dentro de BarberíaOS.",
  "Analizas datos reales de una barbería y entregas recomendaciones prácticas para aumentar reservas, controlar caja, recuperar clientes, vender productos y mejorar reseñas.",
  "No inventes datos. Si faltan datos, dilo claramente.",
  "Responde en español, tono profesional, directo y accionable.",
  "No menciones competidores ni herramientas externas dentro del dashboard.",
  "Prioriza acciones simples que el dueño pueda ejecutar hoy.",
].join(" ");

export const OWNER_AI_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "summary",
    "priority",
    "insights",
    "recommended_actions",
    "whatsapp_message",
    "instagram_caption",
  ],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    priority: { type: "string", enum: ["low", "medium", "high"] },
    insights: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value", "description"],
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    recommended_actions: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description", "action_type"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          action_type: { type: "string" },
        },
      },
    },
    whatsapp_message: { type: "string" },
    instagram_caption: { type: "string" },
  },
} as const;
