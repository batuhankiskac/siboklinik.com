// Ana sayfa kartları site.json'da makalelere belge kimliğiyle bağlanır. Makale
// silinir ya da admin panelinden yeni kimlikle yeniden eklenirse kart 404'e
// gitmesin diye bağlantı liste sayfasına düşürülür.
export function resolveContentHref(
  href: string | undefined,
  listPath: string,
  ids: ReadonlySet<string>,
): string | undefined {
  if (!href?.startsWith(`${listPath}/`)) return href;
  return ids.has(href.slice(listPath.length + 1)) ? href : listPath;
}
