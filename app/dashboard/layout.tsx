import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="premium-grid-bg min-h-screen font-sans antialiased">
      <Sidebar />
      <main className="min-h-screen px-4 pb-12 pt-20 md:ml-64 md:max-w-[calc(100vw-16rem)] md:px-7 md:py-7 lg:px-10 lg:py-9">
        <div className="page-shell">{children}</div>
      </main>
    </div>
  );
}
