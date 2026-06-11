import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarCollapseProvider } from "@/components/dashboard/sidebar-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ActionToastProvider } from "@/components/ui/ActionToast";
import { NavigationProgress } from "@/components/ui/NavigationProgress";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActionToastProvider>
      <SidebarCollapseProvider>
        <div className="min-h-screen bg-[#080B14] font-sans antialiased">
          <NavigationProgress />
          <Sidebar />
          <DashboardShell>{children}</DashboardShell>
        </div>
      </SidebarCollapseProvider>
    </ActionToastProvider>
  );
}
