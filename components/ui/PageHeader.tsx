import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  section?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Strip de métricas rápidas debajo del título — usa StatCard o chips propios */
  metrics?: ReactNode;
  children?: ReactNode;
  /**
   * default  — fondo blanco, acento dorado
   * compact  — padding reducido, título menor (cabeceras de listado)
   * studio   — acento violet, fondo tinted (Studio IA)
   * dark     — reservado para futuro uso
   * light    — alias de default
   * glass    — reservado para futuro uso
   */
  variant?: "default" | "compact" | "studio" | "dark" | "light" | "glass";
  className?: string;
};

export function PageHeader({
  eyebrow,
  section,
  title,
  description,
  action,
  metrics,
  children,
  variant = "default",
  className = "",
}: PageHeaderProps) {
  const label = eyebrow ?? section;

  const isCompact  = variant === "compact";
  const isStudio   = variant === "studio";

  // Contenedor
  const containerCls = isCompact
    ? `relative overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.04] px-5 py-4 shadow-none md:px-6 md:py-5 ${className}`
    : isStudio
      ? `relative overflow-hidden rounded-[20px] border border-[#A78BFA]/25 bg-[#110822]/80 px-6 py-6 shadow-none md:px-8 md:py-7 ${className}`
      : `relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04] px-6 py-6 shadow-none md:px-8 md:py-7 ${className}`;

  // Línea de acento superior
  const accentCls = isStudio
    ? "pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A78BFA]/60 to-transparent"
    : "pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent";

  // Label eyebrow
  const labelCls = isStudio ? "label-section-violet" : "label-section";

  // Título
  const titleSize = isCompact
    ? "clamp(1.25rem, 2.5vw, 1.75rem)"
    : "clamp(1.625rem, 3.5vw, 2.5rem)";

  return (
    <section className={containerCls}>
      {/* Accent line */}
      <div className={accentCls} />

      {/* Studio IA — puntitos decorativos de fondo */}
      {isStudio && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #6D28D9 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          {label && (
            <p className={labelCls}>{label}</p>
          )}
          <h1
            className="text-white/90 font-black tracking-tight leading-tight"
            style={{
              fontSize: titleSize,
              letterSpacing: "-0.03em",
              marginTop: label ? "0.375rem" : "0",
            }}
          >
            {title}
          </h1>
          {description && !isCompact && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              {description}
            </p>
          )}
          {description && isCompact && (
            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/40">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {action}
          </div>
        )}
      </div>

      {/* Metrics strip */}
      {metrics && (
        <div className="mt-5 border-t border-white/[0.07] pt-4">
          {metrics}
        </div>
      )}

      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
