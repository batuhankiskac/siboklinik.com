import Link from "next/link";
import type { CSSProperties } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./SymptomCards.module.css";

type SymptomCardsProps = {
  section: HomeSection;
};

// Her kart tek bir bağlantıdır; bağlantı adı kartın başlığını içerir,
// böylece ekran okuyucuda kartlar birbirinden ayırt edilir.
export default function SymptomCards({ section }: SymptomCardsProps) {
  // Veri etiketindeki "→" yerine ok bileşeni kullanılır.
  const linkLabel = section.itemLinkLabel?.replace(/\s*→\s*$/, "");

  return (
    <section id={section.id} className={shared.section}>
      <div className={shared.container}>
        <SectionHeader
          index="03"
          eyebrow="Belirtiler"
          title={section.title}
          intro={section.subtitle}
          split
        />
        <div className={styles.grid}>
          {(section.items ?? []).map((item, index) => (
            <div
              key={item.href}
              className={styles.item}
              data-reveal
              style={{ "--i": index % 4 } as CSSProperties}
            >
              <Link href={item.href ?? "#"} className={styles.card}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
                <span className={styles.more}>
                  {linkLabel}
                  <ArrowIcon className={styles.arrow} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
