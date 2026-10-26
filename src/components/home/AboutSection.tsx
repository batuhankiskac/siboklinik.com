import type { CSSProperties } from "react";
import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./AboutSection.module.css";

type AboutSectionProps = {
  section: HomeSection;
  // "Neden Önemli?" kutusu ayrı bir kayıt olarak gelir; bu bölümün panelinde gösterilir.
  highlight?: HomeSection;
};

const at = (i: number) => ({ "--i": i }) as CSSProperties;

export default function AboutSection({ section, highlight }: AboutSectionProps) {
  return (
    <section id={section.id} className={shared.section}>
      <div className={`${shared.container} ${styles.grid}`}>
        <div className={styles.side}>
          <SectionHeader index="01" eyebrow="Hakkında" title={section.title} />
        </div>

        <div className={styles.body}>
          {section.paragraphs?.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? styles.lead : styles.text}
              data-reveal
              style={at(index % 4)}
            >
              {paragraph}
            </p>
          ))}

          {section.items && (
            <ul className={styles.list}>
              {section.items.map((item, index) => (
                <li
                  key={item.title}
                  className={styles.row}
                  data-reveal
                  style={at(index % 4)}
                >
                  <span className={styles.check} aria-hidden="true">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      focusable="false"
                    >
                      <path d="M3.5 8.5l3 3 6-7" />
                    </svg>
                  </span>
                  <span className={styles.rowBody}>
                    <span className={styles.rowTitle}>{item.title}</span>
                    {item.text && (
                      <span className={styles.rowText}>{item.text}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {highlight && (
            <aside
              className={styles.panel}
              aria-labelledby={`${highlight.id}-baslik`}
              data-reveal="scale"
            >
              <h3 id={`${highlight.id}-baslik`} className={styles.panelTitle}>
                {highlight.title}
              </h3>
              {highlight.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.panelText}>
                  {paragraph}
                </p>
              ))}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
