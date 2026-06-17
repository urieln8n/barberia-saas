"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarPlus, User, DollarSign, Clock, Sparkles } from "lucide-react"
import { QuickBookingPanel } from "@/components/dashboard/QuickBookingPanel"
import Link from "next/link"

type Service = {
  id: string
  name: string
  duration_minutes?: number | null
  price?: number | null
}

type Barber = {
  id: string
  name: string
}

type Props = {
  services: Service[]
  barbers: Barber[]
  // Optional external control — when provided, panel state lives in the parent
  externalOpen?: boolean
  onExternalOpenChange?: (open: boolean) => void
}

export function QuickActionsRow({ services, barbers, externalOpen, onExternalOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const router = useRouter()

  // Use external state if provided, otherwise fall back to internal
  const panelOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setPanelOpen = onExternalOpenChange ?? setInternalOpen

  function handleBookingSuccess() {
    router.refresh()
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[20px] border border-[#2A2A38] bg-gradient-to-b from-[#242440] to-[#1A1A30] shadow-[0_1px_16px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
        <div className="px-5 py-4 md:px-6">
          <p className="label-section mb-3">Acciones rápidas</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#D4AF37] px-4 text-sm font-black text-[#09090B] shadow-[0_2px_8px_rgba(212,175,55,0.30)] transition hover:-translate-y-px hover:bg-[#F5D060] hover:shadow-[0_4px_16px_rgba(212,175,55,0.45)] active:scale-[0.98]"
            >
              <CalendarPlus size={15} />
              Nueva cita
            </button>

            <Link
              href="/dashboard/clientes"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#2A2A38] bg-[#0E0E14] px-4 text-sm font-bold text-white/65 transition hover:border-[#36364A] hover:bg-[#141420] hover:text-white"
            >
              <User size={15} />
              Nuevo cliente
            </Link>

            <Link
              href="/dashboard/caja"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#2A2A38] bg-[#0E0E14] px-4 text-sm font-bold text-white/65 transition hover:border-[#36364A] hover:bg-[#141420] hover:text-white"
            >
              <DollarSign size={15} />
              Registrar cobro
            </Link>

            <Link
              href="/dashboard/huecos"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#2A2A38] bg-[#0E0E14] px-4 text-sm font-bold text-white/65 transition hover:border-[#36364A] hover:bg-[#141420] hover:text-white"
            >
              <Clock size={15} />
              Ver huecos
            </Link>

            <Link
              href="/dashboard/agents"
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] px-4 text-sm font-bold text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.14]"
            >
              <Sparkles size={15} />
              Agentes IA
            </Link>
          </div>
        </div>
      </section>

      <QuickBookingPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        services={services}
        barbers={barbers}
        onSuccess={handleBookingSuccess}
      />
    </>
  )
}
