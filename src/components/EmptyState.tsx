import styles from "./EmptyState.module.css";

// Boş liste durumu: küçük etiket ve mesaj; çizgiyle ayrılmış, editoryal bir blok.
export default function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.empty} role="status">
      <p className={styles.eyebrow}>Bilgi</p>
      <p className={styles.message}>{children}</p>
    </div>
  );
}
