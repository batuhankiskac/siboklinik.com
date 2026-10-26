import layout from "../../styles/layout.module.css";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  // Eyebrow'daki sıra numarası (ör. "01") ve kısa etiket (ör. "Hakkında").
  index?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  // Masaüstünde başlık solda, açıklama sağda ve alt hizalı olur.
  split?: boolean;
};

// Bölüm başlığı: eyebrow, h2 ve isteğe bağlı giriş metni. Altın ayırıcı yok.
export default function SectionHeader({
  index,
  eyebrow,
  title,
  intro,
  split = false,
}: SectionHeaderProps) {
  return (
    <div
      className={split ? `${styles.header} ${styles.split}` : styles.header}
      data-reveal
    >
      <div className={styles.titleBlock}>
        {(index || eyebrow) && (
          <p className={layout.eyebrow}>
            {index && <span className={styles.index}>{index}</span>}
            {eyebrow}
          </p>
        )}
        <h2 className={styles.title}>{title}</h2>
      </div>
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  );
}
