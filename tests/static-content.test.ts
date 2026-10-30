import { describe, expect, it } from "vitest";
import siteData from "@/data/site.json";
import { navigationLinks, ADMIN_HOME } from "@/data/navigation";
import {
  getService,
  getSymptom,
  services,
  symptoms,
} from "@/lib/static-content";

const SYMPTOM_IDS = [
  "cilt-sorunlari",
  "eklem-agrisi",
  "hazimsizlik",
  "intolerans",
  "kabizlik-ishal",
  "karin-agrisi",
  "kilo-kaybi",
  "siskinlik",
  "yorgunluk",
];

const SERVICE_IDS = [
  "bagirsak-bariyeri-destegi",
  "bitkisel-veya-medikal-tedavi",
  "eliminasyon-diyeti",
  "kan-tahlilleri",
  "klinik-degerlendirme",
  "probiyotik-destegi",
  "sibo-nefes-testi",
];

describe("sabit belirti içeriği", () => {
  it("9 belirtiyi yayındaki sırayla içerir", () => {
    expect(symptoms.map((symptom) => symptom.id)).toEqual(SYMPTOM_IDS);
  });

  it("her belirtide başlık, özet, içerik ve tarih bulunur", () => {
    for (const symptom of symptoms) {
      expect(symptom.title.trim(), symptom.id).not.toBe("");
      expect(symptom.summary.trim(), symptom.id).not.toBe("");
      expect(symptom.content.trim(), symptom.id).not.toBe("");
      expect(Number.isNaN(Date.parse(symptom.createdAt ?? "")), symptom.id).toBe(false);
    }
  });

  it("kimlikle bulur, bilinmeyen kimlikte null döner", () => {
    expect(getSymptom("siskinlik")?.title).toBe("Aşırı Şişkinlik (Distansiyon)");
    expect(getSymptom("yok")).toBeNull();
  });

  it("ana sayfa belirti kartları var olan sayfalara bağlanır", () => {
    const cards = siteData.home.sections.find((section) => section.id === "belirtiler");
    const hrefs = (cards?.items ?? []).map((item) =>
      "href" in item && typeof item.href === "string" ? item.href : "",
    );
    expect(hrefs).toHaveLength(9);
    for (const href of hrefs) {
      expect(getSymptom(href.replace("/belirtiler/", "")), href).not.toBeNull();
    }
  });

  it("eski .html yönlendirmeleri var olan belirti sayfalarına gider", () => {
    for (const { destination } of siteData.redirects) {
      if (!destination.startsWith("/belirtiler/")) continue;
      expect(getSymptom(destination.slice("/belirtiler/".length)), destination).not.toBeNull();
    }
  });
});

describe("sabit hizmet içeriği", () => {
  it("7 hizmeti yayındaki sırayla içerir", () => {
    expect(services.map((service) => service.id)).toEqual(SERVICE_IDS);
  });

  it("kimlikle bulur, bilinmeyen kimlikte null döner", () => {
    expect(getService("sibo-nefes-testi")?.title).toBe("SIBO Nefes Testi");
    expect(getService("yok")).toBeNull();
  });
});

describe("menü ve yönetim", () => {
  it("Belirtiler ve Makaleler ayrı menü öğeleridir", () => {
    expect(navigationLinks).toContainEqual({ href: "/belirtiler", label: "Belirtiler" });
    expect(navigationLinks).toContainEqual({ href: "/makaleler", label: "Makaleler" });
  });

  it("alt bilgide Makaleler ve Videolar bağlantıları bulunur", () => {
    expect(siteData.footer.links).toContainEqual({ label: "Makaleler", href: "/makaleler" });
    expect(siteData.footer.links).toContainEqual({ label: "Videolar", href: "/videolar" });
  });

  it("admin varsayılan sayfası makalelerdir", () => {
    expect(ADMIN_HOME).toBe("/admin/makaleler");
  });
});
