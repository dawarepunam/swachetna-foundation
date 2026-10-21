import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "../../../data/products";
import ProductGrid from "../../products/ProductGrid/ProductGrid";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>CURATED FOR YOU</span>
            <h2>Thoughtful finds.</h2>
          </div>

          <Link href="/shop" className={styles.viewAll}>
            View all products <ArrowRight size={16} />
          </Link>
        </div>

        <ProductGrid products={products} showBuyNow />
      </div>
    </section>
  );
}
