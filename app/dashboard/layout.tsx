import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-ink">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
