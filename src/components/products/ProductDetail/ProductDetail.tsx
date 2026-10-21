"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "../../../types/product";
import { formatCurrency, products } from "../../../data/products";
import { useStore } from "../../../context/StoreContext";
import ProductArtwork from "../ProductArtwork/ProductArtwork";
import ProductGrid from "../ProductGrid/ProductGrid";
import styles from "./ProductDetail.module.css";

const artworkViews = ["Full view", "Detail", "In context"];

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  const saved = wishlist.includes(product.id);

  useEffect(() => () => {
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
  }, []);

  const handleAdd = () => {
    if (product.stock < 1) return;
    addToCart(product, quantity);
    setAdded(true);
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (product.stock < 1) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return <main className={styles.page}>
    <div className="container">
      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
      </nav>
      <div className={styles.layout}>
        <section className={styles.gallery} aria-label="Product artwork">
          <div className={`${styles.mainArt} ${view === 1 ? styles.viewDetail : view === 2 ? styles.viewStyled : ""}`}>
            <ProductArtwork product={product} large />
          </div>
          <div className={styles.thumbnails} aria-label="Artwork views">
            {artworkViews.map((label, index) => <button type="button" key={label} className={view === index ? styles.thumbActive : ""} onClick={() => setView(index)} aria-label={`Show ${label.toLowerCase()}`} aria-pressed={view === index}>
              <ProductArtwork product={product} />
              <span>{label}</span>
            </button>)}
          </div>
          <small>Illustrative product artwork · not a product photograph</small>
        </section>

        <section className={styles.details} aria-labelledby="product-title">
          <span className={styles.category}>{product.category}</span>
          <h1 id="product-title">{product.name}</h1>
          <p className={styles.desc}>{product.description}</p>
          <div className={styles.price}>
            <strong>{formatCurrency(product.price)}</strong>
            {product.originalPrice && <><del>{formatCurrency(product.originalPrice)}</del><span className={styles.discount}>Save {formatCurrency(product.originalPrice - product.price)}</span></>}
          </div>
          <p className={styles.tax}>All prices are in INR. This is a sample storefront.</p>
          <p className={`${styles.stock} ${product.stock < 1 ? styles.outOfStock : ""}`}>
            <span aria-hidden="true" />{product.stock > 0 ? `In stock · ${product.stock} available` : "Currently out of stock"}
          </p>

          <div className={styles.purchase}>
            <div className={styles.purchaseOptions}>
              <span className={styles.quantityLabel}>Quantity</span>
              <div className={styles.optionControls}>
                <div className={styles.quantity} aria-label="Choose quantity">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity" disabled={quantity <= 1}><Minus size={15} /></button>
                  <output aria-live="polite" aria-label="Quantity">{quantity}</output>
                  <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} aria-label="Increase quantity" disabled={quantity >= product.stock}><Plus size={15} /></button>
                </div>
                <button type="button" className={`${styles.heart} ${saved ? styles.saved : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}><Heart size={19} fill={saved ? "currentColor" : "none"} /><span>{saved ? "Saved" : "Save"}</span></button>
              </div>
            </div>
            <div className={styles.actions}>
              <button type="button" className={`${styles.add} ${added ? styles.added : ""}`} disabled={product.stock < 1} onClick={handleAdd} aria-live="polite">
                {product.stock < 1 ? "Out of stock" : added ? <>Added to cart <Check size={17} /></> : <>Add to cart <ArrowRight size={17} /></>}
              </button>
              <button type="button" className={styles.buyNow} disabled={product.stock < 1} onClick={handleBuyNow}>
                {product.stock < 1 ? "Out of stock" : <>Buy now <ArrowRight size={17} /></>}
              </button>
            </div>
          </div>

          <div className={styles.promises}>
            <p><Truck size={17} aria-hidden="true" /> Free demo shipping over {formatCurrency(1500)}</p>
            <p><ShieldCheck size={17} aria-hidden="true" /> Secure demo checkout · No payment is taken</p>
          </div>
          <dl className={styles.metadata}>
            <div><dt>Product code</dt><dd>{product.sku}</dd></div>
            <div><dt>Collection</dt><dd>{product.category}</dd></div>
          </dl>
        </section>
      </div>
      {related.length > 0 && <section className={styles.related}>
        <div className={styles.relatedHeading}><span>You may also like</span><h2>More from this collection.</h2></div>
        <ProductGrid products={related} />
      </section>}
    </div>
  </main>;
}

