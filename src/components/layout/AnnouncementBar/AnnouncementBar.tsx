import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  return (
    <aside className={styles.bar} aria-label="Store announcement">
      <div className={styles.staticContent}>
        <div className={styles.message}>
          <Sparkles className={styles.sparkle} size={14} aria-hidden="true" />
          <p><span className={styles.headline}>Thoughtful finds for everyday living</span><span className={styles.separator} aria-hidden="true">·</span><span className={styles.brand}>Swachetna Foundation</span></p>
        </div>
        <Link href="/faq" className={styles.link}>Learn more <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className={styles.marquee} role="group" aria-label="Thoughtful finds from Swachetna Foundation">
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div className={styles.marqueeGroup} key={copy} aria-hidden={copy === 1}>
              <Sparkles size={13} aria-hidden="true" />
              <span className={styles.marqueeHeadline}>Thoughtful finds for everyday living</span>
              <span className={styles.marqueeDot} aria-hidden="true">✦</span>
              <span className={styles.marqueeBrand}>Swachetna Foundation</span>
              <Link href="/faq" tabIndex={copy === 1 ? -1 : undefined}>Learn more <ArrowUpRight size={13} aria-hidden="true" /></Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
