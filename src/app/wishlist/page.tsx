"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { products } from "../../data/products";
import { useStore } from "../../context/StoreContext";
import ProductGrid from "../../components/products/ProductGrid/ProductGrid";
import styles from "./wishlist.module.css";

export default function WishlistPage(){const {wishlist,ready}=useStore();const saved=products.filter((p)=>wishlist.includes(p.id));return <main className={styles.page}><div className="container"><header className={styles.heading}><div><span className={styles.eyebrow}>KEPT CLOSE</span><h1>Your <em>shortlist.</em></h1></div><p className={styles.intro}>Keep the pieces you love close, all in one place.</p></header>{!ready?<p className={styles.loading}>Loading your wishlist…</p>:saved.length?<ProductGrid products={saved}/>:<div className={styles.empty}><Heart size={25}/><span className={styles.emptyLabel}>A PLACE FOR YOUR FAVOURITES</span><h2>Your shortlist is empty.</h2><p>Tap the heart on anything you would like to save.</p><Link href="/shop">Explore collections <ArrowRight size={16}/></Link></div>}</div></main>}
