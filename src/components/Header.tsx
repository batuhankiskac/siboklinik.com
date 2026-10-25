"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  contactLink,
  isActivePath,
  primaryNavigationLinks,
} from "@/data/navigation";
import siteData from "@/data/site.json";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sayfa değiştiğinde menü kapanır (render sırasında durum ayarlama).
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    // Masaüstü genişliğe geçilirse menü kapanır; kaydırma kilidi takılı kalmaz.
    const desktopQuery = window.matchMedia("(min-width: 1025px)");
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
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
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className={styles.header}>
      <Link href="/" className={styles.logo} onClick={closeMenu}>
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
        <span></span>
      </button>

      <nav
        id="primary-navigation"
        aria-label="Ana menü"
        className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}
      >
        {primaryNavigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.navLink}
            aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}

        <Link
          href={contactLink.href}
          className={styles.ctaButton}
          aria-current={
            isActivePath(pathname, contactLink.href) ? "page" : undefined
          }
          onClick={closeMenu}
        >
          {contactLink.label}
        </Link>
      </nav>
    </header>
  );
}
