import type { Article } from "@/types/content";
import {
  AdminFormField,
  AdminImageField,
  adminFormStyles,
  hintId,
} from "./AdminForm";

export default function ArticleFields({ article }: { article?: Article }) {
  return (
    <>
      <AdminFormField label="Başlık" htmlFor="title">
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={article?.title}
          maxLength={200}
          required
          className={adminFormStyles.input}
        />
      </AdminFormField>
      <AdminFormField
        label="Özet"
        htmlFor="summary"
        hint="Listeleme ve arama sonuçlarında kullanılır."
      >
        <textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={article?.summary}
          maxLength={600}
          required
          aria-describedby={hintId("summary")}
          className={adminFormStyles.textarea}
        />
      </AdminFormField>
      <AdminImageField
        label="Kapak görseli"
        isEdit={Boolean(article)}
        currentImageUrl={article?.imageUrl}
        currentImageAlt={article ? `${article.title} mevcut kapak görseli` : ""}
      />
      <AdminFormField label="İçerik (Markdown)" htmlFor="content">
        <textarea
          id="content"
          name="content"
          rows={20}
          defaultValue={article?.content}
          required
          className={adminFormStyles.textarea}
        />
      </AdminFormField>
      <AdminFormField
        label="Kaynakça"
        htmlFor="citations"
        hint="Her satıra bir kaynak yazın."
      >
        <textarea
          id="citations"
          name="citations"
          rows={6}
          defaultValue={article?.citations.join("\n")}
          aria-describedby={hintId("citations")}
          className={adminFormStyles.textarea}
        />
      </AdminFormField>
    </>
  );
}
