"use client";

import Link from "next/link";
import Image from "next/image";
import { useProducts } from "../../../context/ProductsContext";
import styles from "./Hero.module.css";

export default function Hero() {
  const { content } = useProducts();

  return (
    <section className={styles.hero}>
      <div className={styles.heroImage}>
        <div className={styles.photoSlides} aria-hidden="true">
          <div className={`${styles.slide} ${styles.slideOne}`}><Image src="/images/hero1.webp" alt="" fill priority sizes="(max-width: 768px) 100vw, 58vw" /></div>
          <div className={`${styles.slide} ${styles.slideTwo}`}><Image src="/images/hero%202.webp" alt="" fill sizes="(max-width: 768px) 100vw, 58vw" /></div>
          <div className={`${styles.slide} ${styles.slideThree}`}><Image src="/images/hero3.webp" alt="" fill sizes="(max-width: 768px) 100vw, 58vw" /></div>
        </div>
        <div className={styles.imageOverlay} />

        <div className={styles.imageContent}>
          <span>SWACHETNA</span>
          <strong>Thoughtfully chosen.</strong>
        </div>
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            A collection with purpose
          </p>

          <h1>
            {content.title || "Beautiful things, meaningful choices."}
          </h1>

          <p className={styles.description}>
            {content.description || "Discover a thoughtfully curated collection created for everyday living, gifting and moments that matter."}
          </p>

          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryButton}>
              Shop the collection
              <span>→</span>
            </Link>

            <Link href="/about" className={styles.textButton}>
              Discover our story
            </Link>
          </div>

          <div className={styles.note}>
            <span className={styles.noteLine} />
            <span>Thoughtfully chosen for everyday living.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
