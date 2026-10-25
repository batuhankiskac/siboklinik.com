# siboklinik.com

SIBO Klinik (`siboklinik.com`) için Next.js 16 tabanlı kurumsal site ve içerik
yönetim paneli. Kamuya açık sayfalar (ana sayfa, belirtiler, tanı ve tedavi,
videolar, iletişim, gizlilik) Firebase Admin ile sunucuda render edilir. Yönetim
paneli Firebase Authentication ile korunur ve `Hizmetler`, `Belirtiler`,
`Videolar` koleksiyonlarını yönetir. Tarayıcıya yalnız admin girişinde gereken
Firebase Auth kodu gönderilir.

Public görünüm eski statik siteyle aynıdır (renkler, yazı tipleri ve bölüm
düzeni). Sayfa içeriği `src/data/site.json` dosyasından gelir.

## Sayfalar

| Yol | İçerik |
| --- | --- |
| `/` | Ana sayfa (`site.json` → `home.sections`, `#nedir`, `#tedavi` gibi bölüm bağlantıları) |
| `/belirtiler` | Belirtiler listesi (Firestore `articles`) |
| `/belirtiler/[id]` | Belirti detayı |
| `/hizmetler` | Tanı ve Tedavi hizmetleri (Firestore `services`) |
| `/videolar` | Videolar (Firestore `videos`) |
| `/iletisim` | İletişim ve randevu bilgileri |
| `/gizlilik` | Gizlilik ve Çerez Politikası / KVKK Aydınlatma Metni |
| `/login`, `/admin/*` | Yönetim paneli (noindex, robots'ta engelli) |

Eski statik sitenin `*.html` adresleri ve `/makaleler`, `/hakkinda` adresleri
`next.config.ts` içinde kalıcı (301/308) yönlendirmelerle yeni adreslere
taşınır. Yönlendirme listesi `src/data/site.json` → `redirects` alanındadır.

## Gereksinimler

- Node.js 22+
- Bu site için **ayrı bir Firebase projesi** (Firestore, Storage, Authentication)
- Authentication üzerinde e-posta/şifre sağlayıcısı
- Yönetici kullanıcıda `admin: true` custom claim’i

Başka bir sitenin Firebase projesini (ör. eski profdrmuharremkiskac.com projesi)
kullanmayın. Projeler ayrı olmalıdır; aksi halde iki site aynı veriyi ve yönetici
hesaplarını paylaşır.

## Firebase projesini kurma

1. [Firebase Console](https://console.firebase.google.com/) üzerinde yeni bir
   proje oluşturun.
2. **Authentication → Sign-in method** bölümünde **E-posta/Şifre** sağlayıcısını
   etkinleştirin. Yönetici hesabını **Users** sekmesinden e-posta ve şifreyle
   ekleyin.
3. **Firestore Database** oluşturun (production modu).
4. **Storage** oluşturun. Yüklenen görseller bu bucket’a yazılır.
5. **Project settings → Your apps** altında bir Web uygulaması ekleyin ve
   yapılandırma değerlerini `.env.local` içindeki `NEXT_PUBLIC_FIREBASE_*`
   alanlarına yazın.
6. **Project settings → Service accounts** bölümünden yeni bir özel anahtar
   (private key) oluşturun. `client_email`, `private_key` ve `project_id`
   değerlerini `FIREBASE_*` alanlarına yazın.
7. Yönetici hesabına `admin: true` custom claim’ini verin. Claim olmadan giriş
   yapılsa bile panel açılmaz; yalnız e-posta eşleşmesi yetki sağlamaz.

   ```bash
   node --input-type=module -e '
   import { cert, initializeApp } from "firebase-admin/app";
   import { getAuth } from "firebase-admin/auth";
   initializeApp({ credential: cert({
     projectId: process.env.FIREBASE_PROJECT_ID,
     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
   }) });
   const user = await getAuth().getUserByEmail("yonetici@ornek.com");
   await getAuth().setCustomUserClaims(user.uid, { admin: true });
   console.log("admin claim verildi:", user.uid);
   '
   ```

   Komutu proje kökünden, `.env.local` değerleri ortamda tanımlıyken çalıştırın
   (ör. `set -a; . ./.env.local; set +a`). Claim değişikliği bir sonraki oturum
   yenilemesinde geçerli olur.

## Yerel kurulum

```bash
npm ci
cp env-example.txt .env.local
# .env.local değerlerini doldurun
npm run dev
```

`.env.local` içindeki `NEXT_PUBLIC_FIREBASE_*` değerleri yalnız login ekranı
içindir. `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` ve
`FIREBASE_PRIVATE_KEY_BASE64` gibi Admin değerleri yalnız sunucuda tutulmalı,
`NEXT_PUBLIC_` öneki almamalı ve repoya eklenmemelidir.

Firebase Admin değerleri tanımlı değilse public koleksiyonlar boş gösterilir.
Admin paneli ise giriş yapılmadığı için açılmaz.

## Kuralları yayımlama

`firestore.rules` ve `storage.rules` istemci erişimini yalnız `admin` claim’i
olan kullanıcılarla sınırlar. Production’a almadan önce doğru projeyi seçin:

```bash
firebase use <proje-id>
firebase deploy --only firestore:rules,storage
```

## Başlangıç içeriğini yükleme (`npm run seed`)

`seed/content.json` içinde 9 belirti (`articles`), 7 hizmet (`services`) ve
boş bir video listesi bulunur. Bu içerik Firestore’a aşağıdaki komutla yazılır:

```bash
npm run seed -- --dry-run   # yazmadan ne yapılacağını listeler
npm run seed                # eksik belgeleri oluşturur, mevcutları atlar
npm run seed -- --force     # mevcut belgelerin metin alanlarını seed ile günceller
```

- Belge kimlikleri JSON’daki `id` değerleridir (ör. `siskinlik`); tekrar
  çalıştırmak güvenlidir.
- Komut `.env.local` içindeki `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` ve
  `FIREBASE_PRIVATE_KEY_BASE64` / `FIREBASE_PRIVATE_KEY` değerlerini kullanır.
  `--dry-run` kimlik bilgisi olmadan da çalışır; bu durumda mevcut belgeler
  kontrol edilmez.
- `--force` yalnız metin alanlarını ve `updatedAt` değerini değiştirir. Panelden
  yüklenmiş görseller (`imageUrl`, `imagePath`) korunur.
- Seed verisindeki tıbbi metinler gözden geçirilmiş metinlerdir; yayımlanmadan
  önce içerik değişikliklerini yönetim panelinden yapın.

## Veri ve güvenlik

- Public belirti, hizmet ve video okumaları sunucudan yapılır.
- Admin oturumu doğrulanmış Firebase ID token’dan üretilen `HttpOnly` cookie
  kullanır.
- `/gizlilik` sayfası veri sorumlusunu `src/data/bio.json` (hekim) ve
  `src/data/contact.json` dosyalarından alır. Metin bir şablondur; yayımlanmadan
  önce avukat incelemesi gerekir. Sayfa alt bilgiden ve `sitemap.xml`
  üzerinden erişilebilir.
- Consent Mode v2 varsayılanları (`denied`) sunucu HTML’inde dataLayer’a yazılır.
  GTM (`gtm.js`) yalnız ziyaretçi analiz iznini kabul ettikten sonra eklenir;
  reddedilen veya henüz seçilmemiş tercihte GTM betiği hiç istenmez. Tercih alt
  bilgideki “Çerez tercihleri” düğmesiyle değiştirilebilir.
- Admin ekleme, güncelleme ve silme işlemleri server action olarak çalışır.
- Yüklenen görseller maksimum 5 MB kabul edilir, 1600 px içine küçültülür ve
  WebP olarak saklanır.
- Eski `image` alanlarını silmeden `imageUrl` alanına kopyalayan migration:

  ```bash
  npm run migrate:images
  ```

  Migration doğrulandıktan sonra legacy alanların kaldırılması ayrı bir bakım
  adımıdır.

## Kontroller

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Playwright testleri sistemde kurulu Google Chrome’u kullanır. Firebase Admin env
değerleri yoksa public koleksiyonlar boş gösterilir ve admin login entegrasyonu
yerine anonim ve sahte-cookie yönlendirme davranışı test edilir.
`E2E_ADMIN_EMAIL` ile `E2E_ADMIN_PASSWORD` tanımlandığında login, hizmet
ekleme-düzenleme-silme ve logout akışı da geçici bir kayıtla çalıştırılır.

## Production notları

- Hostinger ortamında bütün server-only env değerlerini tanımlayın.
- hCDN bot challenge ayarının Lighthouse ve güvenilir izleme araçlarına `403`
  döndürmediğini doğrulayın.
- Google Ads ve telefon dönüşümü kendi GTM konteyneri içinde tutulmalıdır. Site
  yalnız kullanıcı analiz izni verdikten sonra GTM’yi yükler.
- Yayımdan sonra `/sitemap.xml` ve `/robots.txt` adreslerini kontrol edin;
  eski `*.html` ve `/makaleler` adreslerinin 301/308 ile yönlendiğini doğrulayın.
