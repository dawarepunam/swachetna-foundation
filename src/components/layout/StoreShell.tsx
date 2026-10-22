"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { StoreProvider, useStore } from "../../context/StoreContext";
import { ProductsProvider, useProducts } from "../../context/ProductsContext";
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

// Inner component that uses ProductsContext to pass products to StoreProvider
function StoreWithProducts({ children, isAdmin }: { children: ReactNode; isAdmin: boolean }) {
  const { products } = useProducts();
  return (
    <StoreProvider allProducts={products}>
      {isAdmin ? children : <><MainLayout>{children}</MainLayout><Notice /></>}
    </StoreProvider>
  );
}

export default function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <ProductsProvider>
      <StoreWithProducts isAdmin={isAdminRoute}>
        {children}
      </StoreWithProducts>
    </ProductsProvider>
  );
}
