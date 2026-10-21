import Link from "next/link";
import styles from "./status.module.css";
export default function NotFound(){return <main className={styles.page}><span>404 · NOT FOUND</span><h1>This page took<br/><em>a different turn.</em></h1><p>That page is not part of this demo storefront.</p><Link href="/">Back to home</Link></main>}
