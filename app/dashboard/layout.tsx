import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="premium-grid-bg min-h-screen bg-[#F6F8FB] font-sans antialiased">
      <Sidebar />
      <main className="min-h-screen px-4 pb-12 pt-20 md:ml-64 md:max-w-[calc(100vw-16rem)] md:px-8 md:py-8">
        <div className="page-shell">{children}</div>
      </main>
    </div>
  );
}
