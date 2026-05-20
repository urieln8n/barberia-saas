"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

const WA_CALC = `${BUSINESS_CONFIG.whatsappUrl.split("?")[0]}?text=Hola%2C%20quiero%20migrar%20de%20Booksy%20a%20Barber%C3%ADaOS`;

type PlanBOS = { precio: number; nombre: string };
type Veredicto = "ahorra" | "neutro" | "pierde";

function getPlanBOS(reservas: number): PlanBOS {
  if (reservas <= 40) return { precio: 39, nombre: "Arranca — 39 €/mes" };
  if (reservas <= 150) return { precio: 79, nombre: "Control — 79 €/mes" };
  return { precio: 149, nombre: "Domina — 149 €/mes" };
}

export function CalculadoraBooksyClient() {
  const [reservas, setReservas] = useState(80);
  const [ticket, setTicket] = useState(25);
  const [boostPct, setBoostPct] = useState(25);
  const [boostActivo, setBoostActivo] = useState(true);
  const [planBooksy, setPlanBooksy] = useState(29);
  const [planKey, setPlanKey] = useState<"base" | "pro" | "prem">("base");

  const handlePlan = useCallback((precio: number, key: "base" | "pro" | "prem") => {
    setPlanBooksy(precio);
    setPlanKey(key);
  }, []);

  const reservasBoost = boostActivo ? Math.round(reservas * boostPct / 100) : 0;
  const comisionBooksy = boostActivo ? Math.round(reservasBoost * ticket * 0.3) : 0;
  const totalBooksy = planBooksy + comisionBooksy;
  const planBOS = getPlanBOS(reservas);
  const ahorro = totalBooksy - planBOS.precio;
  const ahorroAnual = ahorro * 12;

  const maxVal = Math.max(totalBooksy, planBOS.precio, 10);
  const pctBooksy = Math.min(100, Math.round((totalBooksy / maxVal) * 100));
  const pctBOS = Math.min(100, Math.round((planBOS.precio / maxVal) * 100));

  const veredicto: Veredicto = ahorro >= 50 ? "ahorra" : ahorro >= 0 ? "neutro" : "pierde";

  const veredictoStyles: Record<Veredicto, { border: string; bg: string; titleColor: string }> = {
    ahorra: { bg: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.3)", titleColor: "#2ecc71" },
    neutro: { bg: "rgba(243,156,18,0.08)", border: "1px solid rgba(243,156,18,0.3)", titleColor: "#f39c12" },
    pierde: { bg: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.3)", titleColor: "#ff6b6b" },
  };
  const vs = veredictoStyles[veredicto];

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, sans-serif", minHeight: "100vh", padding: "40px 20px 80px" }}>

      {/* NAV */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 5%", marginBottom: 32,
      }}>
        <Link href="/" style={{ fontSize: "1.2rem", fontWeight: 700, color: "#c9a84c", textDecoration: "none" }}>
          BarberíaOS
        </Link>
        <Link href="/alternativa-a-booksy" style={{ fontSize: "0.85rem", color: "#999", textDecoration: "none" }}>
          ← Volver a la comparativa
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-block", background: "rgba(201,168,76,0.15)",
            border: "1px solid #c9a84c", color: "#c9a84c",
            padding: "5px 14px", borderRadius: 999,
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: 20,
          }}>
            Calculadora gratuita
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>
            Calcula tu coste aproximado frente a <span style={{ color: "#c9a84c" }}>BarberíaOS</span>
          </h1>
          <p style={{ color: "#999", fontSize: "1rem", maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
            Compara el coste aproximado de trabajar con plataformas y el coste fijo de BarberíaOS. Los resultados son estimaciones: cada plataforma, plan y configuración comercial puede variar.
          </p>
        </div>

        {/* INPUTS */}
        <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, padding: 36, marginBottom: 28 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#c9a84c", marginBottom: 28, paddingBottom: 14, borderBottom: "1px solid #2a2a2a" }}>
            Tu barbería en números
          </h2>

          {/* Reservas */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#f0f0f0", marginBottom: 8 }}>
              Reservas al mes{" "}
              <span style={{ fontSize: "0.78rem", color: "#999", fontWeight: 400 }}>(total entre todos los barberos)</span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range" min={10} max={400} step={5} value={reservas}
                onChange={(e) => setReservas(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#c9a84c" }}
              />
              <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", fontSize: "0.95rem", fontWeight: 700, padding: "8px 14px", borderRadius: 8, width: 100, textAlign: "center" }}>
                {reservas}
              </div>
            </div>
          </div>

          {/* Ticket */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#f0f0f0", marginBottom: 8 }}>
              Ticket medio por servicio{" "}
              <span style={{ fontSize: "0.78rem", color: "#999", fontWeight: 400 }}>(€)</span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range" min={10} max={80} step={1} value={ticket}
                onChange={(e) => setTicket(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#c9a84c" }}
              />
              <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", fontSize: "0.95rem", fontWeight: 700, padding: "8px 14px", borderRadius: 8, width: 100, textAlign: "center" }}>
                {ticket} €
              </div>
            </div>
          </div>

          {/* Boost % */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#f0f0f0", marginBottom: 8 }}>
              % de reservas vía Booksy Boost{" "}
              <span style={{ fontSize: "0.78rem", color: "#999", fontWeight: 400 }}>(si aplica en tu caso)</span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range" min={0} max={80} step={5} value={boostPct}
                onChange={(e) => setBoostPct(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#c9a84c" }}
              />
              <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#fff", fontSize: "0.95rem", fontWeight: 700, padding: "8px 14px", borderRadius: 8, width: 100, textAlign: "center" }}>
                {boostPct}%
              </div>
            </div>
          </div>

          {/* Boost toggle */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#f0f0f0", marginBottom: 8 }}>
              ¿Usas Booksy Boost activamente?
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Sí, tengo Boost activo", value: true },
                { label: "No, solo plan base", value: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setBoostActivo(opt.value)}
                  style={{
                    background: boostActivo === opt.value ? "rgba(201,168,76,0.15)" : "#1e1e1e",
                    border: `1px solid ${boostActivo === opt.value ? "#c9a84c" : "#2a2a2a"}`,
                    color: boostActivo === opt.value ? "#c9a84c" : "#999",
                    padding: "9px 18px", borderRadius: 8,
                    fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Booksy */}
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#f0f0f0", marginBottom: 8 }}>
              Plan de Booksy que tienes{" "}
              <span style={{ fontSize: "0.78rem", color: "#999", fontWeight: 400 }}>(€/mes)</span>
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Base (~29 €)", price: 29, key: "base" as const },
                { label: "Pro (~49 €)", price: 49, key: "pro" as const },
                { label: "Premium (~79 €)", price: 79, key: "prem" as const },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handlePlan(opt.price, opt.key)}
                  style={{
                    background: planKey === opt.key ? "rgba(201,168,76,0.15)" : "#1e1e1e",
                    border: `1px solid ${planKey === opt.key ? "#c9a84c" : "#2a2a2a"}`,
                    color: planKey === opt.key ? "#c9a84c" : "#999",
                    padding: "9px 18px", borderRadius: 8,
                    fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTADOS */}
        <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
          <div style={{ background: "#1e1e1e", padding: "18px 36px", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#999", borderBottom: "1px solid #2a2a2a" }}>
            Desglose de costes mensual
          </div>
          {[
            { label: "Cuota mensual Booksy", value: `${planBooksy} €`, color: "#ff6b6b", bold: false },
            { label: "Comisiones estimadas del modelo marketplace", value: `${comisionBooksy} €`, color: "#ff6b6b", bold: false },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", borderBottom: "1px solid #2a2a2a", gap: 12 }}>
              <div style={{ fontSize: "0.92rem", color: "#999", maxWidth: "60%" }}>{row.label}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: row.color }}>{row.value}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", borderBottom: "1px solid #2a2a2a", gap: 12 }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Coste aproximado de plataforma / mes</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ff6b6b" }}>{totalBooksy} €</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", borderBottom: "1px solid #2a2a2a", gap: 12, borderTop: "2px solid #2a2a2a" }}>
            <div style={{ fontSize: "0.92rem", color: "#999" }}>BarberíaOS recomendado para tu barbería</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#c9a84c" }}>{planBOS.nombre}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", borderBottom: "1px solid #2a2a2a", gap: 12 }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2ecc71" }}>Ahorro mensual con BarberíaOS</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2ecc71" }}>
              {ahorro > 0 ? `+${ahorro} €/mes` : ahorro === 0 ? "0 € (empate)" : `${ahorro} €/mes`}
            </div>
          </div>

          {/* Barras comparativas */}
          <div style={{ padding: "24px 36px 28px" }}>
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#999", marginBottom: 5 }}>
                <span>Booksy</span>
                <span>{totalBooksy} €/mes</span>
              </div>
              <div style={{ background: "#2a2a2a", borderRadius: 4, height: 10, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg,#e63946,#ff6b6b)", borderRadius: 4, width: `${pctBooksy}%`, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#999", marginBottom: 5 }}>
                <span>BarberíaOS</span>
                <span>{planBOS.precio} €/mes</span>
              </div>
              <div style={{ background: "#2a2a2a", borderRadius: 4, height: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg,#c9a84c,#e8c86d)", borderRadius: 4, width: `${pctBOS}%`, transition: "width 0.4s ease" }} />
              </div>
            </div>
          </div>
        </div>

        {/* VEREDICTO */}
        <div style={{ borderRadius: 14, padding: "32px 36px", marginBottom: 28, textAlign: "center", background: vs.bg, border: vs.border }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, color: "#999" }}>
            {veredicto === "ahorra" ? "Ahorro estimado" : veredicto === "neutro" ? "Coste similar" : "Coste menor"}
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 10, color: vs.titleColor }}>
            {veredicto === "ahorra"
              ? `Podrías ahorrar ${ahorro} €/mes con un precio fijo`
              : veredicto === "neutro"
              ? "Coste similar, con diferencias de control del canal"
              : "Con tu volumen actual, una plataforma puede salir más barata"}
          </h3>
          <p style={{ fontSize: "0.92rem", color: "#999", lineHeight: 1.65, maxWidth: 500, margin: "0 auto 20px" }}>
            {veredicto === "ahorra"
              ? `Con tus datos, el coste aproximado de plataforma sería ${totalBooksy}€/mes. BarberíaOS te costaría ${planBOS.precio}€/mes fijo. Con BarberíaOS tus reservas entran por tu propio canal y tus clientes son tuyos.`
              : veredicto === "neutro"
              ? "Los números son parecidos. La diferencia está en el canal propio, la caja, clientes, marketing e IA dentro del mismo panel."
              : `Para ${reservas} reservas/mes y esta configuración, una plataforma puede tener menor coste directo. Considera BarberíaOS si valoras canal propio, caja, clientes y control operativo integrados.`}
          </p>
          {veredicto === "ahorra" && (
            <p style={{ fontSize: "0.8rem", color: "#999", marginBottom: 22 }}>
              Ahorro anual estimado: <strong style={{ color: "#2ecc71", fontSize: "1rem" }}>+{ahorroAnual} €</strong>
            </p>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "40px 36px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16 }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 10 }}>¿Quieres revisar tu caso con datos reales?</h3>
          <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: 24 }}>
            Pide un diagnóstico y vemos si BarberíaOS encaja con tu volumen, equipo y forma actual de reservar.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pedir-demo" style={{
              display: "inline-block", background: "#c9a84c", color: "#0a0a0a",
              padding: "16px 36px", borderRadius: 8, fontWeight: 700, fontSize: "1rem", textDecoration: "none",
            }}>
              Pedir diagnóstico gratis
            </Link>
            <a href={WA_CALC} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", background: "transparent", color: "#fff",
              padding: "16px 36px", borderRadius: 8, fontWeight: 600, fontSize: "1rem",
              textDecoration: "none", border: "1px solid #2a2a2a",
            }}>
              Hablar por WhatsApp
            </a>
          </div>
          <p style={{ marginTop: 12, fontSize: "0.78rem", color: "#999" }}>
            Sin tarjeta de crédito · Sin permanencia · Soporte en español
          </p>
        </div>

        {/* Internal links */}
        <div style={{ marginTop: 40, textAlign: "center", fontSize: "0.85rem", color: "#999" }}>
          <Link href="/alternativa-a-booksy" style={{ color: "#c9a84c", textDecoration: "none" }}>← Comparativa completa Booksy vs BarberíaOS</Link>
          {" · "}
          <Link href="/blog/cuanto-cobra-booksy" style={{ color: "#c9a84c", textDecoration: "none" }}>¿Cuánto cobra Booksy de verdad?</Link>
        </div>

      </div>
    </div>
  );
}
