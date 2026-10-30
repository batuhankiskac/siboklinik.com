import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetail from "@/components/ContentDetail";
import { pageMetadata } from "@/lib/metadata";
import { getService, services } from "@/lib/static-content";
import { excerpt } from "@/lib/text";

type PageProps = { params: Promise<{ id: string }> };

// Hizmet sayfaları sabit içeriktir (src/data/hizmetler.json) ve build'de
// üretilir. Bilinmeyen id'ler notFound() ile 404 döner.
export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getService(id);
  if (!service) notFound();

  return pageMetadata({
    title: service.title,
    description: excerpt(service.description),
    path: `/hizmetler/${id}`,
    image: service.imageUrl,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = getService(id);
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
