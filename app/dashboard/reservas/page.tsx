import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, QrCode, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ReservasPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Reservas"
        title="Reservas online"
        description="Las reservas que entran por tu link o QR aparecen directamente en la agenda, listas para gestionar el día a día."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/reservas/pipeline" className="btn-primary">
              Ver pipeline <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard/agenda" className="btn-outline">
              Abrir agenda <ArrowRight size={14} />
            </Link>
          </div>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[#DDE7FB] bg-white shadow-sm">
        <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">
              Flujo activo
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
              Tu agenda es el centro de reservas
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Comparte el QR o link publico, el cliente elige servicio, barbero,
              dia y hora, y la cita queda registrada en tu agenda. Desde ahi puedes
              marcarla como confirmada, completada, cancelada o no-show.
            </p>
          </div>
          <div className="grid gap-2">
            <Link
              href="/dashboard/qr"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F6FEB] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2459bd]"
            >
              <QrCode size={15} /> Ver QR de reservas
            </Link>
            <Link
              href="/dashboard/agenda"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-[#F8FAFC]"
            >
              <CalendarCheck size={15} /> Gestionar agenda
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: QrCode,
            title: "Reservas por link y QR",
            text: "Usa tu enlace publico en Instagram, Google, WhatsApp o impreso en el local.",
          },
          {
            icon: CalendarCheck,
            title: "Agenda operativa",
            text: "Consulta las citas por fecha y actualiza el estado desde el panel.",
          },
          {
            icon: Users,
            title: "Clientes registrados",
            text: "Cada reserva crea o actualiza el cliente para mantener tu base de datos ordenada.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6FEB]/10">
              <Icon size={18} className="text-[#2F6FEB]" />
            </div>
            <h3 className="font-bold text-[#111827]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2F6FEB]" />
          <div>
            <p className="font-bold text-[#111827]">MVP asistido</p>
            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Si quieres activar mensajes, recordatorios o campañas, se configuran
              contigo como servicio gestionado. El producto base ya cubre reserva,
              agenda, clientes, servicios, barberos y pagos manuales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
