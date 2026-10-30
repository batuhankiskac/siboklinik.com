import type { MetadataRoute } from "next";
import { getArticles, getVideos } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { services, symptoms } from "@/lib/static-content";
import type { ArticleSummary } from "@/types/content";

// Build anında prerender edilmez: build ortamında Firebase bilgileri yoksa
// site haritası makaleler olmadan donmasın. Veri unstable_cache (300 sn)
// üzerinden geldiği için istek başına Firestore okuması yapılmaz.
// readOrEmpty okuma hatasında boş liste döndürdüğü için bu dosya revalidate ile
// ISR'a alınmaz: boş liste yenileme süresince önbellekte kalırdı.
export const dynamic = "force-dynamic";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const staticRoutes: [string, ChangeFrequency, number][] = [
  ["", "weekly", 1],
  ["/belirtiler", "weekly", 0.8],
  ["/hizmetler", "weekly", 0.8],
  ["/makaleler", "weekly", 0.8],
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

// Belirti ve hizmet sayfaları sabit içeriktir (src/data/*.json).
const detailRoute = (path: string, item: { updatedAt: string | null; createdAt: string | null }) => ({
  url: `${SITE_URL}${path}`,
  lastModified: item.updatedAt ?? item.createdAt ?? undefined,
  changeFrequency: "monthly" as const,
  priority: 0.7,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await readOrEmpty<ArticleSummary>("makaleler", getArticles);
  // Video sayfası boşken haritaya eklenmez: boş sayfa dizine girmesin.
  const videos = await readOrEmpty("videolar", getVideos);

  return [
    ...staticRoutes.map(([path, changeFrequency, priority]) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...(videos.length > 0
      ? [{ url: `${SITE_URL}/videolar`, changeFrequency: "weekly" as const, priority: 0.7 }]
      : []),
    ...symptoms.map((symptom) => detailRoute(`/belirtiler/${symptom.id}`, symptom)),
    ...services.map((service) => detailRoute(`/hizmetler/${service.id}`, service)),
    ...articles.map((article) => detailRoute(`/makaleler/${article.id}`, article)),
  ];
}
