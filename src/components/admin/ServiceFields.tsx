import type { Service } from "@/types/content";
import { AdminFormField, AdminImageField, adminFormStyles } from "./AdminForm";

export default function ServiceFields({ service }: { service?: Service }) {
  return (
    <>
      <AdminFormField label="Başlık" htmlFor="title">
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={service?.title}
          maxLength={160}
          required
          className={adminFormStyles.input}
        />
      </AdminFormField>
      <AdminFormField label="Açıklama (Markdown)" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={service ? 14 : 12}
          defaultValue={service?.description}
          required
          className={adminFormStyles.textarea}
        />
      </AdminFormField>
      <AdminImageField
        label="Görsel"
        isEdit={Boolean(service)}
        currentImageUrl={service?.imageUrl}
        currentImageAlt={service ? `${service.title} mevcut görseli` : ""}
      />
    </>
  );
}
