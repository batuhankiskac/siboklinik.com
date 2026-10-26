import Link from "next/link";
import ArrowIcon from "./ArrowIcon";
import ConsentPreferencesButton from "./ConsentPreferencesButton";
import ContactActions from "./ContactActions";
import ExternalLink from "./ExternalLink";
import { privacyLink } from "@/data/navigation";
import siteData from "@/data/site.json";
import buttonStyles from "@/styles/button.module.css";
import styles from "./Footer.module.css";

const { brand, contact, footer } = siteData;

// Yıl, sunucunun saat diliminden bağımsız olarak İstanbul'a göre hesaplanır.
function currentYear() {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

// site.json'daki sabit "© 2024" yılı güncel yılla değiştirilir.
const copyrightText = footer.text.replace(/^©\s*\d{4}/, `© ${currentYear()}`);

const isExternal = (href: string) => /^https?:\/\//i.test(href);
const internalLinks = footer.links.filter((link) => !isExternal(link.href));
const externalLinks = footer.links.filter((link) => isExternal(link.href));

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cta}>
          <div className={styles.ctaCopy}>
            <p className={styles.eyebrow}>İletişim &amp; Randevu</p>
            <h2 className={styles.ctaTitle}>
              SIBO ve sindirim sorunlarınız için profesyonel destek alın.
            </h2>
          </div>
          <div className={styles.ctaActions}>
            <ContactActions inverted />
            <Link
              href="/iletisim"
              className={styles.ctaLink}
              prefetch={false}
            >
              Randevu Bilgisi Alın
              <ArrowIcon className={buttonStyles.icon} />
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <p className={styles.brandName}>{brand.siteName}</p>
            <p className={styles.brandText}>{brand.shortDescription}</p>
          </div>

          <nav className={styles.col} aria-label="Alt menü">
            <h2 className={styles.colTitle}>Sayfalar</h2>
            <ul className={styles.list}>
              {internalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={privacyLink.href}
                  prefetch={false}
                  className={styles.link}
                >
                  {privacyLink.label}
                </Link>
              </li>
              <li>
                <ConsentPreferencesButton />
              </li>
            </ul>
          </nav>

          <div className={styles.col}>
            <h2 className={styles.colTitle}>Takip et</h2>
            <ul className={styles.list}>
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <ExternalLink href={link.href} className={styles.link}>
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h2 className={styles.colTitle}>Adres</h2>
            <address className={styles.address}>{contact.address}</address>
            <p className={styles.hours}>{contact.workingHours}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyrightText}</p>
          <a href="#main-content" className={styles.toTop}>
            Yukarı dön
            <span className={styles.toTopIcon}>
              <ArrowIcon className={styles.arrow} direction="up-right" />
            </span>
          </a>
        </div>

        <p className={styles.wordmark} aria-hidden="true">
          {brand.siteName}
        </p>
      </div>
    </footer>
  );
}
