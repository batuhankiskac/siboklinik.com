import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
};

// Bölüm başlığı: başlık, isteğe bağlı açıklama ve altın ayırıcı çizgi.
export default function SectionHeader({
  title,
  subtitle,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? styles.centered : styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.divider} aria-hidden="true" />
    </div>
  );
}
