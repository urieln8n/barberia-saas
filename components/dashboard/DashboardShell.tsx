"use client";

import { useSidebarCollapse } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <main
      className={`min-h-screen bg-[#F8FAFC] px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-20 transition-all duration-300 ease-in-out md:px-8 md:py-8 lg:px-10 lg:py-9 ${
        collapsed ? "md:ml-16" : "md:ml-64"
      }`}
    >
      <div className="page-shell">{children}</div>
    </main>
  );
}
