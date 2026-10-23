"use client";

import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { categories as baseCategories, products as baseProducts } from "../../data/products";

export type AdminProduct = { id: string; slug: string; name: string; description?: string; category: string; subcategory?: string; sku: string; price: number; originalPrice?: number; stock: number; status: "Published" | "Draft" };
export type AdminCategory = { slug: string; name: string; description: string; subcategories?: string[] | string };
export type AdminOrder = { id: string; customer: string; total: number; createdAt: string; status: "Pending" | "Processing" | "Shipped" | "Delivered"; paymentMethod?: string };
export type AdminCampaign = { id: string; name: string; area: string; status: "Active" | "Draft" };
export type AdminContent = { title: string; description: string };
export type AdminSettings = { organization: string; email: string; phone: string; website: string; address: string };

type WorkspaceState = {
  products: AdminProduct[];
  categories: AdminCategory[];
  campaigns: AdminCampaign[];
  content: AdminContent;
  settings: AdminSettings;
  orderStatuses: Record<string, AdminOrder["status"]>;
};
type AdminDataValue = WorkspaceState & {
  ready: boolean;
  orders: AdminOrder[];
  setProducts: Dispatch<SetStateAction<AdminProduct[]>>;
  setCategories: Dispatch<SetStateAction<AdminCategory[]>>;
  setCampaigns: Dispatch<SetStateAction<AdminCampaign[]>>;
  setContent: Dispatch<SetStateAction<AdminContent>>;
  setSettings: Dispatch<SetStateAction<AdminSettings>>;
  setOrderStatus: (id: string, status: AdminOrder["status"]) => void;
};

const STORAGE_KEY = "swachetna-admin-workspace-v1";
const ORDER_STORAGE_KEY = "swachetna-demo-orders";
const initialProducts: AdminProduct[] = baseProducts.map((product) => ({ id: product.id, slug: product.slug, name: product.name, category: product.category, subcategory: product.subcategory, sku: product.sku, price: product.price, originalPrice: product.originalPrice, stock: product.stock, status: "Published" }));
const initialCategories: AdminCategory[] = baseCategories.map(({ slug, name, description, subcategories }) => ({ slug, name, description, subcategories }));
const initialContent: AdminContent = { title: "Work to create a difference.", description: "Swachetna Foundation works with communities across food security, education and wellbeing." };
const initialSettings: AdminSettings = { organization: "Swachetna Foundation", email: "hello@swachetna.org", phone: "", website: "https://swachetna.org", address: "Pune, Maharashtra, India" };

