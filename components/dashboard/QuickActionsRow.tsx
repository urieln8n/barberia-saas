"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarPlus, User, DollarSign, Clock } from "lucide-react"
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
}

export function QuickActionsRow({ services, barbers }: Props) {
  const [panelOpen, setPanelOpen] = useState(false)
  const router = useRouter()

  function handleBookingSuccess() {
    router.refresh()
  }

  return (
    <>
      <section className="surface-frame overflow-hidden">
        <div className="px-5 py-4 md:px-6">
          <p className="label-section mb-3">Acciones rápidas</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="btn-primary"
            >
              <CalendarPlus size={15} />
              Nueva cita
            </button>

            <Link href="/dashboard/clientes" className="btn-outline">
              <User size={15} />
              Nuevo cliente
            </Link>

            <Link href="/dashboard/caja" className="btn-outline">
              <DollarSign size={15} />
              Registrar cobro
            </Link>

            <Link href="/dashboard/huecos" className="btn-outline">
              <Clock size={15} />
              Ver huecos
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
