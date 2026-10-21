"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, Smartphone, Truck } from "lucide-react";
import { formatCurrency, products } from "../../data/products";
import { useStore } from "../../context/StoreContext";
import { CHECKOUT_DRAFT_KEY, PAYMENT_METHOD_LABELS, type CheckoutDraft, type DemoOrder, type PaymentMethod } from "../../types/checkout";
import styles from "./payment.module.css";

const methods: { id: PaymentMethod; title: string; detail: string; icon: typeof Smartphone }[] = [
  { id: "upi", title: "UPI", detail: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", title: "Credit or debit card", detail: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "cod", title: "Cash on delivery", detail: "Pay when your order arrives", icon: Truck },
];

function isCheckoutDraft(value: unknown): value is CheckoutDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<CheckoutDraft>;
  const customer = draft.customer;
  return Boolean(customer && typeof customer === "object"
    && ["name", "email", "phone", "address", "city", "state", "postalCode"].every((key) => typeof customer[key as keyof typeof customer] === "string")
    && typeof draft.createdAt === "string");
}

export default function PaymentPage() {
  const router = useRouter();
  const { cart, subtotal, ready } = useStore();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 99;
  const lines = useMemo(() => cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) })).filter((line) => line.product), [cart]);

  useEffect(() => {
    if (!ready) return;
    if (!cart.length) { router.replace("/cart"); return; }
    try {
      const stored = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (!isCheckoutDraft(parsed)) { router.replace("/checkout"); return; }
      setDraft(parsed);
      setLoading(false);
    } catch {
      router.replace("/checkout");
    }
  }, [ready, cart.length, router]);

  const completeDemoPayment = () => {
    if (!draft || !cart.length) { router.replace("/checkout"); return; }
    setProcessing(true);
    setError("");
    try {
      const reference = `SW-DEMO-${Date.now().toString().slice(-7)}`;
      const order: DemoOrder = {
        reference,
        total: subtotal + shipping,
        customer: { name: draft.customer.name },
        createdAt: new Date().toISOString(),
        demo: true,
        paymentMethod: method,
      };
      const previous = JSON.parse(window.localStorage.getItem("swachetna-demo-orders") || "[]");
      const orders = Array.isArray(previous) ? previous : [];
      window.localStorage.setItem("swachetna-demo-orders", JSON.stringify([order, ...orders]));
      window.localStorage.setItem("swachetna-last-demo-order", JSON.stringify(order));
      window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
      router.push(`/order-confirmation?ref=${reference}`);
    } catch {
      setProcessing(false);
      setError("We could not save the demo order in this browser. Please check browser storage and try again.");
    }
  };

  if (loading || !ready) return <main className={styles.page}><div className="container"><p className={styles.loading}>Loading checkout details…</p></div></main>;

  return <main className={styles.page}>
    <div className="container">
      <Link className={styles.back} href="/checkout"><ArrowLeft size={15} /> Back to delivery details</Link>
      <header className={styles.header}>
        <span>CHECKOUT · STEP 2 OF 2</span>
        <h1>Choose your<br /><em>payment preference.</em></h1>
        <p>Delivery details are confirmed for {draft?.customer.name}. Choose a payment preference to continue.</p>
      </header>

      <div className={styles.layout}>
        <section className={styles.paymentPanel} aria-labelledby="payment-method-title">
          <div className={styles.panelHeading}><span>02</span><div><h2 id="payment-method-title">Payment method</h2><p>Select a preferred payment option.</p></div></div>
          <div className={styles.methods}>
            {methods.map(({ id, title, detail, icon: Icon }) => <button key={id} type="button" className={`${styles.method} ${method === id ? styles.selected : ""}`} aria-pressed={method === id} onClick={() => { setMethod(id); setError(""); }}>
              <span className={styles.methodIcon}><Icon size={19} /></span>
              <span className={styles.methodText}><strong>{title}</strong><small>{detail}</small></span>
              <span className={styles.radio}>{method === id && <span />}</span>
            </button>)}
          </div>
          <div className={styles.demoNotice}><LockKeyhole size={17} /><p><strong>Payment information</strong><span>Payment processing is not connected. No card, UPI, or banking details are collected; continuing saves a sample order in this browser.</span></p></div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.payButton} onClick={completeDemoPayment} disabled={processing}>
            {processing ? "Saving order…" : <>Complete sample order <ArrowRight size={17} /></>}
          </button>
          <p className={styles.secure}><Check size={14} /> You will not be charged</p>
        </section>

        <aside className={styles.summary} aria-label="Order summary">
          <span className={styles.summaryEyebrow}>ORDER SUMMARY</span>
          <h2>Your order</h2>
          <div className={styles.items}>{lines.map(({ product, quantity }) => product && <div className={styles.item} key={product.id}>
            <span className={styles.quantity}>{quantity}</span><span className={styles.itemName}>{product.name}</span><strong>{formatCurrency(product.price * quantity)}</strong>
          </div>)}</div>
          <div className={styles.totalLines}><div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div><span>Estimated shipping</span><strong>{shipping ? formatCurrency(shipping) : "Free"}</strong></div><small>Free shipping estimate over {formatCurrency(1500)}.</small><div className={styles.grandTotal}><span>Total</span><strong>{formatCurrency(subtotal + shipping)}</strong></div></div>
          <div className={styles.deliverTo}><span>DELIVERING TO</span><strong>{draft?.customer.name}</strong><p>{draft?.customer.address}, {draft?.customer.city}, {draft?.customer.state} {draft?.customer.postalCode}</p><small>{PAYMENT_METHOD_LABELS[method]} selected</small></div>
        </aside>
      </div>
    </div>
  </main>;
}
