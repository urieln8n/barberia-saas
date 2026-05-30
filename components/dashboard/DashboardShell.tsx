"use client";

import { useSidebarCollapse } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <main
      className={`dashboard-premium-bg min-h-screen px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-20 transition-all duration-300 ease-in-out md:px-7 md:py-7 lg:px-10 lg:py-9 ${
        collapsed ? "md:ml-16" : "md:ml-64"
      }`}
    >
      <div className="page-shell">{children}</div>
    </main>
  );
}
