# Marka Laboratuvarı

Markalaşma, stratejik reklam ve PR üzerine kişisel bir öğrenme, uygulama ve içerik üretim sistemi.

**Döngü:** Öğren → Uygula → Üret → Yayınla → Ölç

Site: https://mhmmdemngly.github.io/PersonalBranding/

## Yapı

```
index.html                    Tek sayfa uygulama (derleme gerektirmez)
assets/css/style.css          Stiller (açık/koyu tema)
assets/js/app.js              Sayfalar, yönlendirme, yerel kayıt
assets/js/data/modules.js     Müfredat içeriği ve genel tavsiyeler
assets/js/panel.js            İçerik motoru onay paneli (#/panel)
assets/js/config.js           Panelin Supabase ayarları (herkese açık değerler)
engine/generate.py            Gemini (ya da Claude) ile taslak üretir, Supabase'e yazar, e-posta gönderir
engine/publish.py             Onaylı ve zamanı gelen taslakları X'te paylaşır
supabase/schema.sql           Veritabanı tabloları ve güvenlik kuralları
.github/workflows/            Zamanlanmış GitHub Actions iş akışları
```

## İçerik motoru akışı

1. **Taslak üret** iş akışı (Pzt/Çar/Cum 09:00 ya da elle): marka profili ve fikir havuzu okunur, Claude Türkçe ve İngilizce taslaklar üretir, taslaklar Supabase'e yazılır ve e-postana gelir.
2. Sen sitedeki **Panel**'den taslağı düzenler, dili ve zamanı seçip onaylarsın.
3. **Onaylıları yayınla** iş akışı (30 dakikada bir): zamanı gelen onaylı gönderileri X'te paylaşır. X anahtarları yoksa bu adım atlanır.

## Kurulum

### 1. GitHub Pages
Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, klasör `/ (root)` → Save.

### 2. Supabase
1. Yeni proje oluştur. Authentication → Users → Add user ile kendi e-postanı ekle (Auto Confirm).
2. SQL Editor → `supabase/schema.sql` içeriğini yapıştır → Run.
3. Authentication → URL Configuration:
   - Site URL: `https://mhmmdemngly.github.io/PersonalBranding/`
   - Redirect URLs: `https://mhmmdemngly.github.io/PersonalBranding/**`
4. Project Settings → API'den **Project URL** ve **anon (publishable) key** değerlerini `assets/js/config.js` dosyasına yaz.
5. Panele ilk girişini yaptıktan sonra Authentication → Sign In / Providers → **Allow new users to sign up** seçeneğini kapat.

### 3. Gmail uygulama şifresi
Google Hesabı → Güvenlik → 2 Adımlı Doğrulama'yı aç → "Uygulama şifreleri" → yeni şifre oluştur (16 karakter).

### 4. GitHub Secrets
Settings → Secrets and variables → Actions → **New repository secret**:

| Ad | Değer |
|---|---|
| `GEMINI_API_KEY` | aistudio.google.com → Get API key (ücretsiz katman) |
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → **service_role / secret** key |
| `GMAIL_USER` | Gönderen Gmail adresi |
| `GMAIL_APP_PASSWORD` | 3. adımdaki uygulama şifresi |
| `NOTIFY_EMAIL` | Taslakların gideceği adres |
| `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET` | (Sonra) developer.x.com → uygulamanın Read and Write anahtarları |

İsteğe bağlı **Variables** sekmesi: `PANEL_URL`, `DRAFT_COUNT` (varsayılan 5).

### Yapay zekâ sağlayıcısını değiştirmek
Varsayılan Gemini. Claude için: Secrets → `ANTHROPIC_API_KEY` ekle, Variables → `LLM_PROVIDER` = `claude` ekle. Kodda değişiklik gerekmez.
Model adları Variables ile değiştirilebilir: `GEMINI_MODEL`, `CLAUDE_MODEL`.

### 5. İlk çalıştırma
Panel'de **Marka profili** sekmesini doldur → birkaç fikir ekle → Actions → **Taslak üret** → Run workflow.

## Güvenlik notları
- `service_role` anahtarı yalnızca GitHub Secrets'ta durur. Koda ya da `config.js`'e asla yazılmaz.
- Panel verisini Supabase satır düzeyi güvenlik kuralları korur: yalnızca sahibin e-postasıyla giriş yapan kullanıcı veriyi görebilir.
- Müfredattaki cevaplar ve ödev notları sadece tarayıcının yerel deposundadır, GitHub'a gitmez.
- GitHub, 60 gün boyunca hiç commit almayan herkese açık repolarda zamanlanmış iş akışlarını durdurur. Durursa Actions sekmesinden tekrar etkinleştir.
