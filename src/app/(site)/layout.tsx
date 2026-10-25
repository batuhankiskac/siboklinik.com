import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import bioData from "@/data/bio.json";
import contactData from "@/data/contact.json";
import siteData from "@/data/site.json";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";
import { SITE_NAME } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import styles from "./layout.module.css";

// Hostinger CDN (hcdn) `Vary: rsc` başlığını yok sayıyor; statik sayfaların
// RSC yükü (text/x-component) normal ziyaretçilere HTML yerine sunulabiliyor.
// Dinamik render `Cache-Control: private, no-store` gönderir ve CDN bu
// sayfaları önbelleğe almaz. Firestore verisi unstable_cache ile önbellekte kalır.
export const dynamic = "force-dynamic";

// Hekim kaydı: klinik ile birlikte veri olarak yer alır (employee/founder).
// Yalnız schema.org MedicalSpecialty listesindeki değerler geçerlidir;
// "InternalMedicine" bu listede yok.
const physicianSchema = {
  "@type": "Physician",
  name: bioData.name,
  honorificPrefix: bioData.title,
  url: SITE_URL,
  medicalSpecialty: ["Endocrine", "PrimaryCare"],
  worksFor: { "@type": "MedicalClinic", name: SITE_NAME, url: SITE_URL },
};

const clinicSchema = {
  "@context": "https://schema.org",
  "@type": ["MedicalClinic", "MedicalBusiness"],
  name: SITE_NAME,
  description: siteData.seo.home.description,
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  telephone: contactData.tel,
  address: {
    "@type": "PostalAddress",
    ...contactData.addressParts,
  },
  founder: physicianSchema,
  employee: [physicianSchema],
  sameAs: [contactData.social.instagram, contactData.social.youtube],
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Consent Mode varsayılanları etkileşimden önce, sunucu HTML'iyle gelir. */}
      <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
      {/* Klavye kullanıcıları menüyü geçip doğrudan sayfa içeriğine gidebilir. */}
      <a href="#main-content" className={styles.skipLink}>
        İçeriğe atla
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
      />
      <Header />
      {children}
      <Footer />
      <AnalyticsConsent />
    </>
  );
}
