"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../../data/products";
import { useStore } from "../../context/StoreContext";
import { CHECKOUT_DRAFT_KEY, type CheckoutCustomer, type CheckoutDraft, type CheckoutField } from "../../types/checkout";
import styles from "./checkout.module.css";

const initial: CheckoutCustomer = { name: "", email: "", phone: "", address: "", city: "", state: "", postalCode: "" };
const labels: Record<CheckoutField, string> = { name: "Full name", email: "Email address", phone: "Phone number", address: "Street address", city: "City", state: "State", postalCode: "PIN code" };

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, ready } = useStore();
  const [customer, setCustomer] = useState<CheckoutCustomer>(initial);
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [formError, setFormError] = useState("");
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 99;
  const update = (field: CheckoutField, value: string) => setCustomer((current) => ({ ...current, [field]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<CheckoutField, string>> = {};
    if (customer.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) nextErrors.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(customer.phone.replace(/\D/g, ""))) nextErrors.phone = "Enter a valid 10-digit Indian phone number.";
    if (customer.address.trim().length < 5) nextErrors.address = "Enter your street address.";
    if (customer.city.trim().length < 2) nextErrors.city = "Enter your city.";
    if (customer.state.trim().length < 2) nextErrors.state = "Enter your state.";
    if (!/^\d{6}$/.test(customer.postalCode.trim())) nextErrors.postalCode = "Enter a valid 6-digit PIN code.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !cart.length) return;
    if (!consentAccepted) { setFormError("Please confirm that you understand this is a demo checkout."); return; }

    try {
      const draft: CheckoutDraft = { customer, createdAt: new Date().toISOString() };
      window.sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
      setFormError("");
      router.push("/payment");
    } catch {
      setFormError("Your browser could not save these demo details. Please check its storage settings and try again.");
    }
  };

  if (!ready) return <main className={styles.page}><div className="container"><p>Loading checkout...</p></div></main>;
  if (!cart.length) return <main className={styles.page}><div className="container">
    <Link className={styles.back} href="/cart"><ArrowLeft size={14} /> Return to your bag</Link>
    <header><span>YOUR BAG IS EMPTY</span><h1>Ready when<br /><em>you are.</em></h1><p>Add an item to your bag before continuing to checkout.</p></header>
    <section className={styles.empty}><h2>Nothing to check out yet.</h2><Link href="/shop">Explore the collection</Link></section>
  </div></main>;

  return <main className={styles.page}><div className="container">
    <Link className={styles.back} href="/cart"><ArrowLeft size={14} /> Back to your bag</Link>
    <header><span>DEMO CHECKOUT - STEP 1 OF 2</span><h1>Confirm your<br /><em>delivery details.</em></h1><p>Review your details, then continue to the demo payment step. No money will be charged.</p></header>
    <div className={styles.layout}>
      <form onSubmit={submit} noValidate autoComplete="off">
        <span className={styles.step}>01 - DELIVERY DETAILS</span>
        <div className={styles.fields}>{(Object.keys(labels) as CheckoutField[]).map((field) => <label key={field} className={field === "address" ? styles.full : ""}>
          {labels[field]}<input type={field === "email" ? "email" : "text"} inputMode={field === "phone" || field === "postalCode" ? "numeric" : undefined} autoComplete="off" value={customer[field]} aria-invalid={Boolean(errors[field])} onChange={(event) => update(field, event.target.value)} required />
          {errors[field] && <small className={styles.error}>{errors[field]}</small>}
        </label>)}</div>
        <label className={styles.consent}><input type="checkbox" checked={consentAccepted} aria-invalid={Boolean(formError)} onChange={(event) => { setConsentAccepted(event.target.checked); if (event.target.checked) setFormError(""); }} /><span>I understand this is a frontend demo. My details stay in this browser and no payment or delivery will be processed.</span></label>
        {formError && <small className={styles.error} role="alert">{formError}</small>}
        <button className={styles.place} type="submit">Confirm details &amp; continue <ArrowRight size={17} /></button>
      </form>
      <aside className={styles.summary}>
        <span className={styles.step}>02 - ORDER SUMMARY</span>
        <div><span>Items</span><strong>{cart.reduce((sum, line) => sum + line.quantity, 0)}</strong></div>
        <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div><span>Demo shipping</span><strong>{shipping ? formatCurrency(shipping) : "Free"}</strong></div>
        <small>Free demo shipping over {formatCurrency(1500)}.</small>
        <div className={styles.total}><span>Total</span><strong>{formatCurrency(subtotal + shipping)}</strong></div>
        <small><ShieldCheck size={14} /> Sample checkout only - no payment details requested.</small>
      </aside>
    </div>
  </div></main>;
}
