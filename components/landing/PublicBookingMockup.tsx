import { Scissors, QrCode } from "lucide-react";

const services = [
  { name: "Corte premium", duration: "30 min", price: "18 €" },
  { name: "Corte + barba", duration: "45 min", price: "24 €" },
  { name: "Arreglo de barba", duration: "45 min", price: "24 €" },
] as const;

export function PublicBookingMockup() {
  return (
    <div className="premium-mockup rounded-[28px] border p-4">
      <div className="rounded-[24px] border border-[#D5A84C]/[0.16] bg-[#0E0E1C]/[0.92] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5D060] via-[#D5A84C] to-[#B8860B] text-[#09090B] shadow-[0_12px_30px_rgba(213,168,76,0.30)]">
              <Scissors size={19} />
            </div>
            <div>
              <p className="font-black text-white">Demo Barber Studio</p>
              <p className="text-xs text-white/42">Ejemplo de página pública</p>
            </div>
          </div>
          <QrCode className="text-[#D5A84C]" size={26} />
        </div>

        <div className="mt-5 space-y-2">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between rounded-2xl border border-white/[0.12] bg-white/[0.065] p-3"
            >
              <div>
                <p className="text-sm font-black text-white">{service.name}</p>
                <p className="text-xs text-white/40">{service.duration}</p>
              </div>
              <span className="text-sm font-black text-[#D5A84C]">{service.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#F5D060] via-[#D5A84C] to-[#B8860B] px-4 py-3 text-center text-sm font-black text-[#09090B] shadow-[0_16px_38px_rgba(213,168,76,0.34)]">
          Ver flujo de reserva
        </div>
      </div>
    </div>
  );
}
