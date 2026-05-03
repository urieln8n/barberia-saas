import { Scissors, CalendarDays, Clock } from "lucide-react";

const services = [
  { name: "Corte clásico", price: "15 €", duration: "30 min" },
  { name: "Corte + barba", price: "25 €", duration: "45 min" },
  { name: "Barba", price: "10 €", duration: "20 min" }
];

export default function PublicBookingPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
              <Scissors />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Reserva online</p>
              <h1 className="text-3xl font-black">{params.slug.replaceAll("-", " ")}</h1>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Elige un servicio</h2>
            <div className="mt-4 grid gap-3">
              {services.map((service) => (
                <button key={service.name} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 text-left hover:border-ink">
                  <div>
                    <p className="font-bold">{service.name}</p>
                    <p className="flex items-center gap-2 text-sm text-neutral-500"><Clock size={14} /> {service.duration}</p>
                  </div>
                  <span className="font-black">{service.price}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Fecha</label>
              <input type="date" className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3" />
            </div>
            <div>
              <label className="text-sm font-semibold">Hora</label>
              <select className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3">
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>17:00</option>
              </select>
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Nombre</label>
              <input placeholder="Tu nombre" className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3" />
            </div>
            <div>
              <label className="text-sm font-semibold">Teléfono</label>
              <input placeholder="Tu WhatsApp" className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3" />
            </div>
          </section>

          <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-4 font-bold text-white">
            <CalendarDays size={18} /> Confirmar reserva
          </button>
        </div>
      </div>
    </main>
  );
}
