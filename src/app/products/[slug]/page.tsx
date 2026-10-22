import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products as fallbackProducts } from "../../../data/products";
import { fetchStrapiAdminWorkspace } from "../../../lib/strapi";
import ProductDetail from "../../../components/products/ProductDetail/ProductDetail";
import type { Product } from "../../../types/product";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await fetchStrapiAdminWorkspace();
    if (data && Array.isArray(data.products)) {
      const match = data.products.find((p: any) => p.slug === slug);
      if (match) {
        return {
          id: match.id ? String(match.id) : match.slug,
          slug: match.slug,
          name: match.name,
          category: match.category || "Collections",
          price: Number(match.price) || 0,
          originalPrice: match.originalPrice ? Number(match.originalPrice) : undefined,
          badge: match.badge || undefined,
          shortDescription: match.description ? match.description.slice(0, 80) : "Handmade thoughtful find.",
          description: match.description || match.name || "",
          sku: match.sku || `SW-${match.slug}`,
          stock: Number(match.stock) || 0,
          featuredRank: 1,
        };
      }
    }
  } catch (err) {
    console.warn("Strapi product fetch failed, fallback:", err);
  }

  const fallback = fallbackProducts.find((item) => item.slug === slug);
  return fallback || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? { title: product.name, description: product.shortDescription } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

