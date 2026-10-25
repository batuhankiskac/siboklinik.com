"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CONSENT_STORAGE_KEY,
  consentPayload,
  OPEN_CONSENT_EVENT,
} from "@/lib/consent";
import styles from "./AnalyticsConsent.module.css";

type ConsentState = "accepted" | "rejected" | null;

// GTM yalnız kabul edildikten sonra yüklenir (bkz. loadGtm).
const STORAGE_KEY = CONSENT_STORAGE_KEY;
const GTM_ID = "GTM-5DGZ7QV3";
const TITLE_ID = "analytics-consent-title";
const DESCRIPTION_ID = "analytics-consent-description";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// gtag komutları dizi değil arguments nesnesi olarak beklenir.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function updateConsent(value: Exclude<ConsentState, null>) {
  gtag(
    "consent",
    "update",
    consentPayload(value === "accepted" ? "granted" : "denied"),
  );
}

// GTM konteyneri en fazla bir kez ve yalnız kabul edildikten sonra yüklenir.
// Consent update olayı, gtm.js'ten önce dataLayer'a yazılmış olmalıdır.
let gtmRequested = false;
function loadGtm() {
  if (gtmRequested) return;
  gtmRequested = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

// Telefon ve WhatsApp bağlantıları (belirti yazıları içindekiler dahil) GTM'de
// dönüşüm etiketi tetiklemek için tek bir olayla bildirilir.
function contactMethod(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "phone";
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return "whatsapp";
  return null;
}

// localStorage erişilemediğinde (ör. Safari gizli mod) tercih bellekte tutulur.
let memoryConsent: ConsentState = null;
const listeners = new Set<() => void>();

function readConsent(): ConsentState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "accepted" || saved === "rejected") return saved;
  } catch {}
  return memoryConsent;
}

function writeConsent(value: Exclude<ConsentState, null>) {
  memoryConsent = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export default function AnalyticsConsent() {
  const consent = useSyncExternalStore<ConsentState | "unknown">(
    subscribe,
    readConsent,
    () => "unknown",
  );
  // true: alt bilgideki "Çerez tercihleri" ile açılmış modal panel.
  // false: ilk ziyarette görünen, odak almayan banner.
  const [showPreferences, setShowPreferences] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Paneli kapatır ve odağı paneli açan öğeye geri verir.
  const closePanel = useCallback(() => {
    setShowPreferences(false);
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target?.isConnected) target.focus();
  }, []);

  useEffect(() => {
    const open = () => {
      // Panel zaten açıksa odak geri dönüş öğesi değiştirilmez.
      if (panelRef.current) return;
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
      setShowPreferences(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  // Panel açılınca odak içindeki ilk düğmeye (Kapat) taşınır.
  useEffect(() => {
    if (showPreferences) {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    }
  }, [showPreferences]);

  // Modal panelde Escape ile kapanır ve Tab odağı panel içinde döngüye girer.
  useEffect(() => {
    if (!showPreferences) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      const outside = !panel.contains(active);
      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreferences, closePanel]);

  // Kabul edilmiş tercih (bu sayfada veya başka sekmede) GTM'i yükler.
  useEffect(() => {
    if (consent === "accepted") loadGtm();
  }, [consent]);

  // Başka sekmede verilen tercih bu sekmedeki GTM'e de iletilir.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === STORAGE_KEY &&
        (event.newValue === "accepted" || event.newValue === "rejected")
      ) {
        updateConsent(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      const method = link && contactMethod(link);
      if (!method) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "contact_click",
        contact_method: method,
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  const choose = (value: Exclude<ConsentState, null>) => {
    updateConsent(value);
    writeConsent(value);
    closePanel();
  };

  const isDialog = showPreferences;
  const visible = consent !== "unknown" && (consent === null || isDialog);

  const body = (
    <>
      <div className={styles.header}>
        <h2 id={TITLE_ID} className={styles.title}>
          Çerez tercihleri
        </h2>
        {isDialog && (
          <button type="button" className={styles.close} onClick={closePanel}>
            Kapat
          </button>
        )}
      </div>
      <p id={DESCRIPTION_ID}>
        Site deneyimini ve reklam dönüşümlerini ölçmek için isteğe bağlı analiz
        çerezleri kullanıyoruz. Ayrıntılar ve haklarınız için{" "}
        <Link href="/gizlilik">Gizlilik ve Çerez Politikası</Link> sayfasını
        inceleyebilirsiniz.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => choose("rejected")}
        >
          Reddet
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={() => choose("accepted")}
        >
          Kabul Et
        </button>
      </div>
    </>
  );

  return (
    <>
      {visible &&
        (isDialog ? (
          <div
            ref={panelRef}
            className={styles.banner}
            role="dialog"
            aria-modal="true"
            aria-labelledby={TITLE_ID}
            aria-describedby={DESCRIPTION_ID}
          >
            {body}
          </div>
        ) : (
          <aside
            className={styles.banner}
            aria-labelledby={TITLE_ID}
            aria-describedby={DESCRIPTION_ID}
          >
            {body}
          </aside>
        ))}
    </>
  );
}
