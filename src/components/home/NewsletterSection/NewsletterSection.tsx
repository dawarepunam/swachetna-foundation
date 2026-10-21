import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./NewsletterSection.module.css";

export default function NewsletterSection() {
  return <section className={styles.section}><div className={styles.wrap}><div><span>THE SWACHETNA FOUNDATION</span><h2>Thoughtful action,<br/><em>shared together.</em></h2><p>Learn more about the foundation’s work and ways to get involved.</p></div><div className={styles.contact}><Link href="/about">Discover our work <ArrowUpRight size={18}/></Link><small>Visit the foundation for current programs and updates.</small></div></div></section>;
}
