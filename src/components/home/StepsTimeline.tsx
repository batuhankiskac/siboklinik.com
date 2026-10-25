import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./StepsTimeline.module.css";

// "1. Hazırlık Aşaması: Test Öncesi Diyet" → tarih etiketi ve başlık.
// İki nokta içermeyen adımlarda etiket yoktur.
function splitStepTitle(title: string): { label?: string; heading: string } {
  const index = title.indexOf(": ");
  if (index === -1) return { heading: title };
  return {
    label: title.slice(0, index),
    heading: title.slice(index + 2),
  };
}

type StepsTimelineProps = {
  section: HomeSection;
};

export default function StepsTimeline({ section }: StepsTimelineProps) {
  const steps = section.items ?? [];

  return (
    <section id={section.id} className={shared.section}>
      <div className={shared.container}>
        <SectionHeader
          title={section.title}
          subtitle={section.subtitle}
          centered
        />
        <ol className={styles.timeline}>
          {steps.map((step, index) => {
            const { label, heading } = splitStepTitle(step.title);
            return (
              <li
                key={step.title}
                className={`${styles.step} ${
                  index % 2 === 0 ? styles.left : styles.right
                }`}
              >
                <div className={styles.card}>
                  {label && <span className={styles.label}>{label}</span>}
                  <h3 className={styles.heading}>{heading}</h3>
                  <p className={styles.text}>{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {section.note && <p className={styles.note}>{section.note}</p>}
      </div>
    </section>
  );
}
