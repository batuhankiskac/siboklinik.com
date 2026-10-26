import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ArrowIcon from "@/components/ArrowIcon";
import buttonStyles from "@/styles/button.module.css";
import type { HomeSection } from "./types";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  section: HomeSection;
  imageAlt: string;
  // site.json brand.shortDescription ve brand.doctorName.
  eyebrow: string;
  doctorName: string;
};

// Başlığın son iki kelimesi limon vurgusu alır ("Hayat Kalitenizdir").
function splitTitle(title: string): { head: string; mark: string } {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return { head: "", mark: title.trim() };
  return {
    head: `${words.slice(0, -2).join(" ")} `,
    mark: words.slice(-2).join(" "),
  };
}

const enter = (i: number) => ({ "--i": i }) as CSSProperties;

export default function HeroSection({
  section,
  imageAlt,
  eyebrow,
  doctorName,
}: HeroSectionProps) {
  const [primaryCta, secondaryCta] = section.ctas ?? [];
  const title = splitTitle(section.title);

  return (
    <section id={section.id} className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.eyebrow} data-enter style={enter(0)}>
            {eyebrow}
          </p>
          <h1 className={styles.title} data-enter style={enter(1)}>
            {title.head}
            <span className={styles.mark}>{title.mark}</span>
          </h1>
          {section.subtitle && (
            <p className={styles.subtitle} data-enter style={enter(2)}>
              {section.subtitle}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className={styles.actions} data-enter style={enter(3)}>
              {primaryCta && (
                <Link href={primaryCta.href} className={styles.primary}>
                  {primaryCta.label}
                  <ArrowIcon className={buttonStyles.icon} />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className={styles.secondary}>
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className={styles.media}>
          {/* Hero LCP görseli: preload ile <head> içinde erken istenir (Next 16: priority kullanımdan kalktı). */}
          <div className={styles.frame} data-enter="mask" style={enter(2)}>
            <Image
              src="/images/hero.webp"
              alt={imageAlt}
              fill
              preload
              sizes="(max-width: 899px) 100vw, 42vw"
              className={styles.image}
            />
          </div>
          <div className={styles.chip} data-enter="fade" style={enter(4)}>
            <span className={styles.pulse} aria-hidden="true" />
            <span>
              <span className={styles.chipName}>{doctorName}</span>
              <span className={styles.chipRole}>İç Hastalıkları Uzmanı</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
