import styles from "./EmptyState.module.css";

export default function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.empty} role="status">
      {children}
    </p>
  );
}
