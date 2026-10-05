/* Yol haritası: fazlar, görevler ve müfredat üniteleri.
   Görev id'lerini değiştirme; işaretlenen görevler bu id'lerle tarayıcıda saklanır. */

window.PHASES = [
  {
    id: 0,
    slug: "temel",
    title: "Temel ve Konumlandırma",
    short: "Kim olduğunu, kime konuştuğunu ve ne vaat ettiğini netleştir.",
    duration: "2–3 hafta",
    why: "İçerik motoru, senin marka profilin kadar iyi çalışır. Konumlandırması belirsiz biri ne kadar çok paylaşım yaparsa yapsın akılda kalmaz. Bu faz, sonraki her şeyin temelidir.",
    modules: [0, 1, 2],
    groups: [
      {
        title: "Marka nedir? (Modül 0)",
        tasks: [
          { id: "f0-m0-oku", text: "Modül 0'ı oku ve konu sorularını çöz", link: "#/modul/marka-nedir" },
          { id: "f0-algi-mesaj", text: "Algı Haritası: 5–7 kişiye \"Beni 3 kelimeyle anlatır mısın?\" mesajını gönder", detail: "En az 2 iş arkadaşı, 1–2 müşteri/iş ortağı, 1–2 yakın çevre." },
          { id: "f0-algi-tablo", text: "Gelen cevaplarla \"İstediğim algı / Mevcut algı\" tablosunu çıkar" }
        ]
      },
      {
        title: "Konumlandırma (Modül 1)",
        tasks: [
          { id: "f0-m1-oku", text: "Modül 1'i oku ve bölüm sonu sorularını cevapla", link: "#/modul/kisisel-marka-konumlandirma" },
          { id: "f0-3cumle", text: "Birbirinden farklı 3 konumlandırma cümlesi yaz" },
          { id: "f0-test", text: "Cümleleri hedef kitlenden 3 kişiye test ettir ve birini seç" },
          { id: "f0-kanit", text: "Elindeki 3 kanıt noktasını ve eksik olanı yaz" }
        ]
      },
      {
        title: "Hedef kitle (Modül 2)",
        tasks: [
          { id: "f0-m2-oku", text: "Modül 2'yi oku", link: "#/modul/hedef-kitle-icgoru" },
          { id: "f0-persona", text: "2 persona ve empati haritası oluştur" },
          { id: "f0-gorusme", text: "3 kişiyle 15–20 dakikalık içgörü görüşmesi yap (Mom Test kurallarıyla)" },
          { id: "f0-icgoru", text: "Görüşmelerden 5 içgörü ve 5 içerik fikri çıkar" }
        ]
      },
      {
        title: "Marka profilini tamamla",
        tasks: [
          { id: "f0-atolye-kimlik", text: "Atölye → Kimlik bölümünü doldur", link: "#/atolye" },
          { id: "f0-atolye-kitle", text: "Atölye → Kitle bölümünü doldur", link: "#/atolye" },
          { id: "f0-atolye-ses", text: "Atölye → Ses ve içerik bölümünü doldur", link: "#/atolye" },
          { id: "f0-politika", text: "İşvereninin sosyal medya ve gizlilik politikasını oku, kırmızı çizgilerini yaz" },
          { id: "f0-profil", text: "LinkedIn başlığını ve X biyografini yeni konumlandırmana göre güncelle" }
        ]
      }
    ],
    outputs: ["Marka profili (Atölye)", "Algı tablosu", "2 persona", "Test edilmiş konumlandırma cümlesi", "İlk 5 içerik fikri"],
    doneWhen: "Atölye'deki tüm alanlar dolu ve konumlandırma cümlen en az 3 kişi tarafından test edildi."
  },
  {
    id: 1,
    slug: "altyapi",
    title: "Altyapı ve Öğrenme Düzeni",
    short: "Siteyi günlük hayatına yerleştir ve öğrenme ritmini kur.",
    duration: "1 hafta",
    why: "Sistem ancak kullanıldığında işe yarar. Bu fazda siteyi elinin altına alır, öğrenmeye takvimde sabit bir yer açarsın.",
    modules: [],
    groups: [
      {
        title: "Site",
        tasks: [
          { id: "f1-site", text: "Siteyi telefonunda aç ve ana ekrana ekle", detail: "Tarayıcı menüsü → \"Ana ekrana ekle\"." },
          { id: "f1-yedek", text: "Atölye'den ilk yedeğini al (.json) ve güvenli bir klasöre koy", link: "#/atolye" }
        ]
      },
      {
        title: "Ritim",
        tasks: [
          { id: "f1-takvim", text: "Takvimine haftalık 2 saatlik sabit bir öğrenme bloğu koy" },
          { id: "f1-kitap", text: "Kaynak listelerinden ilk kitabını seç ve edin", link: "#/ogren" },
          { id: "f1-not", text: "Sahadan gözlemleri not alacağın tek bir yer belirle (telefon notu yeterli)" }
        ]
      }
    ],
    outputs: ["Telefonda erişilebilir site", "Takvimde haftalık öğrenme bloğu", "Not alma alışkanlığı"],
    doneWhen: "İki hafta üst üste öğrenme bloğunu kaçırmadın."
  },
  {
    id: 2,
    slug: "icerik-motoru",
    title: "İçerik Motoru Kurulumu",
    short: "Taslakların otomatik üretilip sana gelmesini sağla.",
    duration: "1–2 hafta",
    why: "Fikirlerini düzenli içeriğe dönüştürmenin mekanik kısmını otomasyona bırakırsın. Sen sadece düşünür, düzenler ve onaylarsın.",
    modules: [],
    groups: [
      {
        title: "Supabase (veritabanı ve giriş)",
        tasks: [
          { id: "f2-sb-sema", text: "SQL Editor'de supabase/schema.sql dosyasını çalıştır" },
          { id: "f2-sb-url", text: "Authentication → URL Configuration: Site URL ve Redirect URL'leri gir" },
          { id: "f2-sb-user", text: "Authentication → Users → Add user → Create new user ile kendi e-postanı ekle", detail: "\"Auto Confirm User\" seçeneğini işaretle. Yeni kayıtlar kapalı olduğu için panelde hesap ancak böyle açılır." },
          { id: "f2-sb-signup", text: "Yeni kayıtları kapat (Allow new users to sign up)" },
          { id: "f2-panel-giris", text: "Panele ilk girişini yap", link: "#/panel" }
        ]
      },
      {
        title: "Yapay zekâ (Gemini)",
        tasks: [
          { id: "f2-gemini-key", text: "aistudio.google.com → Get API key ile ücretsiz Gemini anahtarı al" },
          { id: "f2-sec-gemini", text: "GitHub Secret ekle: GEMINI_API_KEY" },
          { id: "f2-sec-sburl", text: "GitHub Secret ekle: SUPABASE_URL" },
          { id: "f2-sec-sbkey", text: "GitHub Secret ekle: SUPABASE_SERVICE_KEY (sb_secret_… anahtarı)" }
        ]
      },
      {
        title: "İlk çalıştırma",
        tasks: [
          { id: "f2-profil", text: "Panel → Marka profili → Atölye'den doldur → Kaydet", link: "#/panel" },
          { id: "f2-fikir", text: "Panel → Fikir havuzuna en az 5 fikir ekle", link: "#/panel" },
          { id: "f2-run", text: "GitHub → Actions → Taslak üret → Run workflow" },
          { id: "f2-onay", text: "Panelde ilk taslakları düzenle ve onayla", link: "#/panel" }
        ]
      },
      {
        title: "E-posta bildirimi (sıradaki)",
        tasks: [
          { id: "f2-gmail-2fa", text: "Gmail hesabında 2 Adımlı Doğrulama'yı aç" },
          { id: "f2-gmail-app", text: "Google Hesabı → Güvenlik → Uygulama şifreleri → yeni şifre oluştur" },
          { id: "f2-sec-gmail", text: "GitHub Secrets ekle: GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFY_EMAIL" },
          { id: "f2-mail-test", text: "Taslak üret'i tekrar çalıştır ve e-postanın geldiğini doğrula" }
        ]
      }
    ],
    outputs: ["Çalışan panel", "Otomatik taslak üretimi (Pzt/Çar/Cum 09:00)", "E-posta bildirimi"],
    doneWhen: "İlk taslaklar e-postana geldi ve en az birini panelden onayladın."
  },
  {
    id: 3,
    slug: "ritim",
    title: "İçerik Ritmi ve Derinleşme",
    short: "Düzenli paylaş, müfredatta ilerle, X'i otomatik yayına bağla.",
    duration: "8–12 hafta",
    why: "Kişisel marka bileşik faiz gibi büyür: tek tek paylaşımlar değil, aylarca süren tutarlılık fark yaratır.",
    modules: [3, 4, 5, 6, 7],
    groups: [
      {
        title: "Haftalık ritim",
        tasks: [
          { id: "f3-haftalik", text: "Haftada en az 3 taslağı onayla ve paylaş" },
          { id: "f3-yeniden", text: "Her hafta en az 1 taslağı tamamen kendi cümlelerinle yeniden yaz" },
          { id: "f3-yorum", text: "Sektördeki paylaşımlara haftada 5 değer katan yorum yap" },
          { id: "f3-fikir", text: "Her hafta fikir havuzuna en az 3 sahadan gözlem ekle" }
        ]
      },
      {
        title: "Derinleşme",
        tasks: [
          { id: "f3-uzun", text: "Ayda bir uzun içerik yaz (LinkedIn makalesi ya da vaka analizi)" },
          { id: "f3-moduller", text: "Modül 3–7 yayınlandıkça oku ve ödevlerini yap", link: "#/ogren" }
        ]
      },
      {
        title: "Otomatik yayın",
        tasks: [
          { id: "f3-x-hesap", text: "developer.x.com'da geliştirici hesabı aç ve güncel fiyatları kontrol et" },
          { id: "f3-x-key", text: "X anahtarlarını GitHub Secrets'a ekle (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET)" },
          { id: "f3-x-test", text: "Onaylı bir gönderinin zamanında otomatik paylaşıldığını doğrula" }
        ]
      }
    ],
    outputs: ["8+ haftalık kesintisiz paylaşım", "En az 2 uzun içerik", "Otomatik X yayını"],
    doneWhen: "8 hafta boyunca her hafta en az 3 paylaşım yaptın."
  },
  {
    id: 4,
    slug: "olcum",
    title: "Ölçüm ve Ölçek",
    short: "Neyin işe yaradığını ölç, LinkedIn'e ve sahneye taşı.",
    duration: "Sürekli",
    why: "Ölçmeden büyüyemezsin. Bu fazda veriye göre konu seçer, markanı yeni kanallara taşırsın.",
    modules: [8, 9, 10, 11],
    groups: [
      {
        title: "Ölçüm",
        tasks: [
          { id: "f4-metrik", text: "Takip edeceğin 3 metriği seç (ör. profil ziyareti, yeni bağlantı, gelen mesaj)" },
          { id: "f4-algi", text: "Algı Haritası ödevini tekrarla ve ilk sonuçla karşılaştır" },
          { id: "f4-denetim", text: "Çeyreklik marka denetimi: profiller, tutarlılık, konumlandırma" }
        ]
      },
      {
        title: "Ölçek",
        tasks: [
          { id: "f4-linkedin", text: "İçerik motoruna LinkedIn'i ekle" },
          { id: "f4-sahne", text: "Bir etkinlik, panel ya da webinar konuşmasına başvur" },
          { id: "f4-bulten", text: "E-posta bülteni açıp açmamaya karar ver" }
        ]
      }
    ],
    outputs: ["Metrik paneli", "Karşılaştırmalı algı raporu", "Yeni kanal ve sahne deneyimi"],
    doneWhen: "Bu faz bitmez; her çeyrek yeniden döner."
  }
];

window.UNITS = [
  { title: "Temeller", text: "Marka nedir, nasıl konumlanır, kime konuşur?", modules: [0, 1, 2] },
  { title: "Mesaj ve yaratıcılık", text: "Hikâye, reklam stratejisi ve ikna eden metin.", modules: [3, 4, 5] },
  { title: "İtibar ve PR", text: "Kazanılmış medya, güven ve kriz yönetimi.", modules: [6, 7] },
  { title: "Dağıtım ve ölçüm", text: "İçerik sistemi, B2B pazarlama, ölçüm ve etik.", modules: [8, 9, 10, 11] }
];
