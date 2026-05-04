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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      await supabase.auth.signOut();
    }

    router.push("/login");
    router.refresh();
  }

  const NavLinks = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <Link href="/dashboard" className="text-lg font-bold">
          BarberíaOS
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold"
        >
          Menú
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-72 transform bg-white p-6 shadow-2xl transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="text-xl font-bold"
          >
            BarberíaOS
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-neutral-200 px-3 py-1 text-sm"
          >
            X
          </button>
        </div>

        <NavLinks />

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Cerrar sesión
        </button>
      </aside>

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-neutral-200 bg-white p-6 md:block">
        <Link href="/dashboard" className="mb-10 block text-2xl font-bold">
          BarberíaOS
        </Link>

        <NavLinks />

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}
