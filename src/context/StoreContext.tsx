"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import { products } from "../data/products";

type CartLine = { productId: string; quantity: number };
type SavedStore = { cart?: unknown; wishlist?: unknown };
type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  ready: boolean;
  notice: string;
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  clearNotice: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);
const STORAGE_KEY = "swachetna-store-v1";
const productIds = new Set(products.map((product) => product.id));

function readSavedStore(): { cart: CartLine[]; wishlist: string[] } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cart: [], wishlist: [] };
    return normalizeStore(JSON.parse(raw) as SavedStore);
  } catch {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be disabled by the browser. */ }
    return { cart: [], wishlist: [] };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = readSavedStore();
    setCart((current) => mergeCart(saved.cart, current));
    setWishlist(saved.wishlist);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist })); } catch { /* Keep shopping available when browser storage is unavailable. */ }
  }, [cart, wishlist, ready]);

  useEffect(() => {
    const syncFromAnotherTab = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) { setCart([]); setWishlist([]); return; }
      try {
        const saved = JSON.parse(event.newValue) as SavedStore;
        const normalized = normalizeStore(saved);
        setCart(normalized.cart);
        setWishlist(normalized.wishlist);
      } catch { /* Ignore malformed data written by another tab. */ }
    };
    window.addEventListener("storage", syncFromAnotherTab);
    return () => window.removeEventListener("storage", syncFromAnotherTab);
  }, []);

  const addToCart = useCallback((product: Product, requestedQuantity = 1) => {
    if (product.stock < 1) { setNotice(`${product.name} is currently out of stock.`); return; }
    const quantity = Math.min(product.stock, Math.max(1, Math.floor(requestedQuantity)));
    setCart((current) => {
      const found = current.find((line) => line.productId === product.id);
      return found
        ? current.map((line) => line.productId === product.id ? { ...line, quantity: Math.min(product.stock, line.quantity + quantity) } : line)
        : [...current, { productId: product.id, quantity }];
    });
    setNotice(`${product.name} added to your shopping bag.`);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) return;
    setCart((current) => current.map((line) => line.productId === productId ? { ...line, quantity: Math.min(product.stock, Math.max(1, Math.floor(quantity))) } : line));
  }, []);
  const removeFromCart = useCallback((productId: string) => setCart((current) => current.filter((line) => line.productId !== productId)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((productId: string) => {
    if (!productIds.has(productId)) return;
    const removing = wishlist.includes(productId);
    const product = products.find((candidate) => candidate.id === productId);
    setWishlist((current) => removing ? current.filter((id) => id !== productId) : [...current, productId]);
    setNotice(removing ? `${product?.name ?? "Item"} removed from your wishlist.` : `${product?.name ?? "Item"} saved to your wishlist.`);
  }, [wishlist]);
  const clearNotice = useCallback(() => setNotice(""), []);

  const value = useMemo<StoreValue>(() => ({
    cart,
    wishlist,
    ready,
    notice,
    cartCount: cart.reduce((total, line) => total + line.quantity, 0),
    subtotal: cart.reduce((total, line) => total + (products.find((product) => product.id === line.productId)?.price ?? 0) * line.quantity, 0),
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    clearNotice,
  }), [cart, wishlist, ready, notice, addToCart, setQuantity, removeFromCart, clearCart, toggleWishlist, clearNotice]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function normalizeStore(saved: SavedStore): { cart: CartLine[]; wishlist: string[] } {
  const cart = Array.isArray(saved.cart) ? saved.cart.flatMap((line) => {
    if (!line || typeof line !== "object") return [];
    const item = line as Partial<CartLine>;
    if (typeof item.productId !== "string" || !productIds.has(item.productId) || typeof item.quantity !== "number" || !Number.isFinite(item.quantity) || item.quantity < 1) return [];
    const product = products.find((candidate) => candidate.id === item.productId);
    return product && product.stock > 0 ? [{ productId: product.id, quantity: Math.min(Math.floor(item.quantity), product.stock) }] : [];
  }) : [];
  const wishlist = Array.isArray(saved.wishlist) ? saved.wishlist.filter((id): id is string => typeof id === "string" && productIds.has(id)) : [];
  return { cart, wishlist: [...new Set(wishlist)] };
}

function mergeCart(saved: CartLine[], additions: CartLine[]): CartLine[] {
  const merged = new Map(saved.map((line) => [line.productId, line.quantity]));
  for (const line of additions) {
    const product = products.find((candidate) => candidate.id === line.productId);
    if (!product || product.stock < 1) continue;
    merged.set(line.productId, Math.min(product.stock, (merged.get(line.productId) ?? 0) + line.quantity));
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }));
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
