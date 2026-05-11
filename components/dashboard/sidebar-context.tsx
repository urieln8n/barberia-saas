"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SidebarCollapseCtx = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseCtx>({
  collapsed: false,
  toggle: () => {},
});

export function SidebarCollapseProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sidebar-collapsed") === "true") setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <SidebarCollapseContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export const useSidebarCollapse = () => useContext(SidebarCollapseContext);
