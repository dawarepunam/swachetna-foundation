import { BookOpen, HeartPulse, Sprout } from "lucide-react";
import styles from "./ImpactSection.module.css";

const areas = [
  { Icon: Sprout, title: "Community wellbeing", text: "Programs focused on food security, healthcare and the wellbeing of local communities." },
  { Icon: BookOpen, title: "Learning and opportunity", text: "Education initiatives that support children and help people build practical skills." },
  { Icon: HeartPulse, title: "Health and self-reliance", text: "Work that promotes women’s health, farmer welfare and financial empowerment." },
];

export default function ImpactSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top}>
          <span className={styles.eyebrow}>OUR AREAS OF WORK</span>
          <h2>Care in action.<br /><em>Change with purpose.</em></h2>
          <p>Swachetna Foundation works with communities in Pune and across Maharashtra to create opportunities for a stronger, healthier and more self-reliant India.</p>
        </div>
        <div className={styles.cards}>
          {areas.map(({ Icon, title, text }) => (
            <article key={title}><Icon size={20} /><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}
