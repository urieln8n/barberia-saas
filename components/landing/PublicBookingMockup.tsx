import { Scissors, QrCode } from "lucide-react";

const services = [
  { name: "Corte premium", duration: "30 min", price: "18 €" },
  { name: "Corte + barba", duration: "45 min", price: "24 €" },
  { name: "Arreglo de barba", duration: "45 min", price: "24 €" },
] as const;

export function PublicBookingMockup() {
  return (
    <div className="premium-mockup rounded-[28px] border p-4">
      <div className="rounded-[24px] border border-[#38BDF8]/[0.16] bg-[#07111f]/[0.78] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_12px_30px_rgba(37,99,235,0.30)]">
              <Scissors size={19} />
            </div>
            <div>
              <p className="font-black text-white">Demo Barber Studio</p>
              <p className="text-xs text-white/42">Ejemplo de página pública</p>
            </div>
          </div>
          <QrCode className="text-[#38BDF8]" size={26} />
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
              <span className="text-sm font-black text-[#38BDF8]">{service.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#1D4ED8] px-4 py-3 text-center text-sm font-black text-white shadow-[0_16px_38px_rgba(37,99,235,0.34)]">
          Ver flujo de reserva
        </div>
      </div>
    </div>
  );
}
