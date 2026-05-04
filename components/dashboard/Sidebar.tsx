"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/agenda", label: "Agenda" },
  { href: "/dashboard/clientes", label: "Clientes" },
  { href: "/dashboard/servicios", label: "Servicios" },
  { href: "/dashboard/barberos", label: "Barberos" },
  { href: "/dashboard/pagos", label: "Pagos" },
  { href: "/dashboard/qr", label: "QR Reservas" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
        <Link href="/dashboard" className="text-lg font-bold text-neutral-950">
          BarberíaOS
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900"
        >
          Menú
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-xl font-bold text-neutral-950"
              >
                BarberíaOS
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-300 px-3 py-1 text-sm"
              >
                X
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 w-full rounded-xl border border-neutral-300 px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Cerrar sesión
            </button>
          </aside>
        </div>
      )}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-neutral-200 bg-white p-6 md:block">
        <Link
          href="/dashboard"
          className="mb-10 block text-2xl font-bold text-neutral-950"
        >
          BarberíaOS
        </Link>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  active
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 rounded-xl border border-neutral-300 px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}