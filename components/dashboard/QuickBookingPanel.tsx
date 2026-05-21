"use client"

import { useState, useCallback, useEffect, useRef, type FormEvent } from "react"
import { X, User, Scissors, Calendar, Clock, FileText, CreditCard } from "lucide-react"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { createQuickBooking } from "@/app/dashboard/actions/createQuickBooking"
import { useActionToast } from "@/components/ui/ActionToast"

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
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  barbers: Barber[]
  defaultDate?: string
  defaultBarberId?: string
  onSuccess?: () => void
}

function getTodayISO() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

type FormState = {
  customerName: string
  customerPhone: string
  customerEmail: string
  serviceId: string
  barberId: string
  appointmentDate: string
  appointmentTime: string
  notes: string
  paymentStatus: "pending" | "paid"
}

const INITIAL_FORM: FormState = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  serviceId: "",
  barberId: "",
  appointmentDate: "",
  appointmentTime: "",
  notes: "",
  paymentStatus: "pending",
}

export function QuickBookingPanel({
  open,
  onOpenChange,
  services,
  barbers,
  defaultDate,
  defaultBarberId,
  onSuccess,
}: Props) {
  const { showToast } = useActionToast()
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    appointmentDate: defaultDate ?? getTodayISO(),
    barberId: defaultBarberId ?? "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Reset form when panel opens with fresh defaults
  useEffect(() => {
    if (open) {
      setForm({
        ...INITIAL_FORM,
        appointmentDate: defaultDate ?? getTodayISO(),
        barberId: defaultBarberId ?? "",
      })
      setErrors({})
      setIsSubmitting(false)
      // Focus first input after transition
      const timer = setTimeout(() => firstInputRef.current?.focus(), 150)
      return () => clearTimeout(timer)
    }
  }, [open, defaultDate, defaultBarberId])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onOpenChange(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, isSubmitting, onOpenChange])

  // Lock body scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    },
    []
  )

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.customerName.trim()) next.customerName = "El nombre es obligatorio"
    if (!form.customerPhone.trim()) next.customerPhone = "El teléfono es obligatorio"
    if (!form.serviceId) next.serviceId = "Selecciona un servicio"
    if (!form.barberId) next.barberId = "Selecciona un barbero"
    if (!form.appointmentDate) next.appointmentDate = "La fecha es obligatoria"
    if (!form.appointmentTime) next.appointmentTime = "La hora es obligatoria"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const result = await createQuickBooking({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim() || undefined,
        serviceId: form.serviceId,
        barberId: form.barberId,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        notes: form.notes.trim() || undefined,
        paymentStatus: form.paymentStatus,
      })

      if (result.success) {
        showToast({ type: "success", message: "Listo, la cita quedó en agenda." })
        onSuccess?.()
        setTimeout(() => onOpenChange(false), 800)
      } else {
        showToast({ type: "error", message: result.error })
      }
    } catch {
      showToast({ type: "error", message: "Error inesperado. Intenta de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={() => !isSubmitting && onOpenChange(false)}
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
        className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Nueva cita"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="fixed right-0 top-0 z-[1001] flex h-full w-full max-w-lg flex-col bg-[#F6F1E8] shadow-[0_0_80px_rgba(5,10,20,0.40)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5CEBC] bg-[#F8F3EA] px-5 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-black text-[#080A0F]">Nueva cita</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Crea una reserva rápida desde el panel
            </p>
          </div>
          <button
            type="button"
            onClick={() => !isSubmitting && onOpenChange(false)}
            disabled={isSubmitting}
            aria-label="Cerrar panel"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#D5CEBC] bg-white text-slate-500 transition-all duration-150 hover:border-[#C9922A]/40 hover:bg-[#FAF8F4] hover:text-[#080A0F] disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form body */}
        <form
          id="quick-booking-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto px-5 py-5 space-y-6"
        >
          {/* Section 1: Cliente */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-black uppercase text-[#B98B2F] mb-3">
              <User size={13} />
              Cliente
            </legend>

            <div className="form-field-group">
              <label htmlFor="qb-name" className="form-label">
                Nombre <span className="text-[#E5484D]">*</span>
              </label>
              <input
                id="qb-name"
                ref={firstInputRef}
                type="text"
                autoComplete="name"
                placeholder="Nombre del cliente"
                value={form.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
                disabled={isSubmitting}
                className={`input-field ${errors.customerName ? "input-error" : ""}`}
              />
              {errors.customerName && (
                <p className="mt-1 text-xs font-medium text-[#E5484D]">{errors.customerName}</p>
              )}
            </div>

            <div className="form-field-group">
              <label htmlFor="qb-phone" className="form-label">
                Teléfono <span className="text-[#E5484D]">*</span>
              </label>
              <input
                id="qb-phone"
                type="tel"
                autoComplete="tel"
                placeholder="600 000 000"
                value={form.customerPhone}
                onChange={(e) => setField("customerPhone", e.target.value)}
                disabled={isSubmitting}
                className={`input-field ${errors.customerPhone ? "input-error" : ""}`}
              />
              {errors.customerPhone && (
                <p className="mt-1 text-xs font-medium text-[#E5484D]">{errors.customerPhone}</p>
              )}
            </div>

            <div className="form-field-group">
              <label htmlFor="qb-email" className="form-label">
                Email <span className="text-xs font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                id="qb-email"
                type="email"
                autoComplete="email"
                placeholder="cliente@email.com"
                value={form.customerEmail}
                onChange={(e) => setField("customerEmail", e.target.value)}
                disabled={isSubmitting}
                className="input-field"
              />
            </div>
          </fieldset>

          {/* Divider */}
          <div className="border-t border-[#D5CEBC]" />

          {/* Section 2: Servicio + Barbero */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-black uppercase text-[#B98B2F] mb-3">
              <Scissors size={13} />
              Servicio y barbero
            </legend>

            <div className="form-field-group">
              <label htmlFor="qb-service" className="form-label">
                Servicio <span className="text-[#E5484D]">*</span>
              </label>
              <select
                id="qb-service"
                value={form.serviceId}
                onChange={(e) => setField("serviceId", e.target.value)}
                disabled={isSubmitting}
                className={`select-field ${errors.serviceId ? "input-error" : ""}`}
              >
                <option value="">Seleccionar servicio</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.duration_minutes ? ` — ${s.duration_minutes} min` : ""}
                    {s.price != null ? ` — ${s.price} €` : ""}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="mt-1 text-xs font-medium text-[#E5484D]">{errors.serviceId}</p>
              )}
            </div>

            <div className="form-field-group">
              <label htmlFor="qb-barber" className="form-label">
                Barbero <span className="text-[#E5484D]">*</span>
              </label>
              <select
                id="qb-barber"
                value={form.barberId}
                onChange={(e) => setField("barberId", e.target.value)}
                disabled={isSubmitting}
                className={`select-field ${errors.barberId ? "input-error" : ""}`}
              >
                <option value="">Seleccionar barbero</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.barberId && (
                <p className="mt-1 text-xs font-medium text-[#E5484D]">{errors.barberId}</p>
              )}
            </div>
          </fieldset>

          {/* Divider */}
          <div className="border-t border-[#D5CEBC]" />

          {/* Section 3: Fecha + Hora + Notas */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-black uppercase text-[#B98B2F] mb-3">
              <Calendar size={13} />
              Fecha y hora
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-field-group">
                <label htmlFor="qb-date" className="form-label">
                  Fecha <span className="text-[#E5484D]">*</span>
                </label>
                <input
                  id="qb-date"
                  type="date"
                  value={form.appointmentDate}
                  min={getTodayISO()}
                  onChange={(e) => setField("appointmentDate", e.target.value)}
                  disabled={isSubmitting}
                  className={`input-field ${errors.appointmentDate ? "input-error" : ""}`}
                />
                {errors.appointmentDate && (
                  <p className="mt-1 text-xs font-medium text-[#E5484D]">{errors.appointmentDate}</p>
                )}
              </div>

              <div className="form-field-group">
                <label htmlFor="qb-time" className="form-label">
                  Hora <span className="text-[#E5484D]">*</span>
                </label>
                <input
                  id="qb-time"
                  type="time"
                  value={form.appointmentTime}
                  step="1800"
                  onChange={(e) => setField("appointmentTime", e.target.value)}
                  disabled={isSubmitting}
                  className={`input-field ${errors.appointmentTime ? "input-error" : ""}`}
                />
                {errors.appointmentTime && (
                  <p className="mt-1 text-xs font-medium text-[#E5484D]">{errors.appointmentTime}</p>
                )}
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="qb-notes" className="form-label">
                <span className="flex items-center gap-1.5">
                  <FileText size={12} />
                  Notas internas
                  <span className="text-xs font-normal text-slate-400">(opcional)</span>
                </span>
              </label>
              <textarea
                id="qb-notes"
                rows={2}
                placeholder="Instrucciones especiales, preferencias..."
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                disabled={isSubmitting}
                className="textarea-field"
              />
            </div>
          </fieldset>

          {/* Divider */}
          <div className="border-t border-[#D5CEBC]" />

          {/* Section 4: Estado de pago */}
          <fieldset>
            <legend className="flex items-center gap-2 text-xs font-black uppercase text-[#B98B2F] mb-3">
              <CreditCard size={13} />
              Estado del pago
            </legend>
            <div className="flex gap-3">
              <label className={`flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-150 ${form.paymentStatus === "pending" ? "border-[#C9922A]/50 bg-[#C9922A]/8 ring-2 ring-[#C9922A]/20" : "border-[#D5CEBC] bg-white hover:border-[#C9922A]/30"}`}>
                <input
                  type="radio"
                  name="paymentStatus"
                  value="pending"
                  checked={form.paymentStatus === "pending"}
                  onChange={() => setField("paymentStatus", "pending")}
                  disabled={isSubmitting}
                  className="accent-[#C9922A]"
                />
                <span>
                  <span className="block text-sm font-bold text-[#080A0F]">Pendiente</span>
                  <span className="text-xs text-slate-500">Se cobra en barbería</span>
                </span>
              </label>
              <label className={`flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-150 ${form.paymentStatus === "paid" ? "border-emerald-400/50 bg-emerald-50/80 ring-2 ring-emerald-400/20" : "border-[#D5CEBC] bg-white hover:border-emerald-300/40"}`}>
                <input
                  type="radio"
                  name="paymentStatus"
                  value="paid"
                  checked={form.paymentStatus === "paid"}
                  onChange={() => setField("paymentStatus", "paid")}
                  disabled={isSubmitting}
                  className="accent-emerald-600"
                />
                <span>
                  <span className="block text-sm font-bold text-[#080A0F]">Pagado</span>
                  <span className="text-xs text-slate-500">Ya cobrado</span>
                </span>
              </label>
            </div>
          </fieldset>

          {/* Bottom padding for sticky footer */}
          <div className="h-2" />
        </form>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-[#D5CEBC] bg-[#F8F3EA] px-5 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => !isSubmitting && onOpenChange(false)}
              disabled={isSubmitting}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <LoadingButton
              type="submit"
              form="quick-booking-form"
              isLoading={isSubmitting}
              loadingText="Creando cita..."
              className="flex-1"
            >
              Crear cita
            </LoadingButton>
          </div>
        </div>
      </aside>
    </>
  )
}
