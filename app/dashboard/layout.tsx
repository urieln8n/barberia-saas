import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F2EA] font-sans antialiased">
      <Sidebar />
      <main className="min-h-screen px-4 pb-12 pt-20 md:ml-64 md:px-8 md:py-10 md:max-w-[calc(100vw-16rem)]">
        {children}
      </main>
    </div>
  );
}