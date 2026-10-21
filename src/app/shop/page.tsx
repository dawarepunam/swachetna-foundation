import type { Metadata } from "next";
import CatalogBrowser from "../../components/products/CatalogBrowser/CatalogBrowser";
import styles from "./ShopPage.module.css";

export const metadata: Metadata = { title: "Shop the collection" };
export default function ShopPage() {
  return <main><section className={styles.hero}><div className="container"><div className={styles.breadcrumb}><a href="/">Home</a><span>/</span><span>Shop</span></div><div className={styles.heroContent}><div><span className={styles.eyebrow}>THE SWACHETNA COLLECTION</span><h1>Find a little<br/><em>meaning in the everyday.</em></h1></div><p>Considered objects for living, gifting and the moments in between.</p></div></div></section><section className={styles.productsSection}><div className="container"><CatalogBrowser/></div></section></main>;
}
