import type { Metadata } from "next";
import Link from "next/link";
import { FloatingWhatsAppButton } from "@/components/public/FloatingWhatsAppButton";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { SITE_URL } from "@/src/lib/site-url";

export const metadata: Metadata = {
  title: "Alternativa a Booksy para barberías | BarberíaOS",
  description:
    "Compara BarberíaOS con plataformas de reservas externas y centraliza reservas, caja, clientes y QR en tu propio sistema sin comisión por cita.",
  keywords: [
    "alternativa booksy",
    "alternativa booksy barbería",
    "software barbería sin comisiones",
    "dejar booksy",
    "migrar booksy",
    "agenda online barbería españa",
  ],
  alternates: { canonical: `${SITE_URL}/alternativa-a-booksy` },
  openGraph: {
    title: "Alternativa a Booksy para barberías | BarberíaOS",
    description:
      "Compara BarberíaOS con plataformas externas y centraliza reservas, caja, clientes y QR sin comisión por cita.",
    url: `${SITE_URL}/alternativa-a-booksy`,
    type: "website",
    siteName: "BarberíaOS",
  },
};

const WA_ALT = `${BUSINESS_CONFIG.whatsappUrl.split("?")[0]}?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20alternativa%20a%20Booksy%20y%20quiero%20migrar%20mi%20barber%C3%ADa`;

const faqItems = [
  {
    q: "¿Pierdo mis clientes al migrar de Booksy a BarberíaOS?",
    a: "No. Booksy te permite exportar tu base de clientes en formato CSV desde el panel de administración. Nosotros te ayudamos a importarlos en BarberíaOS. No pierdes ningún contacto, ningún historial que hayas guardado.",
  },
  {
    q: "¿Mis clientes tienen que instalar alguna app?",
    a: "No. Con BarberíaOS reservan desde el navegador de su móvil usando tu link público o tu QR. Sin app, sin registro obligatorio, sin fricciones. Más fácil que Booksy para el cliente.",
  },
  {
    q: "¿Puedo usar BarberíaOS aunque ya tenga web propia?",
    a: "Sí. BarberíaOS tiene un widget instalable en una línea de código para que el botón de reservas aparezca en tu web actual. También tienes una página pública propia con tu dominio de barbería.",
  },
  {
    q: "¿Cuánto tiempo tarda la configuración?",
    a: "48 horas desde que empezamos. El día 1 configuramos barbería, servicios, barberos y QR. El día 2 revisamos la agenda, la caja básica y hacemos las primeras pruebas de reserva. Tú solo supervisas.",
  },
  {
    q: "¿Hay permanencia o contrato mínimo?",
    a: "No. Pagas mes a mes y cancelas cuando quieras sin penalización. Puedes empezar con el plan Arranca y subir cuando lo necesites.",
  },
  {
    q: "¿Es más caro que Booksy?",
    a: "El plan Arranca empieza en 39€/mes. El plan base de Booksy está en ~29€/mes, pero a eso le sumas las comisiones Boost (hasta el 30% por reserva). La mayoría de barberías que usan Boost activamente acaban pagando más de 150-200€/mes. Con BarberíaOS sabes exactamente lo que pagas cada mes.",
  },
  {
    q: "¿Qué pasa con el enlace de Booksy en mi Google Business?",
    a: "Es uno de los problemas documentados de Booksy: cuando te das de baja, puede quedar un enlace de reservas de Booksy anclado en tu ficha de Google. Te ayudamos a gestionarlo: te explicamos exactamente cómo reclamar y actualizar tu ficha de Google Business para que el enlace apunte a BarberíaOS.",
  },
];

const alternativaJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Alternativa a Booksy para barberías",
    description: metadata.description,
    url: `${SITE_URL}/alternativa-a-booksy`,
    inLanguage: "es-ES",
    isPartOf: {
      "@type": "WebSite",
      name: "BarberíaOS",
      url: SITE_URL,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  },
  {
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
        name: "Alternativa a Booksy",
        item: `${SITE_URL}/alternativa-a-booksy`,
      },
    ],
  },
];

