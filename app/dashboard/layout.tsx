import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarCollapseProvider } from "@/components/dashboard/sidebar-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarCollapseProvider>
      <div className="premium-grid-bg min-h-screen font-sans antialiased">
        <Sidebar />
        <DashboardShell>{children}</DashboardShell>
      </div>
    </SidebarCollapseProvider>
  );
}
