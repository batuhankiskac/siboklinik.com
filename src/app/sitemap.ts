import type { MetadataRoute } from "next";
import { getArticles, getServices } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import type { ArticleSummary, Service } from "@/types/content";

// Build anında prerender edilmez: build ortamında Firebase bilgileri yoksa
// site haritası belirti ve hizmetler olmadan donmasın. Veri unstable_cache
// (300 sn) üzerinden geldiği için istek başına Firestore okuması yapılmaz.
export const dynamic = "force-dynamic";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const staticRoutes: [string, ChangeFrequency, number][] = [
  ["", "weekly", 1],
  ["/belirtiler", "weekly", 0.8],
  ["/hizmetler", "weekly", 0.8],
  ["/videolar", "weekly", 0.7],
  ["/iletisim", "yearly", 0.6],
  ["/gizlilik", "yearly", 0.3],
];

// Okuma hatası site haritasını 500'e çevirmesin: hata kaydedilir ve o koleksiyon
// boş kabul edilerek statik rotalar döndürülür.
async function readOrEmpty<T>(label: string, read: () => Promise<T[]>): Promise<T[]> {
  try {
    return await read();
  } catch (error) {
    console.error(`Site haritası için ${label} okunamadı:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, services] = await Promise.all([
    readOrEmpty<ArticleSummary>("belirtiler", getArticles),
    readOrEmpty<Service>("hizmetler", getServices),
  ]);

  return [
    ...staticRoutes.map(([path, changeFrequency, priority]) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/belirtiler/${article.id}`,
      lastModified: article.updatedAt ?? article.createdAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((service) => ({
      url: `${SITE_URL}/hizmetler/${service.id}`,
      lastModified: service.updatedAt ?? service.createdAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
