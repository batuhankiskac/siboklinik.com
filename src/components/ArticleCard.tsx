import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ArticleSummary } from "@/types/content";
import styles from "./ArticleCard.module.css";

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className={styles.card}>
      <Link
        href={`/belirtiler/${article.id}`}
        className={styles.link}
        aria-label={`${article.title} yazısını oku`}
      >
        <div className={styles.imageContainer}>
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className={styles.image}
              sizes="(max-width: 700px) 100vw, 400px"
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              Belirti
            </div>
          )}
        </div>
        <div className={styles.content}>
          {article.createdAt && (
            <time className={styles.date} dateTime={article.createdAt}>
              {formatDate(article.createdAt)}
            </time>
          )}
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.summary}>{article.summary}</p>
          <span className={styles.readMore}>Devamını Oku →</span>
        </div>
      </Link>
    </article>
  );
}
