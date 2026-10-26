import { Suspense } from "react";
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
  path: "/belirtiler",
});

export default function ArticlesPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Yazılar</p>
        <h1 className={styles.title}>SIBO Belirtileri</h1>
        <p className={styles.lead}>{description}</p>
      </header>
      <div className={styles.body}>
        <Suspense fallback={<LoadingState />}>
          <PublicContentList
            load={getArticles}
            emptyText="Henüz yayınlanmış bir belirti yazısı bulunmuyor."
            renderItem={(article) => <ArticleCard article={article} />}
          />
        </Suspense>
      </div>
    </main>
  );
}
