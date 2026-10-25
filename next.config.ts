import type { NextConfig } from "next";
import siteData from "./src/data/site.json";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline'${
        process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
      } https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://img.youtube.com https://i.ytimg.com https://www.google.com https://www.google.com.tr https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.google.com https://*.google.com.tr https://*.googleapis.com https://*.doubleclick.net https://*.googleadservices.com https://pagead2.googlesyndication.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "frame-src https://www.google.com https://www.youtube-nocookie.com https://td.doubleclick.net",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

// Storage indirme bağlantıları yalnız projenin kendi bucket'ını kullanır.
// Bucket build anında bilinmiyorsa geniş (eski) desen korunur.
const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseStoragePathname = storageBucket
  ? `/v0/b/${storageBucket}/o/**`
  : "/v0/b/**";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    serverActions: {
      // Görseller 5 MB'a kadar yüklenebilir; multipart ek yükü için pay bırakılır.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: firebaseStoragePathname,
      },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Eski statik sitenin *.html adresleri (site.json redirects).
      ...siteData.redirects.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
      // Makaleler bölümü "Belirtiler" adıyla yeniden adlandırıldı.
      { source: "/makaleler", destination: "/belirtiler", permanent: true },
      {
        source: "/makaleler/:id",
        destination: "/belirtiler/:id",
        permanent: true,
      },
      // Hakkında sayfası kaldırıldı; içerik ana sayfadaki "SIBO Nedir?" bölümüne taşındı.
      { source: "/hakkinda", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
