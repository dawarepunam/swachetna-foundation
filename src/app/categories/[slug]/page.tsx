import { notFound } from "next/navigation";
import { categories as fallbackCategories, products as fallbackProducts } from "../../../data/products";
import { fetchStrapiAdminWorkspace } from "../../../lib/strapi";
import ProductGrid from "../../../components/products/ProductGrid/ProductGrid";
import type { Product } from "../../../types/product";
import styles from "./category.module.css";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let categoryName = "";
  let categoryDescription = "";
  let items: Product[] = [];

  try {
    const data = await fetchStrapiAdminWorkspace();
    if (data) {
      const catMatch = Array.isArray(data.categories)
        ? data.categories.find((c: any) => c.slug === slug)
        : null;

      if (catMatch) {
        categoryName = catMatch.name;
        categoryDescription = catMatch.description || "";
      }

      if (categoryName && Array.isArray(data.products)) {
        items = data.products
          .filter((p: any) => p.category?.toLowerCase() === categoryName.toLowerCase())
          .map((p: any) => ({
            id: p.id ? String(p.id) : p.slug,
            slug: p.slug,
            name: p.name,
            category: p.category,
            price: Number(p.price) || 0,
            originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
            shortDescription: p.description ? p.description.slice(0, 80) : "Handcrafted piece.",
            description: p.description || p.name || "",
            sku: p.sku || `SW-${p.slug}`,
            stock: Number(p.stock) || 0,
            featuredRank: 1,
          }));
      }
    }
  } catch (err) {
    console.warn("Strapi category fetch fallback:", err);
  }

  // Fallback if not found in Strapi
  if (!categoryName) {
    const fallbackCat = fallbackCategories.find((item) => item.slug === slug);
    if (!fallbackCat) notFound();
    categoryName = fallbackCat.name;
    categoryDescription = fallbackCat.description;
    items = fallbackProducts.filter((product) => product.category === fallbackCat.name);
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <span className={styles.eyebrow}>THE COLLECTION</span>
        <h1>
          {categoryName}
          <em>.</em>
        </h1>
        <p>{categoryDescription}</p>
        <div className={styles.count}>{items.length} pieces</div>
        <ProductGrid products={items} />
      </div>
    </main>
  );
}
