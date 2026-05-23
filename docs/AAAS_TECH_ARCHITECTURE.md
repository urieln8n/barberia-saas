# BarberíaOS — Arquitectura Técnica de Agentes IA
**AaaS Technical Architecture**
Fecha: 2026-05-23

---

## Principios de diseño

1. **Seguridad primero:** Los agentes nunca acceden a Supabase directamente.
   Siempre a través de funciones seguras con `barbershop_id` validado.
2. **Sin dependencias nuevas en V1:** Fase 1 no requiere instalar nada nuevo.
   Usa `src/lib/ai/` existente para generación de texto.
3. **Escalable:** La arquitectura de Fase 1 es un subset de Fase 2-3.
   Añadir autonomía = añadir cron + webhooks, no reescribir.
4. **Reversible:** Cada agente puede activarse/desactivarse por barbería sin
   afectar el resto del sistema.
5. **Trazable:** Todas las acciones de agentes se registran en `agent_logs`.

---

## Estructura de directorios propuesta

```
src/lib/agents/
├── index.ts                    # Registry de agentes disponibles
├── types.ts                    # AgentDefinition, AgentRun, AgentResult
├── registry.ts                 # getAgent(id), listAgents(), getAgentsByPlan()
│
├── tools/                      # Funciones seguras que usan los agentes
│   ├── appointments.ts         # checkAvailability, getFreeSlots, getCompletedToday
│   ├── clients.ts              # getLostClients, getClientHistory
│   ├── services.ts             # getTopServices, getServiceCatalog
│   ├── barbershop.ts           # getBarbershopContext, getPublicBookingUrl
│   ├── cash.ts                 # getDailySummary, analyzeCashTrends
│   └── content.ts              # generateText, generateWhatsAppMessage, generatePost
│
├── agents/
│   ├── retencion.ts            # Agente Retención IA
│   ├── huecos.ts               # Agente Huecos Libres IA
│   ├── resenas.ts              # Agente Reseñas IA
│   ├── recepcionista.ts        # Agente Recepcionista IA
│   ├── marketing.ts            # Agente Marketing Studio IA
│   ├── caja.ts                 # Agente Caja & Finanzas IA
│   ├── seo.ts                  # Agente SEO & Presencia Local IA
│   ├── whatsapp.ts             # Agente WhatsApp Business IA
│   └── inventario.ts           # Agente Inventario & Ventas IA
│
└── runner.ts                   # runAgent(agentId, barbershopId, context)
```

---

## Tipos core

```typescript
// src/lib/agents/types.ts

export type AgentPhase = "copilot" | "semi-auto" | "autonomous";
export type AgentStatus = "active" | "inactive" | "pending" | "error";
export type AgentPlan = "starter" | "growth" | "premium";

export type AgentDefinition = {
  id: string;
  name: string;
  nickname: string;
  description: string;
  longDescription: string;
  icon: string;                    // Lucide icon name
  phase: AgentPhase;               // Current phase in product
  availableFrom: AgentPlan;        // Minimum plan required
  requiredTools: string[];         // Tool IDs this agent uses
  outputType: "text" | "action" | "campaign";
  tags: string[];
};

export type AgentContext = {
  barbershopId: string;
  barbershopName: string | null;
  barbershopSlug: string | null;
  plan: AgentPlan;
  date: string;                    // ISO date string
};

export type AgentResult = {
  agentId: string;
  barbershopId: string;
  timestamp: string;
  status: "success" | "error" | "no_action";
  summary: string;                 // Short summary for UI
  actions: AgentAction[];          // List of suggested or executed actions
  metadata: Record<string, unknown>;
};

export type AgentAction = {
  id: string;
  type: "copy_text" | "send_message" | "create_campaign" | "update_record";
  label: string;                   // Human-readable: "Enviar WhatsApp a Carlos"
  payload: string | Record<string, unknown>;
  executed: boolean;
  executedAt?: string;
};
```

---

## Herramientas seguras (Tools)

Cada tool es una función pura que:
- Recibe `barbershopId` como primer parámetro (multi-tenant seguro)
- Accede a Supabase a través del server client con RLS activo
- Nunca expone datos de otras barberías
- Retorna datos tipados

```typescript
// src/lib/agents/tools/clients.ts

import { createClient } from "@/src/lib/supabase/server";

export async function getLostClients(
  barbershopId: string,
  daysSinceVisit: number = 30
) {
  const supabase = await createClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysSinceVisit);

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, phone, email, last_visit_at")
    .eq("barbershop_id", barbershopId)
    .lt("last_visit_at", cutoff.toISOString())
    .not("last_visit_at", "is", null)
    .order("last_visit_at", { ascending: true })
    .limit(20);

  if (error) throw error;
  return data ?? [];
}

export async function getClientHistory(
  barbershopId: string,
  clientId: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("id, date, service_id, services(name, price)")
    .eq("barbershop_id", barbershopId)
    .eq("client_id", clientId)
    .order("date", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data ?? [];
}
```

```typescript
// src/lib/agents/tools/appointments.ts

export async function getFreeSlots(
  barbershopId: string,
  date: string    // "YYYY-MM-DD"
): Promise<{ barberId: string; barberName: string; time: string }[]> {
  // Compara slots de horario con citas existentes
  // Retorna huecos libres del día
  // (implementación usa lógica existente de src/lib/booking/)
}

export async function checkAvailability(
  barbershopId: string,
  date: string,
  serviceId?: string
): Promise<boolean> { ... }

export async function getCompletedAppointmentsToday(
  barbershopId: string
): Promise<Appointment[]> { ... }
```

---

## Agente Retención — implementación de referencia

