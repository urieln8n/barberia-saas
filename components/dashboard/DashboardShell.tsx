"use client";

import { useSidebarCollapse } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <main
      className={`min-h-screen bg-[var(--app-bg)] px-4 pb-28 pt-20 transition-all duration-300 ease-in-out md:px-7 md:py-7 lg:px-10 lg:py-9 ${
        collapsed ? "md:ml-16" : "md:ml-64"
      }`}
    >
      <div className="page-shell">{children}</div>
    </main>
  );
}
