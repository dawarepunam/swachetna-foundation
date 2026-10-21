"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ClipboardCheck, PackageSearch } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { formatCurrency } from "../../data/products";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "../../types/checkout";
import styles from "./confirmation.module.css";

type Order = { reference: string; total: number; customer: { name: string }; createdAt: string; demo: boolean; paymentMethod?: PaymentMethod };

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const { clearCart } = useStore();

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("ref");
    try {
      const latest = window.localStorage.getItem("swachetna-last-demo-order");
      if (!latest) return;
      const parsed = JSON.parse(latest) as Order;
      if (parsed.reference === reference) {
        setOrder(parsed);
        clearCart();
      }
    } catch { /* Ignore malformed demo order data. */ }
  }, [clearCart]);

  return <main className={styles.page}><div className="container"><section className={styles.card}>
    <span className={styles.icon}><Check size={26} /></span>
    <span className={styles.eyebrow}>DEMO CONFIRMATION</span>
    <h1>All set.<br /><em>In this demo only.</em></h1>
    <p>Your demo order details were saved in this browser. No real order, payment or delivery was started.</p>
    {order ? <div className={styles.reference}>
      <span>DEMO REFERENCE</span><strong>{order.reference}</strong>
      <small>{order.customer.name} - {formatCurrency(order.total)}</small>
      {order.paymentMethod && <small>Method: {PAYMENT_METHOD_LABELS[order.paymentMethod]}</small>}
    </div> : <div className={styles.reference}><span>DEMO REFERENCE</span><strong>No order was found in this session</strong></div>}
    <div className={styles.actions}><Link href="/shop">Shop again</Link><Link href="/track-order"><PackageSearch size={16} /> View demo status</Link></div>
    <div className={styles.note}><ClipboardCheck size={16} /> No email or payment confirmation was sent.</div>
  </section></div></main>;
}
