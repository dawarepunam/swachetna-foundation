import { notFound } from "next/navigation";
import { categories, products } from "../../../data/products";
import ProductGrid from "../../../components/products/ProductGrid/ProductGrid";
import styles from "./category.module.css";
export function generateStaticParams(){return categories.map((category)=>({slug:category.slug}));}
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const category=categories.find((item)=>item.slug===slug);if(!category)notFound();const items=products.filter((product)=>product.category===category.name);return <main className={styles.page}><div className="container"><span className={styles.eyebrow}>THE COLLECTION</span><h1>{category.name}<em>.</em></h1><p>{category.description}</p><div className={styles.count}>{items.length} demo pieces</div><ProductGrid products={items}/></div></main>}
