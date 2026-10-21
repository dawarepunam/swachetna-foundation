"use client";

import { useState, type FormEvent } from "react";
import { PackageSearch } from "lucide-react";
import styles from "./track-order.module.css";

type Order = { reference: string; customer: { name: string }; total: number; createdAt: string; demo: boolean };

export default function TrackOrderPage() {
  const [reference, setReference] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const orders = JSON.parse(localStorage.getItem("swachetna-demo-orders") || "[]") as Order[];
    const found = orders.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase());
    setOrder(found || null);
    setMessage(found ? "Demo order found in this browser." : "This demo reference was not found in this browser.");
  };
  return <main className={styles.page}><div className="container"><span className={styles.eyebrow}>A SMALL CHECK-IN</span><h1>Track a <em>demo order.</em></h1><p>This only searches demo records saved in this browser.</p><form onSubmit={submit}><label htmlFor="ref">Demo order reference</label><input id="ref" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="SW-DEMO-1234567" required/><button><PackageSearch size={16}/> Check demo order</button></form>{message && <section className={styles.result} role="status"><strong>{message}</strong>{order && <><p>{order.reference} · {order.customer.name}</p><ol><li className={styles.done}>Demo order created</li><li>Delivery status unavailable</li><li>No real shipment exists</li></ol><small>This is a frontend demo; parcel or courier tracking is not available.</small></>}</section>}</div></main>;
}
