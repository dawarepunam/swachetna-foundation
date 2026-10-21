export type ProductBadge = "New" | "Bestseller" | "Sale" | "Popular";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: ProductBadge;
  shortDescription: string;
  description: string;
  sku: string;
  stock: number;
  featuredRank: number;
}
