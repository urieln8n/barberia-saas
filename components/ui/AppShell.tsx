import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <main className="min-h-screen px-4 pb-12 pt-20 md:ml-64 md:max-w-[calc(100vw-16rem)] md:px-7 md:py-7 lg:px-10 lg:py-9">
      <div className={`mx-auto w-full max-w-7xl space-y-6 ${className}`}>
        {children}
      </div>
    </main>
  );
}
