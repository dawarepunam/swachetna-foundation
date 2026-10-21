import Link from "next/link";
import { ArrowUpRight, Gift, House, Shapes } from "lucide-react";
import { categories } from "../../../data/products";
import styles from "./FeaturedCategories.module.css";

const categoryIcons = [House, Gift, Shapes];

export default function FeaturedCategories() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>SHOP BY MOOD</span>
            <h2>A place for the things you love.</h2>
          </div>
          <Link href="/categories">
            Explore all collections <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => {
            const CategoryIcon = categoryIcons[index] ?? Shapes;

            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`${styles.card} ${styles[["living", "gifting", "collection"][index]]}`}
              >
                <span className={styles.number}>0{index + 1}</span>
                <span className={styles.visual} aria-hidden="true">
                  <CategoryIcon size={38} strokeWidth={1.35} />
                </span>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>EXPLORE THE COLLECTION</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className={styles.cardBottom}>
                    <span>{category.count} thoughtfully chosen pieces</span>
                    <span className={styles.arrow}><ArrowUpRight size={18} /></span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
