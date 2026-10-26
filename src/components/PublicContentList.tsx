import type { CSSProperties, ReactNode } from "react";
import ContentGrid from "@/components/ContentGrid";
import EmptyState from "@/components/EmptyState";
import styles from "./PublicContentList.module.css";

type PublicContentListProps<T extends { id: string }> = {
  load: () => Promise<T[]>;
  emptyText: string;
  renderItem: (item: T) => ReactNode;
};

// Liste sayfalarının ortak kalıbı: veriyi yükler, kartları ızgarada gösterir,
// boşsa boş durum metnini yazar. Suspense sınırı çağıran sayfada kalır.
// Her öğe, reveal gecikmesi için (index % 3) ile sarılır.
export default async function PublicContentList<T extends { id: string }>({
  load,
  emptyText,
  renderItem,
}: PublicContentListProps<T>) {
  const items = await load();

  return (
    <ContentGrid>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={item.id}
            className={styles.item}
            data-reveal
            style={{ "--i": index % 3 } as CSSProperties}
          >
            {renderItem(item)}
          </div>
        ))
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </ContentGrid>
  );
}
