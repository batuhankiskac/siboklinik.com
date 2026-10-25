import Image from "next/image";
import Link from "next/link";
import type { HomeSection } from "./types";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  section: HomeSection;
  imageAlt: string;
};

export default function HeroSection({ section, imageAlt }: HeroSectionProps) {
  const [primaryCta, secondaryCta] = section.ctas ?? [];

  return (
    <section id={section.id} className={styles.hero}>
      {/* Hero LCP görseli: preload ile <head> içinde erken istenir (Next 16: priority kullanımdan kalktı). */}
      <Image
        src="/images/hero.webp"
        alt={imageAlt}
        fill
        preload
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>{section.title}</h1>
        {section.subtitle && (
          <p className={styles.subtitle}>{section.subtitle}</p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className={styles.actions}>
            {primaryCta && (
              <Link href={primaryCta.href} className={styles.primary}>
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className={styles.outline}>
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
