import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
