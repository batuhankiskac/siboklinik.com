import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetail from "@/components/ContentDetail";
import { getService } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { excerpt } from "@/lib/text";

type PageProps = { params: Promise<{ id: string }> };

// Build'de Firestore'a gidilmez; detay sayfaları ilk istekte üretilip ISR ile
// önbelleğe alınır. Bilinmeyen id'ler notFound() ile 404 döner.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return pageMetadata({
    title: service.title,
    description: excerpt(service.description),
    path: `/hizmetler/${id}`,
    image: service.imageUrl,
  });
}

// Bu rotayı saran bir loading.tsx/Suspense yoktur; notFound() yanıt akışı
// başlamadan çalışır ve gerçek 404 durum kodu döner.
export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return (
    <ContentDetail
      backHref="/hizmetler"
      backLabel="Tanı ve Tedavi'ye Dön"
      eyebrow="Hizmet"
      title={service.title}
      imageUrl={service.imageUrl}
      imageAlt={`${service.title} hizmeti`}
      markdown={service.description}
    />
  );
}
