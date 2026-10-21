"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { StoreProvider, useStore } from "../../context/StoreContext";
import MainLayout from "./MainLayout/MainLayout";

function Notice() {
  const { notice, clearNotice } = useStore();
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(clearNotice, 2600);
    return () => window.clearTimeout(timeout);
  }, [notice, clearNotice]);
  if (!notice) return null;
  return <div className="store-notice" role="status">✓ &nbsp; {notice}<button onClick={clearNotice} aria-label="Close">×</button></div>;
}

export default function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return <StoreProvider>{isAdminRoute ? children : <><MainLayout>{children}</MainLayout><Notice /></>}</StoreProvider>;
}
