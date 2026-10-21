import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.page} aria-live="polite" aria-busy="true">
      <div className={styles.content} role="status" aria-label="Loading collections">
        <span className={styles.brand}>SWACHETNA</span>
        <span className={styles.loader} aria-hidden="true" />
        <p>Loading the collections</p>
      </div>
    </main>
  );
}
