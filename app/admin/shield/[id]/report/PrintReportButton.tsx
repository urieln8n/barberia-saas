"use client";

import { Printer } from "lucide-react";

export function PrintReportButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-dark print:hidden">
      <Printer size={14} />
      Imprimir / Guardar como PDF
    </button>
  );
}
