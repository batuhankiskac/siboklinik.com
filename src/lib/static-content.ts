// Belirtiler ve tanı/tedavi (hizmetler) sayfalarının sabit içeriği. Bu içerik
// admin panelinden yönetilmez; repodaki JSON dosyalarından okunur ve build'de
// statik olarak üretilir. Liste sırası JSON'daki sıradır.
import belirtilerData from "@/data/belirtiler.json";
import hizmetlerData from "@/data/hizmetler.json";
import type { Article, Service } from "@/types/content";

export const symptoms: readonly Article[] = belirtilerData;
export const services: readonly Service[] = hizmetlerData;

export function getSymptom(id: string): Article | null {
  return symptoms.find((symptom) => symptom.id === id) ?? null;
}

export function getService(id: string): Service | null {
  return services.find((service) => service.id === id) ?? null;
}
