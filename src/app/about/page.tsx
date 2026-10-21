import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartPulse, Sprout } from "lucide-react";
import styles from "./about.module.css";

export const metadata: Metadata = { title: "About Swachetna Foundation" };

const areas = [
  { Icon: Sprout, number: "01", title: "Food and community care", text: "Community initiatives supporting food security and wellbeing." },
  { Icon: BookOpen, number: "02", title: "Education and opportunity", text: "Learning support and skill-building initiatives for children and communities." },
  { Icon: HeartPulse, number: "03", title: "Health and self-reliance", text: "Work across women’s health, healthcare, farmer welfare and financial empowerment." },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>SWACHETNA FOUNDATION <i /> PUNE</span>
            <h1>Work to create<br /><em>a difference.</em></h1>
            <p>Founded in 2023, Swachetna Foundation works towards a stronger, healthier and self-reliant India by creating meaningful opportunities with communities.</p>
            <a className={styles.primaryLink} href="https://swachetna.org/" target="_blank" rel="noreferrer">Visit Swachetna Foundation <ArrowRight aria-hidden="true" size={16} /></a>
          </div>
          <div className={styles.heroVisual}>
            <Image src="/images/hero1.webp" alt="Swachetna Foundation team working together in a community garden" fill priority sizes="(max-width: 800px) 100vw, 46vw" />
            <div className={styles.imageCaption}><span>TOGETHER WE CARE</span><strong>Meaningful work,<br />rooted in community.</strong></div>
          </div>
        </div>
      </section>

      <section className={`container ${styles.story}`}>
        <div className={styles.storyHeading}>
          <span className={styles.eyebrow}>WHAT GUIDES OUR WORK</span>
          <h2>Compassion<br />into <em>meaningful action.</em></h2>
        </div>
        <div className={styles.storyCopy}>
          <p>Swachetna Foundation is a non-profit organization based in Pune, Maharashtra. Its work focuses on food security, education, women’s health, farmer welfare, healthcare and financial empowerment.</p>
          <p>Across community programs, the foundation brings volunteers and local partners together to support wellbeing, learning, dignity and opportunity.</p>
          <Link href="/categories">Explore the collection <ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
      </section>

      <section className={styles.values} aria-label="Our areas of work">
        <div className={`container ${styles.valuesInner}`}>
          <header className={styles.valuesHeading}><span className={styles.eyebrow}>WHERE WE FOCUS</span><h2>Care in action.</h2></header>
          <div className={styles.valueGrid}>
            {areas.map(({ Icon, number, title, text }) => (
              <article className={styles.valueCard} key={title}>
                <div className={styles.valueTop}><span>{number}</span><Icon aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
