import ContactActions from "@/components/ContactActions";
import ExternalLink from "@/components/ExternalLink";
import MapEmbed from "@/components/MapEmbed";
import contactData from "@/data/contact.json";
import siteData from "@/data/site.json";
import { pageMetadata } from "@/lib/metadata";
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
    <main id="main-content" className={styles.container}>
      <section className={styles.panel} aria-labelledby="contact-title">
        <div className={styles.info}>
          <h1 id="contact-title" className={styles.heading}>
            İletişim &amp; Randevu
          </h1>
          <p className={styles.subtitle}>{description}</p>

          <div className={styles.item}>
            <h2 className={styles.label}>Telefon / WhatsApp</h2>
            <ContactActions inverted />
          </div>

          <div className={styles.item}>
            <h2 className={styles.label}>Adres</h2>
            <address className={styles.value}>{contactData.address}</address>
            <ExternalLink className={styles.link} href={contactData.mapsLink}>
              Google Haritalar&apos;da aç
            </ExternalLink>
          </div>

          <div className={styles.item}>
            <h2 className={styles.label}>Çalışma Saatleri</h2>
            <p className={styles.value}>{contactData.workingHours}</p>
          </div>

          <div className={styles.item}>
            <h2 className={styles.label}>Sosyal Medya</h2>
            <ul className={styles.socials}>
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <ExternalLink className={styles.link} href={link.href}>
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.map}>
          <MapEmbed
            embedUrl={contactData.mapEmbedUrl}
            title="SIBO Klinik konumu"
          />
        </div>
      </section>
    </main>
  );
}
