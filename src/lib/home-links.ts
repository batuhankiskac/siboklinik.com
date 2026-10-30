// Ana sayfa kartları site.json'da detay sayfalarına kimlikle bağlanır. Kimlik
// listede yoksa (ör. sayfa kaldırıldıysa ya da yeniden adlandırıldıysa) kart
// 404'e gitmesin diye bağlantı liste sayfasına düşürülür.
export function resolveContentHref(
  href: string | undefined,
  listPath: string,
  ids: ReadonlySet<string>,
): string | undefined {
  if (!href?.startsWith(`${listPath}/`)) return href;
  return ids.has(href.slice(listPath.length + 1)) ? href : listPath;
}
