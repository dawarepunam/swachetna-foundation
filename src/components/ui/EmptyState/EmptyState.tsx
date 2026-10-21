import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>○</div>

      <h2 className={styles.title}>{title}</h2>

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}