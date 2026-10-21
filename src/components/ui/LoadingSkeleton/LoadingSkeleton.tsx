import styles from "./LoadingSkeleton.module.css";

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export default function LoadingSkeleton({
  width = "100%",
  height = "20px",
  borderRadius,
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}