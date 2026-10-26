import type { CSSProperties } from "react";
import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./StepsTimeline.module.css";

// "1. Hazırlık Aşaması: Test Öncesi Diyet" → nokta numarası, etiket ve başlık.
// Numara noktada gösterildiği için etiketten çıkarılır.
// İki nokta içermeyen adımlarda etiket yoktur.
function parseStep(title: string, fallbackNumber: number) {
  const numbered = title.match(/^(\d+)\.\s*/);
  const rest = numbered ? title.slice(numbered[0].length) : title;
  const colon = rest.indexOf(": ");
  const number = numbered ? numbered[1] : String(fallbackNumber);
  return {
    number: number.padStart(2, "0"),
    label: colon === -1 ? undefined : rest.slice(0, colon),
    heading: colon === -1 ? rest : rest.slice(colon + 2),
  };
}

type StepsTimelineProps = {
  section: HomeSection;
};

export default function StepsTimeline({ section }: StepsTimelineProps) {
  const steps = section.items ?? [];

  return (
    <section id={section.id} className={`${shared.section} ${shared.alt}`}>
      <div className={shared.container}>
        <SectionHeader
          index="02"
          eyebrow="Test Süreci"
          title={section.title}
          intro={section.subtitle}
          split
        />

        {/* Zaman çizelgesi kapsayıcısı: çizgi dolgusu ve adımlar bu öğenin içindedir. */}
        <div className={styles.timeline}>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.fill} />
          </span>
          <ol className={styles.steps}>
            {steps.map((step, index) => {
              const { number, label, heading } = parseStep(step.title, index + 1);
              return (
                <li
                  key={step.title}
                  className={styles.step}
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className={styles.dot}>{number}</span>
                  <div className={styles.card}>
                    {label && <span className={styles.label}>{label}</span>}
                    <h3 className={styles.heading}>{heading}</h3>
                    <p className={styles.text}>{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {section.note && <p className={styles.note}>{section.note}</p>}
      </div>
    </section>
  );
}
