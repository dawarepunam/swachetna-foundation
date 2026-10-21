"use client";

import styles from "./Toast.module.css";

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

export default function Toast({
  message,
  variant = "info",
  onClose,
}: ToastProps) {
  return (
    <div
      className={`${styles.toast} ${styles[variant]}`}
      role="status"
    >
      <span>{message}</span>

      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}