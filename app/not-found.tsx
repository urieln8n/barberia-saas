import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ background: "linear-gradient(160deg, #090909 0%, #0D0D0F 60%, #111118 100%)" }}
    >
      <div className="max-w-md">
        {/* Logo text */}
        <p className="mb-8 text-[13px] font-black uppercase tracking-[0.22em] text-white/20">
          Barbería<span style={{ color: "#D4AF37" }}>OS</span>
        </p>

        {/* 404 number */}
        <h1
          className="mb-4 text-[96px] font-black leading-none tracking-tighter"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #F5D060 50%, #B8941A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>

        <h2 className="mb-3 text-xl font-black text-white/80">
          Página no encontrada
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-white/40">
          La página que buscas no existe o fue movida.
          Vuelve al panel para continuar gestionando tu barbería.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 text-sm font-black text-[#09090B] shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition hover:-translate-y-0.5 hover:bg-[#F5D060]"
          >
            Ir al panel
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.04] px-6 text-sm font-bold text-white/60 transition hover:border-white/[0.20] hover:text-white/85"
          >
            Página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
