import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        className={`${styles.input} ${error ? styles.error : ""} ${className}`}
        {...props}
      />

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}