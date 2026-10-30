import { Suspense, type CSSProperties } from "react";
import ArticleCard from "@/components/ArticleCard";
import LoadingState from "@/components/LoadingState";
import PublicContentList from "@/components/PublicContentList";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import siteData from "@/data/site.json";
import styles from "./page.module.css";

const { title, description } = siteData.seo.articlesIndex;

export const metadata = pageMetadata({
  title,
  description,
  path: "/makaleler",
});

// Makaleler admin panelinden yönetilir (Firestore `articles`).
export default function ArticlesPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow} data-enter style={{ "--i": 0 } as CSSProperties}>
          Yazılar
        </p>
        <h1 className={styles.title} data-enter style={{ "--i": 1 } as CSSProperties}>
          Makaleler
        </h1>
        <p className={styles.lead} data-enter style={{ "--i": 2 } as CSSProperties}>
          {description}
        </p>
      </header>
      <div className={styles.body}>
        <Suspense fallback={<LoadingState />}>
          <PublicContentList
            load={getArticles}
            emptyText="Henüz yayınlanmış bir makale bulunmuyor."
            renderItem={(article) => (
              <ArticleCard article={article} basePath="/makaleler" />
            )}
          />
        </Suspense>
      </div>
    </main>
  );
}
