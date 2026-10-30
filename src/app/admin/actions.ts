"use server";

import { requireAdmin } from "@/lib/auth";
import {
  deleteContent,
  saveContent,
  type FormState,
} from "@/lib/content-admin";
import { articleCollection, videoCollection } from "@/lib/content-collections";

export type { FormState };

export async function createArticle(_state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent(articleCollection, null, formData);
}

export async function updateArticle(id: string, _state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent(articleCollection, id, formData);
}

export async function deleteArticle(id: string): Promise<FormState> {
  await requireAdmin();
  return deleteContent(articleCollection, id);
}

export async function createVideo(_state: FormState, formData: FormData) {
  await requireAdmin();
  return saveContent(videoCollection, null, formData);
}

export async function deleteVideo(id: string): Promise<FormState> {
  await requireAdmin();
  return deleteContent(videoCollection, id);
}
