import type { ReactNode } from "react";
import ExternalLink from "@/components/ExternalLink";
import MapEmbed from "@/components/MapEmbed";
import contact from "@/data/contact.json";
import type { HomeSection } from "./types";
import SectionHeader from "./SectionHeader";
import shared from "./home.module.css";
import styles from "./ContactSection.module.css";

// Eski sitenin sosyal medya simgeleri (yalnız dekoratif; etiket metinle verilir).
const SOCIAL_ICONS: Record<string, ReactNode> = {
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  youtube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  ),
};

function socialIcon(label: string): ReactNode {
  return SOCIAL_ICONS[label.trim().toLowerCase()] ?? null;
}

type ContactSectionProps = {
  section: HomeSection;
};

export default function ContactSection({ section }: ContactSectionProps) {
  const items = section.items ?? [];
  // Telefon, büyük görüntülenen tek satır; diğer bilgiler etiket/değer satırlarıdır.
  const phoneItems = items.filter((item) => item.text === contact.phone);
  const rowItems = items.filter((item) => item.text !== contact.phone);

  return (
    <section id={section.id} className={styles.contact}>
      <div className={`${shared.container} ${styles.grid}`}>
        <div className={styles.info}>
          <SectionHeader
            index="05"
            eyebrow="İletişim"
            title={section.title}
            intro={section.subtitle}
          />

          {phoneItems.map((item) => (
            <div key={item.title} className={styles.phoneBlock}>
              <div className={styles.label}>{item.title}</div>
              <a href={`tel:${contact.tel}`} className={styles.phone}>
                {item.text}
              </a>
            </div>
          ))}

          {rowItems.length > 0 && (
            <div className={styles.rows}>
              {rowItems.map((item) => (
                <div key={item.title} className={styles.row}>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.value}>{item.text}</div>
                </div>
              ))}
            </div>
          )}

          {section.ctas && (
            <div className={styles.social}>
              {section.ctas.map((cta) => (
                <ExternalLink
                  key={cta.href}
                  href={cta.href}
                  className={styles.socialLink}
                >
                  {socialIcon(cta.label)}
                  <span>{cta.label}</span>
                </ExternalLink>
              ))}
            </div>
          )}
        </div>

        <div className={styles.map} data-reveal>
          <MapEmbed
            embedUrl={contact.mapEmbedUrl}
            title="SIBO Klinik konumu (Google Haritalar)"
          />
        </div>
      </div>
    </section>
  );
}
