import Header from "@/components/Header";
import { ViewTransition } from "react";
import Footer from "@/components/Footer";
import MobileCtaBar from "@/components/MobileCtaBar";
import MotionObserver from "@/components/motion/MotionObserver";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import bioData from "@/data/bio.json";
import contactData from "@/data/contact.json";
import siteData from "@/data/site.json";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";
import { SITE_NAME } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import styles from "./layout.module.css";

// Genel sayfalar ISR ile önceden üretilir ve en fazla 300 sn'de bir yenilenir.
// Admin'de yapılan değişiklikler updateTag ile geçersiz kılınır (bkz.
// src/lib/content.ts). Hostinger CDN `Vary: rsc` başlığını yok saydığı için
// RSC yanıtları next.config.ts içinde önbelleğe alınmaz; HTML yanıtları CDN'de
// s-maxage süresince tutulabilir.
export const revalidate = 300;

// Hekim kaydı: klinik ile birlikte veri olarak yer alır (employee/founder).
// schema.org'da Physician bir kurum türüdür; employee/founder kişi beklediği
// için hekim Person olarak verilir. Uzmanlık alanı kliniğe yazılır; yalnız
// MedicalSpecialty listesindeki değerler geçerlidir ("InternalMedicine" yok).
const physicianSchema = {
  "@type": "Person",
  name: bioData.name,
  honorificPrefix: bioData.title,
  jobTitle: "İç Hastalıkları Uzmanı",
  url: "https://profdrmuharremkiskac.com",
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
  medicalSpecialty: ["Endocrine", "PrimaryCare"],
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
      {/* Gezinmede sayfa içeriği yumuşak geçişle değişir (globals.css: .page). */}
      <ViewTransition default="page">{children}</ViewTransition>
      <Footer />
      <MobileCtaBar tel={contactData.tel} whatsapp={contactData.whatsapp} />
      <MotionObserver />
      <AnalyticsConsent />
    </>
  );
}
