import {
  AdminForm,
  AdminFormField,
  adminFormStyles,
} from "@/components/admin/AdminForm";
import { createVideo } from "../../actions";

export default function AddVideoPage() {
  return (
    <AdminForm
      title="Yeni Video Ekle"
      action={createVideo}
      submitLabel="Kaydet"
    >
      <AdminFormField label="Başlık" htmlFor="title">
        <input
          type="text"
          id="title"
          name="title"
          maxLength={200}
          required
          className={adminFormStyles.input}
        />
      </AdminFormField>
      <AdminFormField label="YouTube URL'si" htmlFor="url">
        <input
          type="url"
          id="url"
          name="url"
          placeholder="https://www.youtube.com/watch?v=..."
          required
          className={adminFormStyles.input}
        />
      </AdminFormField>
    </AdminForm>
  );
}
