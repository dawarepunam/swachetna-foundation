"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { products, formatCurrency } from "../../data/products";
import { useStore } from "../../context/StoreContext";
import ProductArtwork from "../../components/products/ProductArtwork/ProductArtwork";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, setQuantity, removeFromCart, clearCart, subtotal, ready } = useStore();
  const lines = cart
    .map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) }))
    .filter((line) => line.product);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 99;

  if (!ready) {
    return <main className={styles.page}><div className="container"><p>Loading your shopping bag…</p></div></main>;
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.crumb}>
          <Link href="/shop"><ArrowLeft size={15} /> Continue shopping</Link>
          <span>SHOPPING BAG</span>
        </div>

        <header className={styles.heading}>
          <span>YOUR BAG</span>
          <h1>{lines.length ? <>Little things,<br /><em>on their way.</em></> : <>A little something,<br /><em>for every day.</em></>}</h1>
        </header>

        {lines.length === 0 ? (
          <section className={styles.empty}>
            <span className={styles.emptyIcon}><ShoppingBag size={23} strokeWidth={1.6} /></span>
            <span className={styles.emptyLabel}>A FRESH START</span>
            <h2>Your bag is ready for something lovely.</h2>
            <p>Discover thoughtful finds for everyday living and meaningful gifting.</p>
            <Link href="/shop">Explore the collection <ArrowRight size={15} /></Link>
          </section>
        ) : (
          <div className={styles.layout}>
            <section className={styles.lines} aria-label="Items in your shopping bag">
              <div className={styles.lineHead}>
                <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                <button type="button" onClick={clearCart}>Clear shopping bag</button>
              </div>

              {lines.map(({ product, quantity }) => product && (
                <article className={styles.line} key={product.id}>
                  <Link href={`/products/${product.slug}`} className={styles.art} aria-label={`View ${product.name}`}>
                    <ProductArtwork product={product} />
                  </Link>
                  <div className={styles.details}>
                    <span>{product.category}</span>
                    <Link href={`/products/${product.slug}`}><h2>{product.name}</h2></Link>
                    <p>{product.shortDescription}</p>
                    <div className={styles.controls}>
                      <div className={styles.quantity} aria-label={`Quantity: ${quantity}`}>
                        <button type="button" onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => setQuantity(product.id, quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                      </div>
                      <button type="button" className={styles.remove} onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={15} /><span>Remove</span></button>
                    </div>
                  </div>
                  <strong className={styles.linePrice}>{formatCurrency(product.price * quantity)}</strong>
                </article>
              ))}
            </section>

            <aside className={styles.summary}>
              <span className={styles.summaryLabel}>ORDER SUMMARY</span>
              <h2>A little summary.</h2>
              <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
              <div><span>Estimated shipping</span><strong>{shipping ? formatCurrency(shipping) : "Free"}</strong></div>
              <small>{subtotal < 1500 ? `Free shipping estimate over ${formatCurrency(1500)}.` : "Free shipping estimate applied."}</small>
              <div className={styles.total}><span>Total</span><strong>{formatCurrency(subtotal + shipping)}</strong></div>
              <Link className={styles.checkout} href="/checkout">Continue to checkout <ArrowRight size={17} /></Link>
              <p className={styles.notice}><ShieldCheck size={15} /> Checkout is not connected to payment or delivery yet.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
