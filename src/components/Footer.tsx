import Link from "next/link";
import ConsentPreferencesButton from "./ConsentPreferencesButton";
import { privacyLink } from "@/data/navigation";
import siteData from "@/data/site.json";
import styles from "./Footer.module.css";

const { footer } = siteData;

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

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>{copyrightText}</p>
        <nav className={styles.links} aria-label="Alt menü">
          {footer.links.map((link) =>
            isExternal(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <span className="sr-only"> (yeni sekmede açılır)</span>
              </a>
            ) : (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ),
          )}
          <Link href={privacyLink.href}>{privacyLink.label}</Link>
          <ConsentPreferencesButton />
        </nav>
      </div>
    </footer>
  );
}
