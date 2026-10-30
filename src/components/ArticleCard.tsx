import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ArticleSummary } from "@/types/content";
import ArrowIcon from "./ArrowIcon";
import CardMedia from "./CardMedia";
import buttonStyles from "../styles/button.module.css";
import styles from "./ArticleCard.module.css";

type ArticleCardProps = {
  article: ArticleSummary;
  // Detay sayfasının kök yolu: Firestore makaleleri "/makaleler", sabit
  // belirti sayfaları "/belirtiler".
  basePath?: "/makaleler" | "/belirtiler";
};

// Kutusuz, editoryal kart: görsel, tarih, başlık, özet ve bağlantı dikey akar.
export default function ArticleCard({
  article,
  basePath = "/makaleler",
}: ArticleCardProps) {

  return (
    <article className={styles.card}>
      <Link
        href={`${basePath}/${article.id}`}
        className={styles.anchor}
        aria-label={`${article.title} yazısını oku`}
      >
        {article.imageUrl ? (
          <CardMedia className={styles.media} src={article.imageUrl} />
        ) : null}
        <div
          className={
            article.imageUrl ? styles.content : `${styles.content} ${styles.textOnly}`
          }
        >
          {article.createdAt && (
            <time className={styles.date} dateTime={article.createdAt}>
              {formatDate(article.createdAt)}
            </time>
          )}
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.summary}>{article.summary}</p>
          <span className={styles.readMore}>
            Devamını oku
            <ArrowIcon className={buttonStyles.icon} />
          </span>
        </div>
      </Link>
    </article>
  );
}
