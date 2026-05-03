import { CalendarCheck, QrCode, BarChart3, Instagram, Scissors, ArrowRight } from "lucide-react";
import { PricingCard } from "@/components/marketing/PricingCard";

const features = [
  { icon: QrCode, title: "QR de reservas", text: "Tus clientes escanean y reservan en segundos." },
  { icon: CalendarCheck, title: "Agenda online", text: "Citas organizadas por barbero, servicio y horario." },
  { icon: BarChart3, title: "Dashboard", text: "Ingresos, citas, clientes y servicios más vendidos." },
  { icon: Instagram, title: "Marketing local", text: "Convierte Instagram, Google y WhatsApp en reservas reales." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-14 px-6 py-8 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-ink">
              <Scissors size={20} />
            </div>
            <span className="text-xl font-bold">BarberíaOS</span>
          </div>
          <a href="#precios" className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/90 hover:bg-white/10">
            Ver planes
          </a>
        </nav>

        <div className="grid items-center gap-12 py-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
              Reservas + QR + marketing para barberías
            </div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Llena tu agenda sin vivir pegado al WhatsApp.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Tus clientes reservan desde Instagram, Google, WhatsApp o un QR en el local. Tú gestionas citas, clientes, pagos y resultados desde un panel simple.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink hover:opacity-90">
                Quiero mi sistema <ArrowRight size={18} />
              </a>
              <a href="/r/demo-barber" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Ver demo de reservas
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl">
            <div className="rounded-[1.5rem] bg-neutral-900 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Hoy</p>
                  <h2 className="text-2xl font-bold">12 citas · 340 €</h2>
                </div>
                <div className="rounded-2xl bg-green-500/10 px-4 py-2 text-sm text-green-300">Agenda activa</div>
              </div>
              {[
                ["Carlos", "Corte + barba", "10:30"],
                ["Miguel", "Degradado", "11:15"],
                ["Andrés", "Barba", "12:00"],
                ["Juan", "Corte premium", "13:30"]
              ].map((item) => (
                <div key={item[0]} className="mb-3 flex items-center justify-between rounded-2xl bg-white/5 p-4">
                  <div>
                    <p className="font-semibold">{item[0]}</p>
                    <p className="text-sm text-white/50">{item[1]}</p>
                  </div>
                  <span className="text-gold">{item[2]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-ink">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl font-black">Todo lo que necesita una barbería moderna</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <feature.icon className="mb-4 text-gold" />
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="bg-neutral-100 py-20 text-ink">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl font-black">Planes para vender a barberías</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <PricingCard name="Starter" price="49 €/mes" setup="149 € setup" features={["Agenda online", "QR de reservas", "Página pública", "Dashboard básico"]} />
            <PricingCard name="Growth" price="149 €/mes" setup="249 € setup" highlighted features={["Todo Starter", "Google/Instagram optimizado", "Contenido mensual", "Reporte de reservas"]} />
            <PricingCard name="Premium" price="299 €/mes" setup="499 € setup" features={["Todo Growth", "Campañas Ads", "CRM avanzado", "Soporte prioritario"]} />
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-neutral-950 px-6 py-20 text-center">
        <h2 className="text-4xl font-black">Convierte tu barbería en una máquina de reservas.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">Instalamos la app, el QR, la página de reservas y la estructura digital para captar clientes locales.</p>
        <a href="mailto:hola@barberiaos.com" className="mt-8 inline-flex rounded-full bg-gold px-8 py-4 font-bold text-ink">Solicitar demo</a>
      </section>
    </main>
  );
}
