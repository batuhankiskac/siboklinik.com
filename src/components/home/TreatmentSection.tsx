import Link from "next/link";
import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./TreatmentSection.module.css";

type TreatmentSectionProps = {
  section: HomeSection;
  // "list" türündeki kutular (tanı, tedavi protokolü) bu bölümde gösterilir.
  boxes: HomeSection[];
};

export default function TreatmentSection({
  section,
  boxes,
}: TreatmentSectionProps) {
  return (
    <section id={section.id} className={shared.section}>
      <div className={shared.container}>
        <SectionHeader title={section.title} />
        <div className={styles.grid}>
          {boxes.map((box, index) => (
            <div
              key={box.id}
              className={`${styles.box} ${
                index % 2 === 0 ? styles.warm : styles.cool
              }`}
            >
              <h3 className={styles.boxTitle}>{box.title}</h3>
              <ul className={styles.list}>
                {(box.items ?? []).map((item) => (
                  <li key={item.title} className={styles.item}>
                    <strong className={styles.itemTitle}>{item.title}</strong>
                    {item.text && <span>{item.text}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.more}>
          <Link href="/hizmetler" className={styles.moreLink}>
            Tanı ve tedavi yöntemlerinin ayrıntıları →
          </Link>
        </p>
      </div>
    </section>
  );
}
