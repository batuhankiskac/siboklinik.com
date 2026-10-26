import ArrowIcon from "@/components/ArrowIcon";
import ContactActions from "@/components/ContactActions";
import ExternalLink from "@/components/ExternalLink";
import MapEmbed from "@/components/MapEmbed";
import contactData from "@/data/contact.json";
import siteData from "@/data/site.json";
import { pageMetadata } from "@/lib/metadata";
import pageStyles from "@/styles/page.module.css";
import styles from "./page.module.css";

const { title, description } = siteData.seo.contact;

export const metadata = pageMetadata({
  title,
  description,
  path: "/iletisim",
});

const socialLinks = [
  { label: "Instagram", href: contactData.social.instagram },
  { label: "YouTube", href: contactData.social.youtube },
];

export default function ContactPage() {
  return (
    <main id="main-content" className={`${pageStyles.page} ${styles.page}`}>
      <header className={pageStyles.header}>
        <p className={pageStyles.eyebrow}>İletişim</p>
        <h1 className={pageStyles.title}>
          İletişim &amp; Randevu
        </h1>
        <p className={pageStyles.lead}>{description}</p>
      </header>

      <div className={`${pageStyles.body} ${styles.layout}`}>
        <section className={styles.info} aria-label="İletişim bilgileri">
          <div className={styles.row} data-reveal style={{ "--i": 0 } as React.CSSProperties}>
            <h2 className={styles.label}>Telefon / WhatsApp</h2>
            <div className={styles.value}>
              <a className={styles.phone} href={`tel:${contactData.tel}`}>
                {contactData.phone}
              </a>
              <ContactActions />
            </div>
          </div>

          <div className={styles.row} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className={styles.label}>Adres</h2>
            <div className={styles.value}>
              <address className={styles.text}>{contactData.address}</address>
              <ExternalLink className={styles.link} href={contactData.mapsLink}>
                Google Haritalar&apos;da aç
                <ArrowIcon className={styles.arrow} direction="up-right" />
              </ExternalLink>
            </div>
          </div>

          <div className={styles.row} data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <h2 className={styles.label}>Çalışma Saatleri</h2>
            <div className={styles.value}>
              <p className={styles.text}>{contactData.workingHours}</p>
            </div>
          </div>

          <div className={styles.row} data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <h2 className={styles.label}>Sosyal Medya</h2>
            <div className={styles.value}>
              <ul className={styles.socials}>
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <ExternalLink className={styles.link} href={link.href}>
                      {link.label}
                      <ArrowIcon className={styles.arrow} direction="up-right" />
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className={styles.map} data-reveal="mask">
          <MapEmbed
            embedUrl={contactData.mapEmbedUrl}
            title="SIBO Klinik konumu"
          />
        </div>
      </div>
    </main>
  );
}
