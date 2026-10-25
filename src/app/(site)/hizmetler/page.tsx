import { Suspense } from "react";
import ContentGrid from "@/components/ContentGrid";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
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

async function ServiceList() {
  const services = await getServices();

  return (
    <ContentGrid>
      {services.length > 0 ? (
        services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      ) : (
        <EmptyState>Tanı ve tedavi bilgileri yakında eklenecektir.</EmptyState>
      )}
    </ContentGrid>
  );
}

// Yükleme göstergesi segment yerine sayfa içinde tutulur; segment düzeyindeki
// loading.tsx alt rotaları da sarar ve detay sayfalarında 404 durum kodunu
// engeller.
export default function ServicesPage() {
  return (
    <main id="main-content" className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tanı ve Tedavi</h1>
        <p className={styles.subtitle}>
          Tanı yöntemleri ve tedavi protokolü; uygulanacak yaklaşım hekim
          değerlendirmesiyle kişinin durumuna göre belirlenir.
        </p>
      </div>

      <section aria-label="Tanı ve tedavi listesi">
        <Suspense fallback={<LoadingState />}>
          <ServiceList />
        </Suspense>
      </section>
    </main>
  );
}