```typescript
// src/lib/agents/agents/retencion.ts

import { getLostClients } from "../tools/clients";
import type { AgentContext, AgentResult } from "../types";

export async function runRetencionAgent(
  context: AgentContext
): Promise<AgentResult> {
  const lostClients = await getLostClients(context.barbershopId, 30);

  if (lostClients.length === 0) {
    return {
      agentId: "retencion",
      barbershopId: context.barbershopId,
      timestamp: new Date().toISOString(),
      status: "no_action",
      summary: "No hay clientes en riesgo hoy.",
      actions: [],
      metadata: { checkedAt: new Date().toISOString() },
    };
  }

  const actions = lostClients.map((client) => {
    const days = Math.floor(
      (Date.now() - new Date(client.last_visit_at!).getTime()) / 86400000
    );
    const message = generateRetentionMessage(
      client.name,
      days,
      context.barbershopName ?? "tu barbería"
    );
    return {
      id: `retention-${client.id}`,
      type: "copy_text" as const,
      label: `Recuperar a ${client.name} (${days} días sin venir)`,
      payload: message,
      executed: false,
    };
  });

  return {
    agentId: "retencion",
    barbershopId: context.barbershopId,
    timestamp: new Date().toISOString(),
    status: "success",
    summary: `${lostClients.length} clientes en riesgo. Mensajes listos para enviar.`,
    actions,
    metadata: { clientCount: lostClients.length },
  };
}

function generateRetentionMessage(
  name: string,
  daysSince: number,
  barbershopName: string
): string {
  const templates = [
    `Hola ${name} 👋 Te echamos de menos en ${barbershopName}. Llevamos ${daysSince} días sin verte. ¿Te apetece un corte esta semana? Reserva aquí: {{booking_url}}`,
    `${name}, hace ${daysSince} días que no te vemos por aquí. ¿Ya toca corte? Te guardamos tu hueco favorito 💈 Reserva: {{booking_url}}`,
    `Hola ${name}! Han pasado ${daysSince} días. En ${barbershopName} tenemos huecos esta semana. ¿Te animás? {{booking_url}}`,
  ];
  return templates[daysSince % templates.length];
}
```

---

## Tablas de base de datos adicionales (Fase 2)

> **Fase 1 no requiere ninguna migración.** Las siguientes tablas son para Fase 2.
> Crear SOLO cuando se implemente Fase 2.

```sql
-- Registro de ejecuciones de agentes
create table agent_logs (
  id           uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  agent_id     text not null,
  status       text not null check (status in ('success', 'error', 'no_action')),
  summary      text,
  actions_count int default 0,
  actions_executed int default 0,
  metadata     jsonb,
  created_at   timestamptz default now()
);

-- Configuración de agentes por barbería
create table agent_settings (
  id           uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  agent_id     text not null,
  is_active    boolean default false,
  config       jsonb default '{}',  -- Reglas específicas del agente
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(barbershop_id, agent_id)
);

-- RLS: solo ver/modificar los de la propia barbería
alter table agent_logs enable row level security;
alter table agent_settings enable row level security;

create policy "agent_logs_barbershop_isolation"
  on agent_logs for all
  using (barbershop_id = (select barbershop_id from profiles where id = auth.uid()));

create policy "agent_settings_barbershop_isolation"
  on agent_settings for all
  using (barbershop_id = (select barbershop_id from profiles where id = auth.uid()));
```

---

## Flujo de Server Action para agentes (Fase 1)

```typescript
// app/dashboard/agents/actions.ts

"use server";

import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export async function runAgentAction(agentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Obtener barbershop_id del usuario (RLS lo protege automáticamente)
  const { data: profile } = await supabase
    .from("profiles")
    .select("barbershop_id")
    .eq("id", user.id)
    .single();

  if (!profile?.barbershop_id) {
    return { ok: false, error: "No hay barbería configurada." };
  }

  // Ejecutar el agente correspondiente
  switch (agentId) {
    case "retencion": {
      const { runRetencionAgent } = await import("@/src/lib/agents/agents/retencion");
      const result = await runRetencionAgent({
        barbershopId: profile.barbershop_id,
        barbershopName: null,
        barbershopSlug: null,
        plan: "growth",
        date: new Date().toISOString().split("T")[0],
      });
      return { ok: true, result };
    }
    default:
      return { ok: false, error: "Agente no encontrado." };
  }
}
```

---

## Guía de implementación por agente

Para implementar un nuevo agente en Fase 1:

1. Crear `src/lib/agents/agents/{nickname}.ts` con la función `run{Name}Agent()`
2. Añadir las tools necesarias en `src/lib/agents/tools/`
3. Registrar el agente en `src/lib/agents/registry.ts`
4. Añadir el caso en `app/dashboard/agents/actions.ts`
5. El UI en `/dashboard/agents` ya muestra el agente automáticamente

**Tiempo estimado por agente (Fase 1):** 2-4 horas de desarrollo

---

## Seguridad — invariantes que nunca deben romperse

| Regla | Razón |
|-------|-------|
| Siempre validar `barbershop_id` desde `profiles` | Multi-tenant seguro |
| Nunca pasar `barbershop_id` desde el cliente | Evitar IDOR |
| Siempre usar RLS activo en Supabase | Backup de seguridad |
| Logs de todas las ejecuciones | Auditoría y debugging |
| Los agentes no escriben datos críticos en Fase 1 | Solo lectura + texto generado |
| Las keys de OpenAI/WhatsApp nunca van al cliente | Variables de entorno en servidor |

---

*Documento generado en rama feature/aaas-agentic-product-audit*
*Actualizar cuando se implemente cada fase*
