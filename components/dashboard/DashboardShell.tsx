"use client";

import { useSidebarCollapse } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <main
      className={`relative min-h-screen px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-20 transition-[margin] duration-300 ease-in-out md:px-8 md:py-8 lg:px-10 lg:py-9 ${
        collapsed ? "md:ml-16" : "md:ml-[248px]"
      }`}
      style={{
        background:
          "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(212,175,55,0.09) 0%, transparent 60%), #0C0C0F",
      }}
    >
      {/* Dot grid sutil */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(212,175,55,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="page-shell relative">{children}</div>
    </main>
  );
}
