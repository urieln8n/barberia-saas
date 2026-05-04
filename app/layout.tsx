import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="min-h-screen px-4 pb-10 pt-24 md:ml-64 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}