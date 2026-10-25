import Link from "next/link";
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
  return (
    <section id={section.id} className={shared.section}>
      <div className={shared.container}>
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          centered
        />
        <div className={styles.grid}>
          {(section.items ?? []).map((item) => (
            <Link key={item.href} href={item.href ?? "#"} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
              <span className={styles.more}>{section.itemLinkLabel}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