const AdminDataContext = createContext<AdminDataValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [content, setContent] = useState(initialContent);
  const [settings, setSettings] = useState(initialSettings);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, AdminOrder["status"]>>({});
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      let loadedFromStrapi = false;
      try {
        const { fetchStrapiAdminWorkspace } = await import("../../lib/strapi");
        const strapiData = await fetchStrapiAdminWorkspace();
        if (strapiData) {
          if (Array.isArray(strapiData.products) && strapiData.products.length > 0) {
            setProducts(strapiData.products.map((p: any, idx: number) => ({
              id: p.id ? String(p.id) : `strapi-${idx}`,
              slug: p.slug || "",
              name: p.name || "",
              description: p.description || "",
              category: p.category || "",
              subcategory: p.subcategory || "",
              sku: p.sku || "",
              price: Number(p.price) || 0,
              originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
              stock: Number(p.stock) || 0,
              status: p.status === "Draft" ? "Draft" : "Published",
            })));
          }
          if (Array.isArray(strapiData.categories) && strapiData.categories.length > 0) {
            setCategories(strapiData.categories.map((c: any) => ({
              slug: c.slug,
              name: c.name,
              description: c.description || "",
              subcategories: typeof c.subcategories === "string" ? c.subcategories.split(",").map((s: string) => s.trim()).filter(Boolean) : (c.subcategories || []),
            })));
          }
          if (Array.isArray(strapiData.campaigns) && strapiData.campaigns.length > 0) {
            setCampaigns(strapiData.campaigns.map((c: any, idx: number) => ({
              id: c.id ? String(c.id) : `camp-${idx}`,
              name: c.name || "",
              area: c.area || "",
              status: c.status === "Draft" ? "Draft" : "Active",
            })));
          }
          if (strapiData.content && strapiData.content.title) {
            setContent(strapiData.content);
          }
          if (strapiData.settings && strapiData.settings.organization) {
            setSettings((prev) => ({ ...prev, ...strapiData.settings }));
          }
          if (Array.isArray(strapiData.orders) && strapiData.orders.length > 0) {
            const strapiOrders: AdminOrder[] = strapiData.orders.map((o: any, idx: number) => ({
              id: o.orderId || `order-${idx}`,
              customer: o.customer || "Anonymous",
              total: Number(o.total) || 0,
              createdAt: o.orderDate || new Date().toISOString(),
              paymentMethod: o.paymentMethod || "UPI",
              status: (o.status as AdminOrder["status"]) || "Pending",
            }));
            setOrders(strapiOrders);
          }
          loadedFromStrapi = true;
        }
      } catch (err) {
        console.warn("Strapi workspace fetch skipped, falling back to local:", err);
      }

      if (!loadedFromStrapi) {
        try {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as Partial<WorkspaceState>;
            if (Array.isArray(parsed.products)) setProducts(parsed.products.filter(isAdminProduct));
            if (Array.isArray(parsed.categories)) setCategories(parsed.categories.filter(isAdminCategory));
            if (Array.isArray(parsed.campaigns)) setCampaigns(parsed.campaigns.filter(isAdminCampaign));
            if (parsed.content && typeof parsed.content.title === "string" && typeof parsed.content.description === "string") setContent(parsed.content);
            if (parsed.settings && typeof parsed.settings.organization === "string") setSettings({ ...initialSettings, ...parsed.settings });
            if (parsed.orderStatuses && typeof parsed.orderStatuses === "object") setOrderStatuses(parsed.orderStatuses);
          }
        } catch { /* ignore fallback errors */ }
      }

      try {
        const rawOrders = window.localStorage.getItem(ORDER_STORAGE_KEY);
        const parsedOrders: unknown = rawOrders ? JSON.parse(rawOrders) : [];
        if (Array.isArray(parsedOrders)) {
          const valid = parsedOrders.filter(isLocalOrder).map((order) => ({
            id: order.reference,
            customer: order.customer.name,
            total: order.total,
            createdAt: order.createdAt,
            paymentMethod: order.paymentMethod,
            status: "Pending" as const,
          }));
          setOrders([...new Map(valid.map((order) => [order.id, order])).values()]);
        }
      } catch {
        setOrders([]);
      }

      setReady(true);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const stored: WorkspaceState = { products, categories, campaigns, content, settings, orderStatuses };
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored)); } catch { /* Ignore */ }

    // Strapi सह बॅकग्राउंड sync
    const timer = setTimeout(async () => {
      try {
        const { updateStrapiAdminWorkspace } = await import("../../lib/strapi");
        await updateStrapiAdminWorkspace({
          products: products.map(({ id, ...rest }) => rest),
          categories: categories.map((c) => ({
            ...c,
            subcategories: Array.isArray(c.subcategories) ? c.subcategories.join(", ") : (c.subcategories || "")
          })),
          campaigns: campaigns.map(({ id, ...rest }) => rest),
          content,
          settings,
          orders: orders.map(({ id, ...rest }) => ({
            ...rest,
            orderId: id,
            status: orderStatuses[id] ?? rest.status,
          })),
        });
      } catch {
        // Silently skip if backend is unreachable
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [products, categories, campaigns, content, settings, orderStatuses, orders, ready]);

  const setOrderStatus = (id: string, status: AdminOrder["status"]) => {
    setOrderStatuses((current) => ({ ...current, [id]: status }));
    // Strapi मध्ये order status तात्काळ अपडेट करणे
    setTimeout(async () => {
      try {
        const { fetchStrapiAdminWorkspace, updateStrapiAdminWorkspace } = await import("../../lib/strapi");
        const workspace = await fetchStrapiAdminWorkspace();
        if (workspace && Array.isArray(workspace.orders)) {
          const updatedOrders = workspace.orders.map((o: any) =>
            (o.orderId === id || String(o.id) === id) ? { ...o, status } : o
          );
          await updateStrapiAdminWorkspace({ orders: updatedOrders.map(({ id: _id, ...rest }: any) => rest) });
        }
      } catch {
        // Silently skip
      }
    }, 300);
  };
  const value = useMemo<AdminDataValue>(() => ({
    products, categories, campaigns, content, settings, orderStatuses, orders: orders.map((order) => ({ ...order, status: orderStatuses[order.id] ?? order.status })), ready,
    setProducts, setCategories, setCampaigns, setContent, setSettings, setOrderStatus,
  }), [products, categories, campaigns, content, settings, orderStatuses, orders, ready]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error("useAdminData must be used inside AdminDataProvider");
  return context;
}

function isAdminProduct(value: unknown): value is AdminProduct {
  if (!value || typeof value !== "object") return false;
  const product = value as Partial<AdminProduct>;
  return typeof product.id === "string" && typeof product.slug === "string" && typeof product.name === "string" && (product.description === undefined || typeof product.description === "string") && typeof product.category === "string" && typeof product.sku === "string" && typeof product.price === "number" && typeof product.stock === "number" && (product.status === "Published" || product.status === "Draft");
}
function isAdminCategory(value: unknown): value is AdminCategory {
  if (!value || typeof value !== "object") return false;
  const category = value as Partial<AdminCategory>;
  return typeof category.slug === "string" && typeof category.name === "string" && typeof category.description === "string";
}
function isAdminCampaign(value: unknown): value is AdminCampaign {
  if (!value || typeof value !== "object") return false;
  const campaign = value as Partial<AdminCampaign>;
  return typeof campaign.id === "string" && typeof campaign.name === "string" && typeof campaign.area === "string" && (campaign.status === "Active" || campaign.status === "Draft");
}
function isLocalOrder(value: unknown): value is { reference: string; total: number; customer: { name: string }; createdAt: string; paymentMethod?: string } {
  if (!value || typeof value !== "object") return false;
  const order = value as { reference?: unknown; total?: unknown; customer?: { name?: unknown }; createdAt?: unknown; paymentMethod?: unknown };
  return typeof order.reference === "string" && typeof order.total === "number" && typeof order.customer?.name === "string" && typeof order.createdAt === "string";
}
