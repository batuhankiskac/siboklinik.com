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
    <main id="main-content" className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>SIBO Belirtileri</h1>
        <p className={styles.subtitle}>{description}</p>
      </div>
      <Suspense fallback={<LoadingState />}>
        <PublicContentList
          load={getArticles}
          emptyText="Henüz yayınlanmış bir belirti yazısı bulunmuyor."
          renderItem={(article) => <ArticleCard article={article} />}
        />
      </Suspense>
    </main>
  );
}
