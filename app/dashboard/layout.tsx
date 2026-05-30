import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarCollapseProvider } from "@/components/dashboard/sidebar-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ActionToastProvider } from "@/components/ui/ActionToast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActionToastProvider>
      <SidebarCollapseProvider>
        <div className="min-h-screen bg-[#F7F3EA] font-sans antialiased">
          <Sidebar />
          <DashboardShell>{children}</DashboardShell>
        </div>
      </SidebarCollapseProvider>
    </ActionToastProvider>
  );
}
