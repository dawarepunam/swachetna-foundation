import type { Product } from "../../../types/product";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

interface ProductGridProps {
  products: Product[];
  showBuyNow?: boolean;
}

export default function ProductGrid({
  products,
  showBuyNow = false,
}: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showBuyNow={showBuyNow}
        />
      ))}
    </div>
  );
}
