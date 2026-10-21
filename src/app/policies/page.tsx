import type { Metadata } from "next";
import styles from "./policies.module.css";

export const metadata: Metadata = { title: "Store information and policies" };

const sections = [
  { id: "privacy", title: "Privacy", text: "This frontend demo does not send information to a server. Cart, wishlist, sample account, newsletter and demo orders may be stored in this browser's LocalStorage. Clear browser storage after using a shared or public device." },
  { id: "terms", title: "Terms of use", text: "This site is a user-interface demonstration. Product names, descriptions, stock counts and prices are sample data. No real products are sold and no purchases are accepted here." },
  { id: "shipping", title: "Shipping", text: "The shipping estimate in the cart is for interface demonstration only. This demo has no delivery partner, dispatch, delivery promise or tracking service." },
  { id: "returns", title: "Returns and refunds", text: "No payment or real order takes place, so there is no refund process. A demo order reference is created only in this browser and is not a real order confirmation." },
];

export default function PoliciesPage() {
  return <main className={styles.page}><div className="container"><span className={styles.eyebrow}>CLEAR, SIMPLE INFORMATION</span><h1>Store <em>policies.</em></h1><p>These are demo disclosures for the prototype, not live business policies.</p><nav>{sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav><div className={styles.sections}>{sections.map((section) => <section id={section.id} key={section.id}><h2>{section.title}</h2><p>{section.text}</p></section>)}</div></div></main>;
}
