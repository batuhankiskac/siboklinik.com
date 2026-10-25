// seed/content.json içeriğini Firestore'a yazar: articles, services, videos.
//
//   npm run seed              mevcut belgeleri atlar, eksikleri oluşturur
//   npm run seed -- --dry-run yazmadan ne yapılacağını listeler
//   npm run seed -- --force   mevcut belgelerin metin alanlarını seed ile günceller
//
// Yazılan alanlar src/app/admin/actions.ts ile aynıdır. Görsel alanları
// (imageUrl/imagePath) yalnız yeni belgelerde null olarak yazılır; --force ile
// güncellenen belgelerdeki yüklenmiş görseller korunur.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SEED_PATH = resolve(ROOT, "seed/content.json");
const ENV_PATH = resolve(ROOT, ".env.local");
const DOCUMENT_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const BATCH_SIZE = 400;

// src/lib/validation.ts içindeki parsePrivateKey ile aynı kurallar: base64
// değeri önceliklidir, tırnaklar kaldırılır, kaçışlı \n gerçek satır sonuna çevrilir.
// Bu script TypeScript modülünü içe aktaramadığı için mantık burada tekrarlanır;
// iki yer değiştiğinde birlikte güncellenmelidir.
function parsePrivateKey(env) {
  const base64 = env.FIREBASE_PRIVATE_KEY_BASE64?.trim();
  const raw = base64
    ? Buffer.from(base64, "base64").toString("utf8")
    : env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;
  const key = raw
    .trim()
    .replace(/^(["'])([\s\S]*)\1$/, "$2")
    .replace(/\\n/g, "\n")
    .trim();
  return key || undefined;
}

function parseArgs(argv) {
  const flags = new Set(argv);
  const unknown = [...flags].filter((flag) => !["--force", "--dry-run"].includes(flag));
  if (unknown.length) {
    throw new Error(`Bilinmeyen seçenek: ${unknown.join(", ")}`);
  }
  return { force: flags.has("--force"), dryRun: flags.has("--dry-run") };
}

function requireId(id, label) {
  if (typeof id !== "string" || !DOCUMENT_ID_PATTERN.test(id)) {
    throw new Error(`${label} için geçersiz id: ${JSON.stringify(id)}`);
  }
  return id;
}

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} alanı boş veya metin değil.`);
  }
  return value.trim();
}

// Seed kayıtlarını actions.ts'in yazdığı alanlara dönüştürür.
// legacyPath gibi yalnız geçiş için tutulan alanlar yazılmaz.
function buildCollections(seed) {
  const articles = (seed.articles ?? []).map((item) => ({
    id: requireId(item.id, "articles"),
    fields: {
      title: requireText(item.title, `articles/${item.id} title`),
      summary: requireText(item.summary, `articles/${item.id} summary`),
      content: requireText(item.content, `articles/${item.id} content`),
      citations: Array.isArray(item.citations)
        ? item.citations.filter((line) => typeof line === "string" && line.trim())
        : [],
    },
  }));

  const services = (seed.services ?? []).map((item) => ({
    id: requireId(item.id, "services"),
    fields: {
      title: requireText(item.title, `services/${item.id} title`),
      description: requireText(item.description, `services/${item.id} description`),
    },
  }));

  const videos = (seed.videos ?? []).map((item) => {
    const youtubeId = typeof item.youtubeId === "string" ? item.youtubeId : "";
    if (!YOUTUBE_ID_PATTERN.test(youtubeId)) {
      throw new Error(`videos/${item.id} için geçerli youtubeId yok.`);
    }
    return {
      id: requireId(item.id, "videos"),
      fields: {
        title: requireText(item.title, `videos/${item.id} title`),
        youtubeId,
      },
    };
  });

  return { articles, services, videos };
}

// Görsel alanları yalnız yeni belgede yazılır; güncellemede dokunulmaz.
function createPayload(fields) {
  return {
    ...fields,
    imageUrl: null,
    imagePath: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

function updatePayload(fields) {
  return { ...fields, updatedAt: FieldValue.serverTimestamp() };
}

function initFirestore() {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env);
  if (!projectId || !clientEmail || !privateKey) return null;

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
  return getFirestore(app);
}

async function main() {
  const { force, dryRun } = parseArgs(process.argv.slice(2));

  // Node 20.12+/21.7+ ortam dosyasını doğrudan yükler; mevcut ortam değişkenleri
  // değiştirilmez.
  if (existsSync(ENV_PATH) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(ENV_PATH);
  }

  const seed = JSON.parse(await readFile(SEED_PATH, "utf8"));
  const collections = buildCollections(seed);
  const total = Object.values(collections).reduce((sum, items) => sum + items.length, 0);

  // Kimlik bilgisi yoksa dry-run yine de planı gösterir; yazma yapılmaz.
  const db = initFirestore();
  if (!db && !dryRun) {
    throw new Error(
      "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ve FIREBASE_PRIVATE_KEY_BASE64 veya FIREBASE_PRIVATE_KEY zorunludur.",
    );
  }
  if (!db) {
    console.log("Firebase kimlik bilgisi yok: mevcut belgeler kontrol edilmedi.");
  }

  const counts = { created: 0, updated: 0, skipped: 0 };

  for (const [collectionName, items] of Object.entries(collections)) {
    const refs = db ? items.map((item) => db.collection(collectionName).doc(item.id)) : [];
    const existing = db && refs.length ? await db.getAll(...refs) : [];

    const plan = items.map((item, index) => {
      const exists = db ? existing[index].exists : null;
      if (exists === null) return { item, action: "oluştur?" };
      if (!exists) return { item, action: "oluştur" };
      return { item, action: force ? "güncelle" : "atla" };
    });

    for (const { item, action } of plan) {
      console.log(`${action.padEnd(9)} ${collectionName}/${item.id}`);
      if (action === "oluştur" || action === "oluştur?") counts.created += 1;
      else if (action === "güncelle") counts.updated += 1;
      else counts.skipped += 1;
    }

    if (dryRun || !db) continue;

    const writes = plan.filter(({ action }) => action !== "atla");
    for (let index = 0; index < writes.length; index += BATCH_SIZE) {
      const batch = db.batch();
      for (const { item, action } of writes.slice(index, index + BATCH_SIZE)) {
        const reference = db.collection(collectionName).doc(item.id);
        if (action === "oluştur") {
          batch.set(reference, createPayload(item.fields));
        } else {
          batch.set(reference, updatePayload(item.fields), { merge: true });
        }
      }
      await batch.commit();
    }
  }

  const mode = dryRun ? "Kuru çalıştırma (yazılmadı)" : "Tamamlandı";
  console.log(
    `${mode}: ${total} kayıt işlendi; ${counts.created} oluşturulacak/oluşturuldu, ` +
      `${counts.updated} güncellenecek/güncellendi, ${counts.skipped} atlandı.`,
  );
}

main().catch((error) => {
  console.error(`Seed başarısız: ${error.message}`);
  process.exitCode = 1;
});
