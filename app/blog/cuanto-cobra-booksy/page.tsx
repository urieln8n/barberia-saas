import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/src/lib/site-url";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Cuánto cuesta usar plataformas de reservas para barberías | BarberíaOS",
  description:
    "Guía para entender cuotas, comisiones y dependencia de plataformas de reservas en barberías antes de elegir un sistema propio.",
  keywords: [
    "cuánto cobra booksy",
    "comisiones booksy",
    "alternativa booksy barbería",
    "precio booksy españa",
    "dejar booksy",
    "software barbería sin comisiones",
  ],
  alternates: { canonical: `${SITE_URL}/blog/cuanto-cobra-booksy` },
  openGraph: {
    title: "Cuánto cuesta usar plataformas de reservas para barberías | BarberíaOS",
    description:
      "Guía para entender cuotas, comisiones y dependencia de plataformas de reservas antes de elegir un sistema propio.",
    url: `${SITE_URL}/blog/cuanto-cobra-booksy`,
    type: "article",
    siteName: "BarberíaOS",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "¿Cuánto cobra Booksy de verdad? Comisiones, costes reales y alternativas para barberías en España",
  description:
    "Booksy no solo cobra 29€/mes. Descubre cuánto cuestan las comisiones Boost, qué pasa con tus datos de clientes y por qué cada vez más barberías en España buscan alternativas sin comisiones.",
  author: { "@type": "Organization", name: "Equipo BarberíaOS" },
  publisher: { "@type": "Organization", name: "BarberíaOS", url: SITE_URL },
  url: `${SITE_URL}/blog/cuanto-cobra-booksy`,
  datePublished: "2026-05-19",
  inLanguage: "es-ES",
  mainEntityOfPage: `${SITE_URL}/blog/cuanto-cobra-booksy`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo cancelar Booksy en cualquier momento?",
      acceptedAnswer: { "@type": "Answer", text: "Sí, aunque algunos usuarios reportan dificultades con el proceso. Recomendamos tener el sistema alternativo funcionando antes de cancelar." },
    },
    {
      "@type": "Question",
      name: "¿Pierdo mis reseñas de Booksy si me voy?",
      acceptedAnswer: { "@type": "Answer", text: "Las reseñas en el perfil de Booksy son de Booksy, no tuyas. Las reseñas de Google Business son tuyas y se mantienen independientemente de la plataforma de reservas que uses." },
    },
    {
      "@type": "Question",
      name: "¿Booksy me puede cobrar comisiones aunque no use Boost?",
      acceptedAnswer: { "@type": "Answer", text: "El plan base sin Boost no debería tener comisiones por reserva. Las comisiones se activan con Boost. Revisa siempre tu contrato y las condiciones actuales de la plataforma." },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa con mis reservas futuras si cancelo Booksy?",
      acceptedAnswer: { "@type": "Answer", text: "Las reservas ya confirmadas en Booksy pueden perderse si cancelas antes de que se realicen. Recomendamos hacer la transición de forma gradual: nuevas reservas en BarberíaOS, honrar las ya confirmadas en Booksy." },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${SITE_URL}/blog`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cuánto cuesta usar plataformas de reservas",
      item: `${SITE_URL}/blog/cuanto-cobra-booksy`,
    },
  ],
};

export default function CuantoCobraBooksyPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif", lineHeight: "1.7" }}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* NAV */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 5%", borderBottom: "1px solid #2a2a2a",
        position: "sticky", top: 0, background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(10px)", zIndex: 100,
      }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#c9a84c", textDecoration: "none" }}>
          BarberíaOS
        </Link>
        <Link href={BUSINESS_CONFIG.demoUrl} style={{
          background: "#c9a84c", color: "#0a0a0a", padding: "10px 22px",
          borderRadius: 6, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
        }}>
          Probar gratis
        </Link>
      </nav>

      {/* ARTICLE */}
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "60px 5% 80px" }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 32, fontSize: "0.83rem", color: "#666" }}>
          <Link href="/" style={{ color: "#666", textDecoration: "none" }}>BarberíaOS</Link>
          {" / "}
          <span style={{ color: "#999" }}>Blog</span>
          {" / "}
          <span style={{ color: "#ccc" }}>¿Cuánto cobra Booksy?</span>
        </nav>

        {/* Metadata chip */}
        <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
            Guía
          </span>
          <span style={{ color: "#666", fontSize: "0.83rem" }}>Equipo BarberíaOS · Mayo 2026 · 8 min lectura</span>
        </div>

        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
          ¿Cuánto cobra Booksy de verdad? Lo que no te dicen los 29€/mes
        </h1>

        <p style={{ fontSize: "1.1rem", color: "#bbb", marginBottom: 48, lineHeight: 1.8, borderLeft: "3px solid #c9a84c", paddingLeft: 20 }}>
          Si tienes una barbería y usas Booksy, probablemente sabes que el plan base cuesta alrededor de 29€ al mes. Lo que quizás no sabes es cuánto puedes estar pagando de verdad una vez entran en juego las comisiones, los cargos por Boost y el coste invisible de ceder el control de tu negocio a una plataforma de terceros.
        </p>

        {/* Section 1 */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16, marginTop: 48 }}>
          El precio base de Booksy: la punta del iceberg
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Booksy tiene un plan de entrada que ronda los <strong style={{ color: "#fff" }}>29€ al mes</strong> en España. Para una barbería pequeña con un solo barbero y pocas reservas, eso puede ser suficiente y razonable.
        </p>
        <p style={{ color: "#bbb", marginBottom: 32 }}>
          El problema aparece cuando tu barbería crece, cuando activas funciones de marketing como el Boost, o cuando entiendes exactamente qué estás cediendo a cambio de ese precio.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 2 */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          1. Las comisiones Boost: el 30% que pocos mencionan
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Booksy tiene una función llamada <strong style={{ color: "#fff" }}>Boost</strong> que te promete más visibilidad en su marketplace y más clientes nuevos. El problema no es la promesa, sino el precio oculto.
        </p>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Cuando un cliente te reserva a través del sistema Boost de Booksy, la plataforma cobra <strong style={{ color: "#ff6b6b" }}>hasta un 30% de comisión</strong> sobre esa reserva. Con un ticket medio de 25€, eso son 7,50€ por cliente. Con 20 clientes nuevos al mes via Boost, suman 150€ extra sobre tu cuota mensual.
        </p>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Pero hay un detalle que varios barberos han reportado públicamente: <strong style={{ color: "#fff" }}>Booksy ha cobrado esta comisión en reservas de clientes que ya eran suyos</strong>, que llegaron a través de su web personal o de sus redes sociales, no a través del marketplace de Booksy.
        </p>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Esto está documentado en Trustpilot, donde Booksy tiene una puntuación de <strong style={{ color: "#fff" }}>3,6 sobre 5</strong>, y en Capterra, donde el <strong style={{ color: "#fff" }}>88% de las reseñas negativas</strong> mencionan el soporte al cliente como "consistentemente decepcionante".
        </p>
        <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 10, padding: "20px 24px", marginBottom: 32 }}>
          <p style={{ color: "#999", margin: 0, fontSize: "0.92rem" }}>
            <strong style={{ color: "#ff6b6b" }}>Lo que debería costarte Booksy:</strong> 29€/mes.<br />
            <strong style={{ color: "#fff" }}>Lo que puede costarte realmente:</strong> 29€ + comisiones variables + tiempo resolviendo incidencias.
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 3 */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          2. Tus clientes: ¿suyos o tuyos?
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Este es el coste más difícil de calcular porque no aparece en ninguna factura, pero es el más importante a largo plazo.
        </p>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Cuando un cliente reserva a través de Booksy, sus datos quedan almacenados en la plataforma de Booksy. Tú puedes verlos mientras tengas cuenta activa. Pero si cancelas tu suscripción, pierdes el acceso al historial de clientes que habías acumulado.
        </p>
        <p style={{ color: "#bbb", marginBottom: 32 }}>
          Más grave aún: varios propietarios de barberías han reportado que al darse de baja de Booksy, <strong style={{ color: "#fff" }}>el enlace de reservas de la plataforma quedó anclado en su ficha de Google Business y no podían eliminarlo</strong>. Es decir, incluso después de marcharte, Booksy puede seguir capturando clientes que te buscan a ti en Google.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 4 */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          3. El marketplace: competir contra ti mismo
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Booksy es un marketplace. Eso significa que cuando alguien busca una barbería en tu zona, Booksy le muestra <strong style={{ color: "#fff" }}>tu perfil junto al de tus competidores</strong>, ordenados por precio, valoraciones o proximidad.
        </p>
        <p style={{ color: "#bbb", marginBottom: 32 }}>
          Pagas para aparecer en una plataforma que te pone a competir directamente con la barbería de la calle de al lado. El cliente compara y elige al más barato o al mejor valorado. Si tú eres el más barato, estás erosionando tu margen. Si no eres el más barato, pierdes el cliente ante alguien que sí lo es.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 5 — tabla */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          Cálculo real: ¿cuánto le pagas a Booksy al mes?
        </h2>
        <p style={{ color: "#bbb", marginBottom: 24 }}>
          Hagamos los números con un ejemplo representativo de una barbería mediana en España:
        </p>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.93rem" }}>
            <thead>
              <tr>
                <th style={{ padding: "12px 16px", textAlign: "left", background: "#141414", borderBottom: "2px solid #2a2a2a", fontWeight: 700, color: "#ccc" }}>Concepto</th>
                <th style={{ padding: "12px 16px", textAlign: "right", background: "#141414", borderBottom: "2px solid #2a2a2a", fontWeight: 700, color: "#ccc" }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Plan mensual Booksy", "29 €"],
                ["Boost activo: 30% × 20 reservas × 25€ ticket", "150 €"],
              ].map(([c, i]) => (
                <tr key={c}>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a", color: "#999" }}>{c}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a", color: "#ff6b6b", fontWeight: 600, textAlign: "right" }}>{i}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a", fontWeight: 700, color: "#fff" }}>Total mensual a Booksy</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a", fontWeight: 700, color: "#ff6b6b", fontSize: "1.1rem", textAlign: "right" }}>179 €</td>
              </tr>
              <tr>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#fff" }}>Total anual a Booksy</td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#ff6b6b", fontSize: "1.1rem", textAlign: "right" }}>2.148 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: "#bbb", marginBottom: 32 }}>
          Si quieres calcular tu cifra exacta, usa nuestra{" "}
          <Link href="/calculadora-booksy" style={{ color: "#c9a84c", textDecoration: "underline" }}>calculadora gratuita</Link>{" "}
          donde introduces tus datos y ves el resultado en tiempo real.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 6 */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          ¿Por qué cada vez más barberías buscan alternativas a Booksy en España?
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          En los foros de profesionales de la peluquería y barbería en España, la conversación sobre alternativas a Booksy lleva tiempo siendo recurrente. Los motivos que se repiten son:
        </p>
        <ol style={{ color: "#bbb", paddingLeft: 24, marginBottom: 32 }}>
          {[
            { title: "Las comisiones son impredecibles.", text: "Un mes puedes pagar 50€ extra y el siguiente 200€, dependiendo del volumen y de cómo Booksy clasifique las reservas." },
            { title: "El soporte no responde.", text: "Cuando hay un problema con una reserva o un cobro incorrecto, la experiencia de muchos profesionales es que el soporte de Booksy tarda días en responder o no resuelve el problema." },
            { title: "Dependencia total de la plataforma.", text: "Si Booksy sube precios mañana, no tienes alternativa fácil. Tus clientes están en su sistema, tu perfil está en su marketplace y cambiar tiene un coste real de migración." },
            { title: "El cliente tiene que instalar una app.", text: "Algunos clientes no quieren instalar la app de Booksy para reservar, especialmente los de mayor edad o los que simplemente prefieren no tener más aplicaciones en el móvil." },
          ].map((item) => (
            <li key={item.title} style={{ marginBottom: 12 }}>
              <strong style={{ color: "#fff" }}>{item.title}</strong> {item.text}
            </li>
          ))}
        </ol>

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 7 — alternativas */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          ¿Qué alternativas existen para barberías en España?
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          El mercado español de software para barberías ha crecido en los últimos años. Estas son las opciones más usadas:
        </p>
        {[
          { name: "CitaClic", desc: "Sistema de reservas básico, desde 17,50€/mes sin comisiones. Orientado a reservas simples, sin caja ni CRM avanzado." },
          { name: "Eskedula", desc: "Software de gestión con agenda, TPV y CRM. Sin marketplace, sin comisiones. Precio no publicado, requiere consulta." },
          { name: "BarberíaOS", desc: "Software específico para barberías con reservas, caja, clientes, equipo, marketing e IA en un sistema integrado. Desde 39€/mes, sin comisiones, con configuración guiada en 48 horas.", highlight: true },
          { name: "Fresha", desc: "Gratuito en el plan básico, pero cobra porcentaje sobre pagos procesados en plataforma. Marketplace similar a Booksy." },
        ].map((alt) => (
          <div key={alt.name} style={{
            background: alt.highlight ? "rgba(201,168,76,0.06)" : "#141414",
            border: `1px solid ${alt.highlight ? "rgba(201,168,76,0.3)" : "#2a2a2a"}`,
            borderRadius: 10, padding: "16px 20px", marginBottom: 12,
          }}>
            <strong style={{ color: alt.highlight ? "#c9a84c" : "#fff" }}>{alt.name}</strong>
            <span style={{ color: "#999", fontSize: "0.92rem" }}> — {alt.desc}</span>
          </div>
        ))}

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 8 — migración */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          Cómo migrar de Booksy a BarberíaOS sin perder nada
        </h2>
        <p style={{ color: "#bbb", marginBottom: 24 }}>
          Si estás pensando en hacer el cambio, el proceso es más sencillo de lo que parece:
        </p>
        {[
          { step: "Paso 1 — Exporta tus clientes de Booksy", text: "Booksy permite exportar tu base de clientes en formato CSV desde el panel de administración. Es tu derecho y lo hace en menos de 5 minutos." },
          { step: "Paso 2 — Configura BarberíaOS (nosotros lo hacemos)", text: "En BarberíaOS, el equipo configura tu barbería: servicios, barberos, horarios, precios, link público y QR de reservas. En 48 horas estás operativo." },
          { step: "Paso 3 — Importa tus clientes", text: "Con el CSV de Booksy, importamos tu base de clientes a BarberíaOS. No pierdes ningún contacto, ningún historial." },
          { step: "Paso 4 — Actualiza el link de reservas", text: "Cambias el enlace en tu bio de Instagram, en WhatsApp Business y en tu ficha de Google. A partir de ese momento, las reservas llegan a tu sistema. Sin comisiones." },
          { step: "Paso 5 — Cancela Booksy cuando estés listo", text: "No hay prisa. Puedes tener ambos sistemas en paralelo durante el tiempo que necesites hasta que estés seguro de que todo funciona." },
        ].map((item, i) => (
          <div key={item.step} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "#c9a84c", color: "#0a0a0a", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0, marginTop: 2 }}>
              {i + 1}
            </div>
            <div>
              <h3 style={{ fontSize: "0.97rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.step}</h3>
              <p style={{ color: "#999", fontSize: "0.9rem", lineHeight: 1.65 }}>{item.text}</p>
            </div>
          </div>
        ))}

        <hr style={{ border: "none", borderTop: "1px solid #2a2a2a", margin: "40px 0" }} />

        {/* Section 9 — conclusión */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 16 }}>
          ¿Merece la pena cambiar?
        </h2>
        <p style={{ color: "#bbb", marginBottom: 16 }}>
          Depende de tu situación actual:
        </p>
        <ul style={{ color: "#bbb", paddingLeft: 24, marginBottom: 24 }}>
          <li style={{ marginBottom: 8 }}><strong style={{ color: "#fff" }}>Si tienes Boost activo y pagas más de 60€/mes en comisiones:</strong> probablemente sí merece la pena explorar alternativas.</li>
          <li style={{ marginBottom: 8 }}><strong style={{ color: "#fff" }}>Si solo usas el plan base sin Boost y tienes poco volumen:</strong> los números son más ajustados; compara lo que incluye cada opción a igual precio.</li>
          <li style={{ marginBottom: 8 }}><strong style={{ color: "#fff" }}>Si el control de tus datos y la independencia de la plataforma te importan:</strong> la respuesta es sí, independientemente del precio.</li>
        </ul>
        <p style={{ color: "#bbb", marginBottom: 40 }}>
          Lo importante no es solo el coste mensual sino el coste total: cuánto pagas, qué control tienes sobre tu negocio y qué pasa si la plataforma cambia sus condiciones mañana.
        </p>

        {/* Conclusión */}
        <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: "28px 32px", marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>Conclusión</h2>
          <p style={{ color: "#bbb", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Booksy no es malo, pero su modelo de negocio tiene un conflicto de intereses estructural con el tuyo: ellos ganan más cuando tú les cedes más clientes y más reservas. A medida que tu barbería crece, ese conflicto se vuelve más caro.
          </p>
          <p style={{ color: "#bbb", fontSize: "0.95rem", lineHeight: 1.75, marginTop: 12 }}>
            Las alternativas sin comisiones existen y están maduras. Si llevas tiempo con Booksy, vale la pena hacer los números con tu volumen real y comparar.
          </p>
        </div>

        {/* CTA inline */}
        <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 12, padding: "28px 32px", marginBottom: 48, textAlign: "center" }}>
          <p style={{ color: "#f0f0f0", marginBottom: 20, fontSize: "1rem" }}>
            Si quieres calcularlo tú mismo, usa nuestra{" "}
            <Link href="/calculadora-booksy" style={{ color: "#c9a84c", textDecoration: "underline" }}>calculadora gratuita</Link>.
            Y si quieres ver cómo funciona BarberíaOS en tu barbería, la{" "}
            <Link href={BUSINESS_CONFIG.demoUrl} style={{ color: "#c9a84c", textDecoration: "underline" }}>demo es gratuita y sin compromiso</Link>.
          </p>
          <Link href={BUSINESS_CONFIG.demoUrl} style={{
            display: "inline-block", background: "#c9a84c", color: "#0a0a0a",
            padding: "14px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.97rem",
          }}>
            Ver demo gratuita
          </Link>
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, marginBottom: 24 }}>
          Preguntas frecuentes
        </h2>
        {[
          {
            q: "¿Puedo cancelar Booksy en cualquier momento?",
            a: "Sí, aunque algunos usuarios reportan dificultades con el proceso. Recomendamos tener el sistema alternativo funcionando antes de cancelar.",
          },
          {
            q: "¿Pierdo mis reseñas de Booksy si me voy?",
            a: "Las reseñas en el perfil de Booksy son de Booksy, no tuyas. Las reseñas de Google Business son tuyas y se mantienen independientemente de la plataforma de reservas que uses.",
          },
          {
            q: "¿Booksy me puede cobrar comisiones aunque no use Boost?",
            a: "El plan base sin Boost no debería tener comisiones por reserva. Las comisiones se activan con Boost. Revisa siempre tu contrato y las condiciones actuales de la plataforma.",
          },
          {
            q: "¿Qué pasa con mis reservas futuras si cancelo Booksy?",
            a: "Las reservas ya confirmadas en Booksy pueden perderse si cancelas antes de que se realicen. Recomendamos hacer la transición de forma gradual: nuevas reservas en BarberíaOS, honrar las ya confirmadas en Booksy.",
          },
        ].map((item) => (
          <details key={item.q} style={{ borderBottom: "1px solid #2a2a2a" }}>
            <summary style={{
              cursor: "pointer", padding: "20px 0", fontSize: "0.97rem",
              fontWeight: 600, color: "#fff", display: "flex",
              justifyContent: "space-between", alignItems: "center", gap: 16,
              listStyle: "none",
            }}>
              <span>{item.q}</span>
              <span style={{ color: "#c9a84c", fontSize: "1.2rem", flexShrink: 0 }}>▼</span>
            </summary>
            <p style={{ paddingBottom: 20, fontSize: "0.9rem", color: "#999", lineHeight: 1.7 }}>
              {item.a}
            </p>
          </details>
        ))}

        <p style={{ marginTop: 32, color: "#666", fontSize: "0.85rem" }}>
          ¿Tienes una pregunta que no está aquí? Escríbenos a{" "}
          <a href="mailto:hola@barberiaos.com" style={{ color: "#c9a84c", textDecoration: "none" }}>hola@barberiaos.com</a>
          {" "}o por{" "}
          <a href={BUSINESS_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#c9a84c", textDecoration: "none" }}>WhatsApp</a>.
        </p>

        {/* Internal links footer */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #2a2a2a", display: "flex", flexWrap: "wrap", gap: 16 }}>
          <Link href="/alternativa-a-booksy" style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 20px", color: "#ccc", textDecoration: "none", fontSize: "0.88rem", fontWeight: 600 }}>
            → Comparativa BarberíaOS vs Booksy
          </Link>
          <Link href="/calculadora-booksy" style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 20px", color: "#ccc", textDecoration: "none", fontSize: "0.88rem", fontWeight: 600 }}>
            → Calculadora: tu coste exacto en Booksy
          </Link>
        </div>
      </article>

      {/* FOOTER */}
      <footer style={{ background: "#141414", borderTop: "1px solid #2a2a2a", padding: "40px 5%", textAlign: "center" }}>
        <Link href="/" style={{ fontSize: "1.2rem", fontWeight: 700, color: "#c9a84c", textDecoration: "none", display: "block", marginBottom: 12 }}>
          BarberíaOS
        </Link>
        <p style={{ fontSize: "0.82rem", color: "#999" }}>
          © 2026 BarberíaOS ·{" "}
          <Link href="/aviso-legal" style={{ color: "#999", textDecoration: "none" }}>Aviso legal</Link> ·{" "}
          <Link href="/privacidad" style={{ color: "#999", textDecoration: "none" }}>Privacidad</Link>
        </p>
      </footer>
    </div>
  );
}
