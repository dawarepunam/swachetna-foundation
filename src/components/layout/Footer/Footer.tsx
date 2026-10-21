import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import styles from "./Footer.module.css";

const linkGroups = [
  {
    title: "EXPLORE",
    links: [
      ["Shop all", "/shop"],
      ["Collections", "/categories"],
      ["Search", "/search"],
      ["Wishlist", "/wishlist"],
      ["Shopping bag", "/cart"],
    ],
  },
  {
    title: "SWACHETNA",
    links: [
      ["Our story", "/about"],
      ["Contact", "/contact"],
      ["FAQs", "/faq"],
      ["Order tracking", "/track-order"],
      ["My account", "/account/profile"],
    ],
  },
  {
    title: "INFORMATION",
    links: [
      ["Privacy", "/policies#privacy"],
      ["Terms", "/policies#terms"],
      ["Shipping", "/policies#shipping"],
      ["Returns", "/policies#returns"],
      ["Order history", "/account/orders"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.logo} aria-label="Swachetna Foundation home">
            <span>swachetna</span>
            <small>foundation</small>
          </Link>
          <p>Working towards a stronger, healthier and self-reliant India.</p>
          <div className={styles.note}><Heart aria-hidden="true" />Thoughtfully curated for everyday living.</div>
        </div>

        {linkGroups.map((group) => (
          <nav className={styles.column} key={group.title} aria-label={group.title}>
            <h2>{group.title}</h2>
            {group.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p>© 2026 Swachetna Foundation</p>
          <Link href="/faq">Help &amp; FAQs <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </footer>
  );
}
