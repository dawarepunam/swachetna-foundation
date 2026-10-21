import Link from "next/link";
import styles from "./MissionSection.module.css";

export default function MissionSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.visual}>
            <div className={styles.quoteMark}>✦</div>

            <p>
              A stronger, healthier, self-reliant India.
            </p>

            <span>THE SWACHETNA FOUNDATION MISSION</span>
          </div>

          <div className={styles.content}>
            <span className={styles.label}>OUR PURPOSE</span>

            <h2>
              Work to create
              <em>a difference.</em>
            </h2>

            <p>
              Founded in Pune in 2023, Swachetna Foundation works with
              communities across food security, education, women’s health,
              farmer welfare, healthcare and financial empowerment.
            </p>

            <Link href="/about" className={styles.link}>
              Explore our work
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
