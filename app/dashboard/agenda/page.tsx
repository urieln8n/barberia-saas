const appointments = [
  { time: "10:00", client: "Carlos", service: "Corte + barba", status: "Confirmada" },
  { time: "11:00", client: "Miguel", service: "Corte", status: "Pendiente" },
  { time: "12:30", client: "Pedro", service: "Barba", status: "Confirmada" }
];

export default function AgendaPage() {
  return (
    <div>
      <h1 className="text-4xl font-black">Agenda</h1>
      <p className="mt-2 text-neutral-500">Vista diaria de citas. Conectar con Supabase en T029-T032.</p>
      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6">
        {appointments.map((item) => (
          <div key={item.time} className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-50 p-4">
            <div>
              <p className="font-bold">{item.time} · {item.client}</p>
              <p className="text-sm text-neutral-500">{item.service}</p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
