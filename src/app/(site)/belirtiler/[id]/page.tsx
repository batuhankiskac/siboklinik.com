import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentDetail from "@/components/ContentDetail";
import { pageMetadata } from "@/lib/metadata";
import { getSymptom, symptoms } from "@/lib/static-content";

type PageProps = { params: Promise<{ id: string }> };

// Belirti sayfaları sabit içeriktir (src/data/belirtiler.json) ve build'de
// üretilir. Bilinmeyen id'ler notFound() ile 404 döner.
export function generateStaticParams() {
  return symptoms.map((symptom) => ({ id: symptom.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const symptom = getSymptom(id);
  if (!symptom) notFound();

  return pageMetadata({
    title: symptom.title,
    description: symptom.summary,
    path: `/belirtiler/${id}`,
    image: symptom.imageUrl,
    type: "article",
    publishedTime: symptom.createdAt,
    modifiedTime: symptom.updatedAt,
  });
}

export default async function SymptomDetailPage({ params }: PageProps) {
  const { id } = await params;
  const symptom = getSymptom(id);
  if (!symptom) notFound();

  return (
    <ContentDetail
      backHref="/belirtiler"
      backLabel="Belirtilere Dön"
      eyebrow="Belirti"
      title={symptom.title}
      imageUrl={symptom.imageUrl}
      imageAlt={`${symptom.title} kapak görseli`}
      date={symptom.createdAt}
      markdown={symptom.content}
      citations={symptom.citations}
    />
  );
}
