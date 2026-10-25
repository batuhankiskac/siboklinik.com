import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./AboutSection.module.css";

type AboutSectionProps = {
  section: HomeSection;
  // "Neden Önemli?" kutusu ayrı bir kayıt olarak gelir; yan kutu olarak gösterilir.
  highlight?: HomeSection;
};

export default function AboutSection({ section, highlight }: AboutSectionProps) {
  return (
    <section id={section.id} className={shared.section}>
      <div className={shared.container}>
        <SectionHeader title={section.title} />
        <div className={styles.grid}>
          <div>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className={styles.text}>
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className={styles.features}>
                {section.items.map((item) => (
                  <li key={item.title} className={styles.feature}>
                    <span className={styles.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>
                      <span className={styles.featureTitle}>{item.title}</span>
                      {item.text && (
                        <span className={styles.featureText}>{item.text}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {highlight && (
            <div className={styles.highlight}>
              <h3 className={styles.highlightTitle}>{highlight.title}</h3>
              {highlight.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.highlightText}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
