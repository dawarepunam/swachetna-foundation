import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import styles from "./CommunityWork.module.css";

const stories = [
  { image: "/images/community-grocery-drive.jpeg", alt: "Swachetna Foundation volunteers at a grocery donation drive", tag: "ANNAPURNA · COMMUNITY CARE", title: "Grocery Donation Drive", description: "A community initiative supporting students at C. R. Ranganathan School for Deaf & Mute in Pune." },
  { image: "/images/anna-seva.jpeg", alt: "Volunteers sharing food at a community meal", tag: "ANNAPURNA · FOOD FOR EVERYONE", title: "Anna Seva", description: "Nutritious meals and fresh roses shared at Maher Vatsalyadham Shelter Home, Pune." },
  { image: "/images/student-lamp-program.jpeg", alt: "Students decorating handmade lamps for a festive sale", tag: "SWAVALAMBAN · SKILLS & LIVELIHOODS", title: "Diwali Lamp Program", description: "Students at C. R. Ranganathan School decorated lamps and hampers and gained hands-on selling experience." },
];

export default function CommunityWork() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <div><span>THE FOUNDATION IN ACTION</span><h2 id="community-work-title">Real work.<br /><em>In our community.</em></h2><p>Stories from Swachetna Foundation’s community programs in Pune.</p></div>
          <a href="https://swachetna.org/" target="_blank" rel="noreferrer">Explore Swachetna Foundation <ArrowUpRight size={16} /></a>
        </div>
        <div className={styles.grid} aria-labelledby="community-work-title">
          {stories.map((story) => (
            <article className={styles.card} key={story.title}>
              <div className={styles.image}>
                <Image src={story.image} alt={story.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 800px) 50vw, 33vw" />
                <span className={styles.tag}>{story.tag}</span>
              </div>
              <div className={styles.copy}><h3>{story.title}</h3><p>{story.description}</p><Link href="/about">About the foundation <ArrowUpRight size={14} /></Link></div>
            </article>
          ))}
        </div>
        <p className={styles.caption}>Campaign photographs from Swachetna Foundation’s published community work.</p>
      </div>
    </section>
  );
}
