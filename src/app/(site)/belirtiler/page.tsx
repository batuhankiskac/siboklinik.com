import type { CSSProperties } from "react";
import ArticleCard from "@/components/ArticleCard";
import ContentGrid from "@/components/ContentGrid";
import { pageMetadata } from "@/lib/metadata";
import { symptoms } from "@/lib/static-content";
import siteData from "@/data/site.json";
import listStyles from "@/components/PublicContentList.module.css";
import styles from "./page.module.css";

const { title, description } = siteData.seo.symptomsIndex;

export const metadata = pageMetadata({
  title,
  description,
  path: "/belirtiler",
});

// İçerik src/data/belirtiler.json dosyasından gelir; sayfa build'de üretilir.
export default function SymptomsPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow} data-enter style={{ "--i": 0 } as CSSProperties}>
          Yazılar
        </p>
        <h1 className={styles.title} data-enter style={{ "--i": 1 } as CSSProperties}>
          SIBO Belirtileri
        </h1>
        <p className={styles.lead} data-enter style={{ "--i": 2 } as CSSProperties}>
          {description}
        </p>
      </header>
      <div className={styles.body}>
        <ContentGrid>
          {symptoms.map((symptom, index) => (
            <div
              key={symptom.id}
              className={listStyles.item}
              data-reveal
              style={{ "--i": index % 3 } as CSSProperties}
            >
              <ArticleCard article={symptom} basePath="/belirtiler" />
            </div>
          ))}
        </ContentGrid>
      </div>
    </main>
  );
}
