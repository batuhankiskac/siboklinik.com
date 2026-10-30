import type { CSSProperties } from "react";
import ContentGrid from "@/components/ContentGrid";
import ServiceCard from "@/components/ServiceCard";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/lib/static-content";
import listStyles from "@/components/PublicContentList.module.css";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Tanı ve Tedavi",
  description:
    "SIBO tanı yöntemleri ve tedavi protokolü hakkında genel bilgiler. Tedavi planı hekim değerlendirmesiyle belirlenir.",
  path: "/hizmetler",
});

// İçerik src/data/hizmetler.json dosyasından gelir; sayfa build'de üretilir.
export default function ServicesPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow} data-enter style={{ "--i": 0 } as CSSProperties}>
          Hizmetler
        </p>
        <h1 className={styles.title} data-enter style={{ "--i": 1 } as CSSProperties}>
          Tanı ve Tedavi
        </h1>
        <p className={styles.lead} data-enter style={{ "--i": 2 } as CSSProperties}>
          Tanı yöntemleri ve tedavi protokolü; uygulanacak yaklaşım hekim
          değerlendirmesiyle kişinin durumuna göre belirlenir.
        </p>
      </header>

      <section aria-label="Tanı ve tedavi listesi" className={styles.body}>
        <ContentGrid>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={listStyles.item}
              data-reveal
              style={{ "--i": index % 3 } as CSSProperties}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </ContentGrid>
      </section>
    </main>
  );
}
