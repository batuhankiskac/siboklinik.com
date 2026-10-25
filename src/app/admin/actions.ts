"use server";

import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { deleteImage, uploadImage, type UploadedImage } from "@/lib/uploads";
import {
  assertDocumentId,
  FormError,
  optionalLines,
  requiredText,
  validateImageFile,
} from "@/lib/validation";
import { extractYoutubeId } from "@/lib/youtube";

export type FormState = { error?: string };

type Collection = "services" | "articles" | "videos";

const NOT_FOUND: Record<Collection, string> = {
  services: "Hizmet bulunamadı.",
  articles: "Belirti bulunamadı.",
  videos: "Video bulunamadı.",
};

function selectedFile(formData: FormData): File | null {
  const value = formData.get("image");
  return value instanceof File && value.size > 0 ? value : null;
}

function database() {
  const db = getAdminDb();
  if (!db) throw new FormError("Firebase Admin veritabanı yapılandırması eksik.");
  return db;
}

function currentImage(data: DocumentData) {
  return {
    imageUrl:
      typeof data.imageUrl === "string"
        ? data.imageUrl
        : typeof data.image === "string"
          ? data.image
          : null,
    imagePath: typeof data.imagePath === "string" ? data.imagePath : null,
  };
}

function errorState(error: unknown): FormState {
  if (error instanceof FormError) return { error: error.message };
  console.error("Admin işlemi başarısız:", error);
  return { error: "İşlem tamamlanamadı. Lütfen tekrar deneyin." };
}

const serviceFields = (formData: FormData) => ({
  title: requiredText(formData, "title", 160),
  description: requiredText(formData, "description", 20_000),
});

const articleFields = (formData: FormData) => ({
  title: requiredText(formData, "title", 200),
  summary: requiredText(formData, "summary", 600),
  content: requiredText(formData, "content", 100_000),
  citations: optionalLines(formData, "citations", 20_000),
});

const videoFields = (formData: FormData) => {
  const title = requiredText(formData, "title", 200);
  const youtubeId = extractYoutubeId(requiredText(formData, "url", 500));
  if (!youtubeId) throw new FormError("Geçerli bir YouTube URL'si girin.");
  return { title, youtubeId };
};

async function saveContent(
  collection: Collection,
  id: string | null,
  formData: FormData,
  readFields: (formData: FormData) => DocumentData,
  redirectTo: string,
): Promise<FormState> {
  try {
    // Tüm alanlar, görsel yüklenmeden önce doğrulanır.
    const fields = readFields(formData);
    const image = selectedFile(formData);
    const invalidImage = image && validateImageFile(image);
    if (invalidImage) throw new FormError(invalidImage);

    const docId = id === null ? null : assertDocumentId(id);
    const db = database();
    const collectionRef = db.collection(collection);

    const uploaded: UploadedImage | null = image
      ? await uploadImage(image, collection)
      : null;
    let replaced: ReturnType<typeof currentImage> | null = null;
    try {
      if (docId) {
        const reference = collectionRef.doc(docId);
        // Okuma ve güncelleme tek işlemde yapılır; eşzamanlı düzenlemelerde
        // gerçekten değiştirilen önceki görsel silinir.
        replaced = await db.runTransaction(async (transaction) => {
          const snapshot = await transaction.get(reference);
          if (!snapshot.exists) throw new FormError(NOT_FOUND[collection]);
          const previous = currentImage(snapshot.data()!);
          transaction.update(reference, {
            ...fields,
            imageUrl: uploaded?.imageUrl ?? previous.imageUrl,
            imagePath: uploaded?.imagePath ?? previous.imagePath,
            updatedAt: FieldValue.serverTimestamp(),
          });
          return previous;
        });
      } else {
        await collectionRef.doc().set({
          ...fields,
          imageUrl: uploaded?.imageUrl ?? null,
          imagePath: uploaded?.imagePath ?? null,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      if (uploaded) await deleteImage(uploaded.imageUrl, uploaded.imagePath);
      throw error;
    }
    if (uploaded && replaced) {
      await deleteImage(replaced.imageUrl, replaced.imagePath);
    }
  } catch (error) {
    return errorState(error);
  }

  updateTag(collection);
  redirect(redirectTo);
}

// Silme hataları da kaydetme işlemleriyle aynı biçimde (Türkçe mesajlı FormState)
// döner; admin arayüzü bunu gösterebilir.
async function deleteContent(collection: Collection, id: string): Promise<FormState> {
  try {
    const docId = assertDocumentId(id);
    const db = database();
    const reference = db.collection(collection).doc(docId);
    const previous = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists) return null;
      transaction.delete(reference);
      return currentImage(snapshot.data()!);
    });
    // Belge silindikten sonra etiket hemen güncellenir; görsel silme hatası
    // belgenin silinmiş olduğu gerçeğini değiştirmez.
    updateTag(collection);
    if (previous) await deleteImage(previous.imageUrl, previous.imagePath);
    return {};
  } catch (error) {
    return errorState(error);
  }
}

export async function createService(_state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent("services", null, formData, serviceFields, "/admin/hizmetler");
}

export async function updateService(id: string, _state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent("services", id, formData, serviceFields, "/admin/hizmetler");
}

export async function deleteService(id: string): Promise<FormState> {
  await requireAdmin();
  return deleteContent("services", id);
}

export async function createArticle(_state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent("articles", null, formData, articleFields, "/admin/makaleler");
}

export async function updateArticle(id: string, _state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent("articles", id, formData, articleFields, "/admin/makaleler");
}

export async function deleteArticle(id: string): Promise<FormState> {
  await requireAdmin();
  return deleteContent("articles", id);
}

export async function createVideo(_state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent("videos", null, formData, videoFields, "/admin/videolar");
}

export async function deleteVideo(id: string): Promise<FormState> {
  await requireAdmin();
  return deleteContent("videos", id);
}
