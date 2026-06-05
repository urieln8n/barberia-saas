"use client";

import { useSidebarCollapse } from "./sidebar-context";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapse();

  return (
    <main
      className={`min-h-screen px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-20 transition-[margin] duration-300 ease-in-out md:px-8 md:py-8 lg:px-10 lg:py-9 ${
        collapsed ? "md:ml-16" : "md:ml-64"
      }`}
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,55,0.04), transparent), #F5F6F8",
      }}
    >
      <div className="page-shell">{children}</div>
    </main>
  );
}
