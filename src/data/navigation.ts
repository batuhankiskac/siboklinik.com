import siteData from "./site.json";

export interface NavigationLink {
  href: string;
  label: string;
}

// Ana menü site.json'dan okunur; "/#..." bağlantıları diğer sayfalardan da
// ana sayfadaki bölüme götürür.
export const navigationLinks: NavigationLink[] = siteData.navigation;

// Menüdeki son bağlantı (İletişim) buton olarak gösterilir.
export const contactLink: NavigationLink = {
  href: "/iletisim",
  label: "İletişim",
};

// Ana menü dışında kalan bağlantılar (İletişim buton olarak ayrıca gösterilir).
export const primaryNavigationLinks: NavigationLink[] = navigationLinks.filter(
  (link) => link.href !== contactLink.href,
);

// Yalnız alt bilgide gösterilir; ana menüye eklenmez.
export const privacyLink: NavigationLink = {
  href: "/gizlilik",
  label: "Gizlilik ve Çerez Politikası",
};

// Admin girişinden sonra ve /admin kökünden açılan varsayılan sayfa.
export const ADMIN_HOME = "/admin/makaleler";

export function isActivePath(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
