"use client";

import { useSidebarCollapse } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <main
      className={`relative min-h-screen px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-20 transition-[margin] duration-300 ease-in-out md:px-8 md:py-8 lg:px-10 lg:py-9 ${
        collapsed ? "md:ml-16" : "md:ml-[248px]"
      }`}
      style={{ background: "#09090B" }}
    >
      {/* Orb gold top-center */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full opacity-60"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 65%)" }}
      />
      {/* Orb violet bottom-left */}
      <div
        className="pointer-events-none fixed bottom-0 left-[10%] h-[500px] w-[500px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%)" }}
      />
      {/* Orb gold right */}
      <div
        className="pointer-events-none fixed right-[-5%] top-[30%] h-[400px] w-[400px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
      />
      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(212,175,55,0.06) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="page-shell relative">{children}</div>
    </main>
  );
}
