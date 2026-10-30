import type { Metadata } from "next";
import siteData from "@/data/site.json";
import { resolveContentHref } from "@/lib/home-links";
import { pageMetadata } from "@/lib/metadata";
import { symptoms } from "@/lib/static-content";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import StepsTimeline from "@/components/home/StepsTimeline";
import SymptomCards from "@/components/home/SymptomCards";
import TreatmentSection from "@/components/home/TreatmentSection";
import type { HomeSection } from "@/components/home/types";

export const metadata: Metadata = pageMetadata({
  title: siteData.seo.home.title,
  description: siteData.seo.home.description,
  path: "/",
  image: "/og.jpg",
});

const sections = siteData.home.sections as HomeSection[];
const heroImage = siteData.images.find((image) => image.usedIn === "hero");

// Bu iki kayıt kendi bölümlerinin içinde gösterilir; ana döngüde atlanır:
// "nedir-neden-onemli" → #nedir yan kutusu, "list" → #tedavi kutuları.
const ABOUT_HIGHLIGHT_ID = "nedir-neden-onemli";

// Belirti kartları sabit belirti sayfalarına (src/data/belirtiler.json) bağlanır.
const symptomIds = new Set(symptoms.map((symptom) => symptom.id));

export default function Home() {
  const highlight = sections.find((section) => section.id === ABOUT_HIGHLIGHT_ID);
  const treatmentBoxes = sections.filter((section) => section.kind === "list");

  return (
    <main id="main-content">
      {sections.map((section) => {
        switch (section.kind) {
          case "hero":
            return (
              <HeroSection
                key={section.id}
                section={section}
                imageAlt={heroImage?.alt ?? ""}
                eyebrow={siteData.brand.shortDescription}
                doctorName={siteData.brand.doctorName}
              />
            );
          case "text":
            if (section.id === ABOUT_HIGHLIGHT_ID) return null;
            return (
              <AboutSection
                key={section.id}
                section={section}
                highlight={highlight}
              />
            );
          case "steps":
            return <StepsTimeline key={section.id} section={section} />;
          case "cards":
            return (
              <SymptomCards
                key={section.id}
                section={{
                  ...section,
                  items: section.items?.map((item) => ({
                    ...item,
                    href: resolveContentHref(item.href, "/belirtiler", symptomIds),
                  })),
                }}
              />
            );
          case "other":
            return (
              <TreatmentSection
                key={section.id}
                section={section}
                boxes={treatmentBoxes}
              />
            );
          case "contact":
            return <ContactSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
