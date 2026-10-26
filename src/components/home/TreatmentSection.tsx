import Link from "next/link";
import type { CSSProperties } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import buttonStyles from "@/styles/button.module.css";
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
    <section id={section.id} className={`${shared.section} ${shared.alt}`}>
      <div className={shared.container}>
        <SectionHeader index="04" eyebrow="Tedavi" title={section.title} />
        <div className={styles.grid}>
          {boxes.map((box, index) => {
            // Tek sıra: ilk kutu açık zeminde, ikincisi koyu panelde.
            const dark = index % 2 === 1;
            return (
              <div
                key={box.id}
                className={dark ? styles.panelDark : styles.panel}
                data-reveal="scale"
                style={{ "--i": index % 4 } as CSSProperties}
              >
                <h3 className={styles.boxTitle}>{box.title}</h3>
                <ul className={styles.list}>
                  {(box.items ?? []).map((item, itemIndex) => (
                    <li
                      key={item.title}
                      className={styles.item}
                      data-reveal
                      style={{ "--i": itemIndex % 4 } as CSSProperties}
                    >
                      <strong className={styles.itemTitle}>{item.title}</strong>
                      {item.text && (
                        <span className={styles.itemText}>{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className={styles.more} data-reveal>

          <Link href="/hizmetler" className={styles.moreButton}>
            Tanı ve tedavi yöntemlerinin ayrıntıları
            <ArrowIcon className={buttonStyles.icon} />
          </Link>
        </div>
      </div>
    </section>
  );
}
