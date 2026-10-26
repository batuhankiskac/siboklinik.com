import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate } from "@/lib/format";
import {
  allowedImageSrc,
  citationParts,
  EXTERNAL_LINK,
} from "@/lib/markdown-media";
import ExternalLink from "./ExternalLink";
import styles from "./ContentDetail.module.css";

interface ContentDetailProps {
  backHref: string;
  backLabel: string;
  // Başlığın üstündeki kısa etiket (ör. "Belirti").
  eyebrow?: string;
  title: string;
  imageUrl?: string | null;
  imageAlt?: string;
  date?: string | null;
  markdown: string;
  citations?: string[];
}

export default function ContentDetail({
  backHref,
  backLabel,
  eyebrow,
  title,
  imageUrl,
  imageAlt = "",
  date,
  markdown,
  citations = [],
}: ContentDetailProps) {
  return (
    <main id="main-content" className={styles.page}>
      <article>
        <header className={styles.header}>
          <Link href={backHref} className={styles.backLink}>
            ← {backLabel}
          </Link>
          {eyebrow && (
            <p className={styles.eyebrow} data-enter>
              {eyebrow}
            </p>
          )}
          <h1
            className={styles.title}
            data-enter
            style={{ "--i": 1 } as CSSProperties}
          >
            {title}
          </h1>
          {date && (
            <time
              dateTime={date}
              className={styles.date}
              data-enter
              style={{ "--i": 2 } as CSSProperties}
            >
              {formatDate(date)}
            </time>
          )}
        </header>

        {imageUrl && (
          <div className={styles.hero} data-reveal="mask">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              preload
              sizes="(max-width: 1240px) 100vw, 1240px"
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.narrow}>
          <div className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Sayfa başlığı zaten h1 olduğundan içerikteki h1'ler h2'ye indirilir.
                h1: ({ node, ...props }) => {
                  void node;
                  return <h2 {...props} />;
                },
                // react-markdown'ın verdiği `node` DOM'a aktarılmaz.
                a: ({ node, href, children, ...props }) => {
                  void node;
                  if (href && EXTERNAL_LINK.test(href)) {
                    return (
                      <ExternalLink href={href} {...props}>
                        {children}
                      </ExternalLink>
                    );
                  }
                  return (
                    <a href={href} {...props}>
                      {children}
                    </a>
                  );
                },
                // Tablolar yatay kaydırılabilir bir sarmalayıcıda gösterilir.
                table: ({ node, ...props }) => {
                  void node;
                  return (
                    <div className={styles.tableWrap}>
                      <table {...props} />
                    </div>
                  );
                },
                // Görseller tembel yüklenir ve yalnız izinli Storage adreslerinden
                // gösterilir; diğer kaynaklar hiç render edilmez.
                img: ({ node, src, alt }) => {
                  void node;
                  const safeSrc =
                    typeof src === "string" ? allowedImageSrc(src) : null;
                  if (!safeSrc) return null;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={safeSrc}
                      alt={alt ?? ""}
                      loading="lazy"
                      decoding="async"
                    />
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>

          {citations.length > 0 && (
            <section
              className={styles.citationsSection}
              aria-labelledby="sources"
              data-reveal
            >
              <h2 id="sources" className={styles.citationsTitle}>
                Kaynakça
              </h2>
              <ol className={styles.citationsList}>
                {citations.map((citation, index) => (
                  <li
                    key={`${citation}-${index}`}
                    className={styles.citationItem}
                  >
                    {citationParts(citation).map((part, partIndex) =>
                      EXTERNAL_LINK.test(part) ? (
                        <ExternalLink key={`${part}-${partIndex}`} href={part}>
                          {part}
                        </ExternalLink>
                      ) : (
                        <span key={`${part}-${partIndex}`}>{part}</span>
                      ),
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className={styles.end}>
            <Link href={backHref} className={styles.endLink}>
              ← {backLabel}
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
