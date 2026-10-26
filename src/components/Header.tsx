"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  contactLink,
  isActivePath,
  primaryNavigationLinks,
} from "@/data/navigation";
import siteData from "@/data/site.json";
import buttonStyles from "@/styles/button.module.css";
import ArrowIcon from "./ArrowIcon";
import styles from "./Header.module.css";

// Masaüstü genişlik. Header.module.css içindeki 1024px mobil kuralıyla birlikte değişmeli.
const DESKTOP_MEDIA_QUERY = "(min-width: 1025px)";

// Bu değerin üstünde kaydırılınca üst çubuk küçülür ve çizgi alır.
const SCROLLED_OFFSET = 8;

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sayfa değiştiğinde menü kapanır (render sırasında durum ayarlama).
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Kaydırma durumu data-scrolled ile işaretlenir; React yeniden çizmez.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncScrolled = () => {
      header.toggleAttribute("data-scrolled", window.scrollY > SCROLLED_OFFSET);
    };

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });
    return () => window.removeEventListener("scroll", syncScrolled);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    // Masaüstü genişliğe geçilirse menü kapanır; kaydırma kilidi takılı kalmaz.
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    // Menü açıkken odak header içinde kalsın diye kardeş öğeler etkisizleştirilir.
    const inertSiblings: HTMLElement[] = [];
    const header = headerRef.current;
    for (const sibling of Array.from(header?.parentElement?.children ?? [])) {
      if (
        sibling !== header &&
        sibling instanceof HTMLElement &&
        !sibling.inert
      ) {
        sibling.inert = true;
        inertSiblings.push(sibling);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleViewportChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleViewportChange);
      inertSiblings.forEach((sibling) => {
        sibling.inert = false;
      });
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.logo}
          prefetch={false}
          onClick={closeMenu}
        >
          <span className={styles.brandName}>{siteData.brand.siteName}</span>
          <span className={styles.brandSub}>
            {siteData.brand.shortDescription}
          </span>
        </Link>

        <button
          ref={buttonRef}
          type="button"
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          aria-label="Menü"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span></span>
          <span></span>
        </button>

        <nav
          id="primary-navigation"
          aria-label="Ana menü"
          className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}
        >
          {primaryNavigationLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              style={{ "--i": index } as CSSProperties}
              aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.navText}>{link.label}</span>
            </Link>
          ))}

          <Link
            href={contactLink.href}
            className={styles.ctaButton}
            prefetch={false}
            aria-current={
              isActivePath(pathname, contactLink.href) ? "page" : undefined
            }
            onClick={closeMenu}
          >
            Randevu Al
            <ArrowIcon className={buttonStyles.icon} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
