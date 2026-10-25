import { Suspense } from "react";
import ArticleCard from "@/components/ArticleCard";
import ContentGrid from "@/components/ContentGrid";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
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

async function ArticleList() {
  const articles = await getArticles();

  return (
    <ContentGrid>
      {articles.length > 0 ? (
        articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <EmptyState>Henüz yayınlanmış bir belirti yazısı bulunmuyor.</EmptyState>
      )}
    </ContentGrid>
  );
}

export default function ArticlesPage() {
  return (
    <main id="main-content" className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>SIBO Belirtileri</h1>
        <p className={styles.subtitle}>{description}</p>
      </div>
      <Suspense fallback={<LoadingState />}>
        <ArticleList />
      </Suspense>
    </main>
  );
}
