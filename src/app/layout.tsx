import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { SITE_NAME } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import site from "@/data/site.json";
import "./globals.css";

const playfair = Playfair_Display({
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

// Yalnız tüm sayfalar için geçerli varsayılanlar; sayfaya özel başlık, url ve
// canonical her sayfada pageMetadata() ile tanımlanır.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.seo.home.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: site.seo.home.description,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${outfit.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
