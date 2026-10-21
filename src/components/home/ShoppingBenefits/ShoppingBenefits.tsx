import styles from "./ShoppingBenefits.module.css";

const benefits = [
  {
    number: "01",
    title: "Community wellbeing",
    description:
      "Community programs focus on food security, healthcare and wellbeing.",
  },
  {
    number: "02",
    title: "Learning and opportunity",
    description:
      "Education initiatives support children and access to learning.",
  },
  {
    number: "03",
    title: "Health and dignity",
    description:
      "Health awareness and support for women are part of the foundation’s work.",
  },
  {
    number: "04",
    title: "Skills and self-reliance",
    description:
      "Community initiatives create practical opportunities to learn and earn.",
  },
];

export default function ShoppingBenefits() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <span>WHY SWACHETNA FOUNDATION</span>

          <h2>
            Creating opportunity
            <em> with communities.</em>
          </h2>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <div className={styles.item} key={benefit.number}>
              <span className={styles.number}>
                {benefit.number}
              </span>

              <h3>{benefit.title}</h3>

              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
