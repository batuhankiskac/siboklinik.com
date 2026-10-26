import { Suspense, type CSSProperties } from "react";
import LoadingState from "@/components/LoadingState";
import PublicContentList from "@/components/PublicContentList";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Tanı ve Tedavi",
  description:
    "SIBO tanı yöntemleri ve tedavi protokolü hakkında genel bilgiler. Tedavi planı hekim değerlendirmesiyle belirlenir.",
  path: "/hizmetler",
});

// Yükleme göstergesi segment yerine sayfa içinde tutulur; segment düzeyindeki
// loading.tsx alt rotaları da sarar ve detay sayfalarında 404 durum kodunu
// engeller.
export default function ServicesPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow} data-enter style={{ "--i": 0 } as CSSProperties}>
          Hizmetler
        </p>
        <h1 className={styles.title} data-enter style={{ "--i": 1 } as CSSProperties}>
          Tanı ve Tedavi
        </h1>
        <p className={styles.lead} data-enter style={{ "--i": 2 } as CSSProperties}>
          Tanı yöntemleri ve tedavi protokolü; uygulanacak yaklaşım hekim
          değerlendirmesiyle kişinin durumuna göre belirlenir.
        </p>
      </header>

      <section aria-label="Tanı ve tedavi listesi" className={styles.body}>
        <Suspense fallback={<LoadingState />}>
          <PublicContentList
            load={getServices}
            emptyText="Tanı ve tedavi bilgileri yakında eklenecektir."
            renderItem={(service) => <ServiceCard service={service} />}
          />
        </Suspense>
      </section>
    </main>
  );
}
