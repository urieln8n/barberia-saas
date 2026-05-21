import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_8%_0%,rgba(37,99,235,0.11),transparent_28rem),radial-gradient(circle_at_92%_8%,rgba(212,175,102,0.14),transparent_24rem),linear-gradient(180deg,#FFFFFF_0%,#FAF8F4_48%,#F1ECE3_100%)]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="page-shell-narrow px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