export default function AlternativaBooksyPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif", lineHeight: "1.6" }}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(alternativaJsonLd) }}
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

      {/* HERO */}
      <section style={{ padding: "90px 5% 70px", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-block", background: "rgba(201,168,76,0.15)",
          border: "1px solid #c9a84c", color: "#c9a84c",
          padding: "6px 16px", borderRadius: 999, fontSize: "0.8rem",
          fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 28,
        }}>
          Alternativa a Booksy para barberías
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 22 }}>
          Deja de pagar el 30% por{" "}
          <span style={{ color: "#c9a84c" }}>tus propios clientes</span>
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#999", maxWidth: 620, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Booksy cobra comisión incluso por clientes que <strong style={{ color: "#f0f0f0" }}>ya son tuyos</strong>.{" "}
          BarberíaOS es un precio fijo mensual. Sin comisiones. Sin marketplace.{" "}
          <strong style={{ color: "#f0f0f0" }}>Tus clientes son tuyos.</strong>
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={BUSINESS_CONFIG.demoUrl} style={{
            background: "#c9a84c", color: "#0a0a0a", padding: "16px 34px",
            borderRadius: 8, fontWeight: 700, fontSize: "1.05rem", textDecoration: "none",
          }}>
            Probar BarberíaOS gratis
          </Link>
          <a href="#comparativa" style={{
            background: "transparent", color: "#fff", padding: "16px 34px",
            borderRadius: 8, fontWeight: 600, fontSize: "1.05rem", textDecoration: "none",
            border: "1px solid #2a2a2a",
          }}>
            Ver comparativa completa
          </a>
        </div>
        <p style={{ marginTop: 18, fontSize: "0.82rem", color: "#999" }}>
          Sin tarjeta de crédito · Sin permanencia · Configuración en 48h
        </p>
      </section>

      {/* PAIN */}
      <section style={{ background: "#141414", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a", padding: "70px 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
            Lo que Booksy no te dice en la letra pequeña
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, marginBottom: 14 }}>
            Por qué los barberos están dejando Booksy
          </h2>
          <p style={{ color: "#999", fontSize: "1.05rem", marginBottom: 44, maxWidth: 640 }}>
            Estas son dudas frecuentes de profesionales que comparan una plataforma externa con un sistema propio para su barbería.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {
                highlight: true, icon: "💸", title: 'El 30% por “tus” clientes',
                text: "Booksy cobra hasta un 30% de comisión en la primera reserva de clientes que llegan por Boost — incluyendo clientes que te encontraron en Google Maps o Instagram, no a través de ellos.",
              },
              {
                highlight: true, icon: "🔗", title: "Tu cliente pasa a ser de Booksy",
                text: "Los datos de tus clientes están en la plataforma de Booksy. Si mañana sube las tarifas o cierras tu cuenta, pierdes el historial y el contacto directo con cada cliente.",
              },
              {
                highlight: true, icon: "🚪", title: "Difícil salir sin consecuencias",
                text: "Varios barberos reportan que al darse de baja de Booksy, quedó un enlace de Booksy anclado en sus reservas de Google que no podían eliminar. Trampa digital.",
              },
              {
                highlight: false, icon: "📉", title: "Soporte que no responde",
                text: "Cuando algo falla en una plataforma externa, dependes de sus procesos de soporte y de sus tiempos de respuesta.",
              },
              {
                highlight: false, icon: "⚔️", title: "Compites contra ti mismo",
                text: "En el marketplace de Booksy, tu barbería aparece junto a la de al lado. El cliente compara precios y elige al más barato. Tú pagas para que te busquen a ti o a la competencia.",
              },
              {
                highlight: false, icon: "💳", title: "Cobros confusos y opacos",
                text: "Usuarios reportan que la plataforma intentó cobrar comisiones en reservas de clientes propios que llegaron a través de su web personal, sin pasar por el marketplace.",
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: card.highlight ? "rgba(230,57,70,0.06)" : "#1e1e1e",
                border: `1px solid ${card.highlight ? "#e63946" : "#2a2a2a"}`,
                borderRadius: 10, padding: 26,
              }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8, color: card.highlight ? "#ff6b6b" : "#fff" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#999", lineHeight: 1.6 }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÁLCULO REAL */}
      <section style={{ padding: "80px 5%", maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
          El coste real
        </p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, marginBottom: 14 }}>
          Cuánto te está costando Booksy de verdad
        </h2>
        <p style={{ color: "#999", marginBottom: 44, fontSize: "1.05rem" }}>
          Más allá de los 29€/mes del plan base, el modelo de Booksy penaliza a quien crece.
        </p>
        <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 14, padding: 40, textAlign: "left" }}>
          {[
            { label: "Plan mensual Booksy (base)", value: "~29 €/mes", color: "#ff6b6b" },
            { label: "Comisión Boost (30% × 20 clientes nuevos × 25€ ticket)", value: "+ 150 €/mes", color: "#ff6b6b" },
            { label: "Horas perdidas en soporte e incidencias", value: "+ tiempo no medido", color: "#ff6b6b" },
            { label: "Clientes que no vuelven por reservar en plataforma genérica", value: "+ fuga silenciosa", color: "#ff6b6b" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #2a2a2a", fontSize: "0.95rem" }}>
              <span style={{ color: "#999" }}>{row.label}</span>
              <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #2a2a2a" }}>
            <span style={{ fontWeight: 700, color: "#fff" }}>Coste real mensual estimado</span>
            <span style={{ fontWeight: 700, color: "#ff6b6b", fontSize: "1.5rem" }}>179 €+/mes</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #2a2a2a" }}>
            <span style={{ fontWeight: 700, color: "#fff" }}>BarberíaOS Control (todo incluido)</span>
            <span style={{ fontWeight: 700, color: "#c9a84c", fontSize: "1.3rem" }}>79 €/mes</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
            <span style={{ fontWeight: 700, color: "#2ecc71" }}>Ahorro estimado mensual</span>
            <span style={{ fontWeight: 700, color: "#2ecc71", fontSize: "1.4rem" }}>+100 €/mes</span>
          </div>
          <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, padding: "18px 22px", marginTop: 24, fontSize: "0.92rem", color: "#f0f0f0", lineHeight: 1.7 }}>
            <strong style={{ color: "#c9a84c" }}>Ejemplo real:</strong> Una barbería con 3 barberos, 80 reservas/mes y ticket medio de 28€ que usa Boost en Booksy paga aproximadamente <strong style={{ color: "#c9a84c" }}>~220€/mes</strong> entre cuota y comisiones. Con BarberíaOS Control paga <strong style={{ color: "#c9a84c" }}>79€ fijos</strong>. La diferencia se convierte en margen, en sueldo o en inversión en tu propio marketing.
          </div>
          <p style={{ marginTop: 20, fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
            * Cálculo orientativo basado en el modelo de comisiones Boost de Booksy y ticket medio estimado. Usa la{" "}
            <Link href="/calculadora-booksy" style={{ color: "#c9a84c", textDecoration: "underline" }}>calculadora interactiva</Link>{" "}
            para tu cifra exacta.
          </p>
          <p style={{ marginTop: 12, fontSize: "0.82rem", color: "#999" }}>
            ¿Listo para dar el paso? Lee la{" "}
            <Link href="/migrar-de-booksy" style={{ color: "#c9a84c", textDecoration: "underline" }}>guía completa de migración paso a paso</Link>.
          </p>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section id="comparativa" style={{ background: "#141414", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a", padding: "80px 5%" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12, textAlign: "center" }}>
            Comparativa directa
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, marginBottom: 14, textAlign: "center" }}>
            BarberíaOS vs Booksy
          </h2>
          <p style={{ color: "#999", textAlign: "center", marginBottom: 50, fontSize: "1rem" }}>
            Sin letra pequeña. Sin asteriscos. Las diferencias que importan.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.93rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "14px 20px", textAlign: "left", background: "#1e1e1e", borderBottom: "2px solid #2a2a2a", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", width: "34%" }}>
                    Característica
                  </th>
                  <th style={{ padding: "14px 20px", textAlign: "left", background: "#1e1e1e", borderBottom: "2px solid #2a2a2a", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Booksy
                  </th>
                  <th style={{ padding: "14px 20px", textAlign: "left", background: "rgba(201,168,76,0.1)", borderBottom: "2px solid #c9a84c", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "#c9a84c" }}>
                    BarberíaOS
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Comisión por reserva", "✗ Hasta 30% (Boost)", "✓ 0% siempre"],
                  ["Tus clientes son tuyos", "✗ En plataforma Booksy", "✓ 100% tuyos"],
                  ["Marketplace con competencia", "✗ Sí, compites en precio", "✓ Tu página privada"],
                  ["Precio fijo mensual", "⚠ Plan + comisiones variables", "✓ Fijo, sin sorpresas"],
                  ["Caja e ingresos integrados", "✗ Limitado", "✓ Caja diaria completa"],
                  ["Marketing Studio incluido", "✗ No", "✓ Sí (plan Control+)"],
                  ["IA para recuperar clientes", "✗ No", "✓ Sí (plan Domina)"],
                  ["Configuración inicial", "⚠ Tú solo", "✓ Guiada en 48h"],
                  ["Sin app para el cliente", "✗ Necesita app Booksy", "✓ Solo navegador/link"],
                  ["Soporte directo", "⚠ Depende del soporte de la plataforma", "✓ WhatsApp directo"],
                  ["Permanencia mínima", "⚠ Condiciones variables", "✓ Sin permanencia"],
                ].map(([feature, booksy, bos]) => (
                  <tr key={feature}>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a", color: "#f0f0f0", fontWeight: 500 }}>{feature}</td>
                  <td style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a", color: booksy.startsWith("✓") ? "#2ecc71" : booksy.startsWith("⚠") ? "#f39c12" : "#ff6b6b" }}>{booksy}</td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a", background: "rgba(201,168,76,0.04)", color: "#2ecc71" }}>{bos}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "14px 20px", color: "#f0f0f0", fontWeight: 500 }}>Precio desde</td>
                  <td style={{ padding: "14px 20px", color: "#999" }}>~29 €/mes + comisiones</td>
                  <td style={{ padding: "14px 20px", background: "rgba(201,168,76,0.04)", color: "#c9a84c", fontWeight: 700 }}>39 €/mes todo incluido</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MIGRACIÓN */}
      <section style={{ padding: "80px 5%", maxWidth: 860, margin: "0 auto" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12, textAlign: "center" }}>
          Migración sin dolor
        </p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, marginBottom: 14, textAlign: "center" }}>
          Cambia de Booksy a BarberíaOS en 48h
        </h2>
        <p style={{ color: "#999", textAlign: "center", marginBottom: 50, fontSize: "1rem" }}>
          No perderás tus clientes. Nosotros nos encargamos de la transición.
        </p>
        <div>
          {[
            { n: "1", title: "Demo gratuita", tag: "Día 1 — 30 min", text: "Nos cuentas cómo funciona tu barbería ahora mismo: cuántos barberos, qué servicios, cómo gestionas las reservas. Sin compromiso." },
            { n: "2", title: "Configuramos tu barbería", tag: "Día 1 — nosotros lo hacemos", text: "Subimos tus servicios, barberos, horarios y precios. Generamos tu link público y QR de reservas personalizados." },
            { n: "3", title: "Exportas tus clientes de Booksy", tag: "Día 2 — 10 minutos", text: "Desde Booksy puedes exportar tu lista de clientes en CSV. Te explicamos exactamente cómo hacerlo y los importamos en BarberíaOS. Cero pérdida de datos. Consulta la guía completa de migración para el detalle de cada paso." },
            { n: "4", title: "Cambias el link de reservas", tag: "Día 2 — 5 minutos", text: "Actualizas el link en tu bio de Instagram, WhatsApp y Google. A partir de ese momento las reservas nuevas llegan a BarberíaOS, sin comisiones." },
            { n: "5", title: "Cancelas Booksy cuando quieras", tag: null, text: "Una vez que ves que BarberíaOS funciona, cancelas Booksy. Sin urgencia. Sin presión. A tu ritmo." },
          ].map((step, i, arr) => (
            <div key={step.n} style={{ display: "flex", gap: 26, alignItems: "flex-start", padding: "28px 0", borderBottom: i < arr.length - 1 ? "1px solid #2a2a2a" : "none" }}>
              <div style={{ background: "#c9a84c", color: "#0a0a0a", width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", flexShrink: 0, marginTop: 2 }}>
                {step.n}
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 6 }}>
                  {step.title}
                  {step.tag && (
                    <span style={{ display: "inline-block", background: "rgba(46,204,113,0.1)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.3)", padding: "2px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600, marginLeft: 10 }}>
                      {step.tag}
                    </span>
                  )}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#999", lineHeight: 1.6 }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RAZONES */}
      <section style={{ background: "#141414", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a", padding: "80px 5%" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, marginBottom: 50, textAlign: "center" }}>
            Por qué los barberos eligen BarberíaOS
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { num: "0%", title: "Cero comisiones, siempre", text: "No importa cuántos clientes reserves este mes. El precio es fijo. Si creces, no pagas más por reservas." },
              { num: "48h", title: "Operativo desde el primer día", text: "Te configuramos nosotros: servicios, barberos, QR y link público. Tú solo revisas y empiezas a recibir reservas." },
              { num: "100%", title: "Tus datos, siempre tuyos", text: "Historial de clientes, reservas y caja. Todo tuyo, exportable, sin rehenes. Si algún día te vas, te llevas todo." },
              { num: "1", title: "Un sistema, no seis herramientas", text: "Reservas, caja, clientes, equipo, marketing e IA en un solo panel. Sin integraciones rotas ni Excel paralelos." },
              { num: "ES", title: "Software español para barberías españolas", text: "Hecho en España, soporte en español por WhatsApp, precios en euros, sin conversiones ni burocracia anglosajona." },
              { num: "∞", title: "Sin permanencia, sin trampa", text: "Cancela el mes que quieras sin penalizaciones. Sabemos que si funcionamos, te quedas. No necesitamos encerrarte." },
            ].map((r) => (
              <div key={r.num} style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 12, padding: 30 }}>
                <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#c9a84c", lineHeight: 1, marginBottom: 10 }}>{r.num}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontSize: "0.87rem", color: "#999", lineHeight: 1.65 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 5%", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 800, marginBottom: 44, textAlign: "center" }}>
          Preguntas frecuentes sobre la migración desde Booksy
        </h2>
        {faqItems.map((item) => (
          <details key={item.q} style={{ borderBottom: "1px solid #2a2a2a" }}>
            <summary style={{
              cursor: "pointer", padding: "22px 0", fontSize: "0.97rem",
              fontWeight: 600, color: "#fff", display: "flex",
              justifyContent: "space-between", alignItems: "center", gap: 16,
              listStyle: "none",
            }}>
              <span>{item.q}</span>
              <span style={{ color: "#c9a84c", fontSize: "1.2rem", flexShrink: 0 }}>▼</span>
            </summary>
            <p style={{ paddingBottom: 22, fontSize: "0.9rem", color: "#999", lineHeight: 1.7 }}>
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "100px 5%", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 18, lineHeight: 1.2 }}>
          Empieza hoy.{" "}
          <span style={{ color: "#c9a84c" }}>Sin Booksy, sin comisiones.</span>
        </h2>
        <p style={{ color: "#999", fontSize: "1.05rem", marginBottom: 40, lineHeight: 1.7 }}>
          Tus clientes son tuyos. Tu caja es tuya. Tu negocio no tiene por qué financiar el marketplace de otra empresa. Prueba BarberíaOS gratis y comprueba la diferencia en 48 horas.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={BUSINESS_CONFIG.demoUrl} style={{
            background: "#c9a84c", color: "#0a0a0a", padding: "16px 34px",
            borderRadius: 8, fontWeight: 700, fontSize: "1.05rem", textDecoration: "none",
          }}>
            Activar mi barbería gratis
          </Link>
          <a href={WA_ALT} target="_blank" rel="noopener noreferrer" style={{
            background: "transparent", color: "#fff", padding: "16px 34px",
            borderRadius: 8, fontWeight: 600, fontSize: "1.05rem", textDecoration: "none",
            border: "1px solid #2a2a2a",
          }}>
            Hablar por WhatsApp
          </a>
        </div>
        <p style={{ marginTop: 20, fontSize: "0.82rem", color: "#999" }}>
          Sin tarjeta · Sin permanencia · Configuración en 48h · Soporte en español
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#141414", borderTop: "1px solid #2a2a2a", padding: "40px 5%", textAlign: "center" }}>
        <Link href="/" style={{ fontSize: "1.2rem", fontWeight: 700, color: "#c9a84c", textDecoration: "none", display: "block", marginBottom: 12 }}>
          BarberíaOS
        </Link>
        <p style={{ fontSize: "0.82rem", color: "#999" }}>
          © 2026 BarberíaOS ·{" "}
          <Link href="/legal/aviso-legal" style={{ color: "#999", textDecoration: "none" }}>Aviso legal</Link> ·{" "}
          <Link href="/legal/privacidad" style={{ color: "#999", textDecoration: "none" }}>Privacidad</Link> ·{" "}
          <a href="mailto:hola@barberiaos.com" style={{ color: "#999", textDecoration: "none" }}>hola@barberiaos.com</a>
        </p>
        <p style={{ marginTop: 8, fontSize: "0.82rem", color: "#999" }}>
          <Link href="/agenda-online-barberia" style={{ color: "#999", textDecoration: "none" }}>Agenda online barbería</Link>
          {" · "}
          <Link href="/alternativa-a-booksy" style={{ color: "#999", textDecoration: "none" }}>Alternativa a Booksy</Link>
          {" · "}
          <Link href="/migrar-de-booksy" style={{ color: "#999", textDecoration: "none" }}>Cómo migrar de Booksy</Link>
          {" · "}
          <Link href="/calculadora-booksy" style={{ color: "#999", textDecoration: "none" }}>Calculadora Booksy</Link>
          {" · "}
          <Link href="/blog/cuanto-cobra-booksy" style={{ color: "#999", textDecoration: "none" }}>¿Cuánto cobra Booksy?</Link>
        </p>
      </footer>

      <FloatingWhatsAppButton />
    </div>
  );
}
