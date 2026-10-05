/* Müfredat verisi.
   Yeni modül eklemek ya da "soon" durumundaki bir modülü doldurmak için
   aynı yapıyı izle; status: "ready" olunca modül sayfası tam içerikle açılır. */

window.MODULES = [
  {
    id: "marka-nedir",
    num: 0,
    title: "Marka Nedir?",
    subtitle: "Logodan öte: zihinlerde biriken izlenimler",
    duration: "~30 dk okuma · ~2 saat ödev",
    status: "ready",
    summary: [
      "Marka bir logo, isim ya da renk paleti değildir. Bunlar markanın <em>işaretleridir</em>. Marka, bir ürünün, şirketin ya da kişinin insanların zihninde bıraktığı izlenimlerin, beklentilerin ve duyguların toplamıdır. Jeff Bezos'a atfedilen ifade bunu iyi özetler: <em>\"Markan, sen odada yokken insanların senin hakkında söyledikleridir.\"</em>",
      "<strong>Marka değeri (brand equity)</strong>, bir markanın adı ve işaretleri sayesinde ürüne eklenen (ya da çıkarılan) değerdir. David Aaker bunu dört temel bileşene ayırır: <strong>marka farkındalığı</strong> (biliniyor musun?), <strong>algılanan kalite</strong> (iyi olduğuna inanılıyor mu?), <strong>marka çağrışımları</strong> (akla ne geliyor?) ve <strong>marka sadakati</strong> (tekrar tercih ediliyor mu?).",
      "Kevin Lane Keller'ın <strong>Müşteri Temelli Marka Değeri (CBBE)</strong> modeli bir piramit gibi çalışır. En altta <strong>kimlik/belirginlik</strong> (Kim olduğunu biliyorlar mı?), sonra <strong>anlam</strong> (performans ve imgelem: Ne işe yarıyorsun, neyi temsil ediyorsun?), sonra <strong>tepkiler</strong> (yargılar ve duygular: Seninle ilgili ne düşünüyor, ne hissediyorlar?) ve en tepede <strong>rezonans</strong> (Seninle nasıl bir ilişki kurmak istiyorlar?) gelir. Piramidin üstüne çıkmak, alttaki basamakları sağlam kurmayı gerektirir.",
      "Jean-Noël Kapferer'in <strong>Marka Kimliği Prizması</strong> altı yüzden oluşur: <strong>fizik</strong> (somut özellikler, görünüm), <strong>kişilik</strong> (marka bir insan olsaydı nasıl biri olurdu?), <strong>kültür</strong> (değerler ve köken), <strong>ilişki</strong> (markanın insanlarla kurduğu bağın türü), <strong>yansıma</strong> (markanın tipik kullanıcısının dışarıdan görünen imajı) ve <strong>öz-imaj</strong> (kullanıcının markayı kullanırken kendini nasıl gördüğü). Prizmanın değeri, markayı yalnızca \"ne söylediği\" ile değil, \"kiminle nasıl bir ilişki kurduğu\" ile de düşünmeye zorlamasıdır.",
      "En önemli ayrım şudur: <strong>marka kimliği</strong> senin tasarladığın, olmak istediğin şeydir. <strong>Marka imajı</strong> ise insanların gerçekte algıladığıdır. Marka yönetiminin özü, bu ikisi arasındaki boşluğu tutarlı davranış ve iletişimle kapatmaktır.",
      "Bu kavramların hepsi kişisel marka için de geçerlidir. İş çevrende adın geçtiğinde akla gelen üç kelime senin marka çağrışımlarındır. Sözünü tutup tutmaman algılanan kaliteni belirler. İnsanların seni tekrar tekrar aramaları ise sadakattir."
    ],
    concepts: ["Marka değeri (brand equity)", "Farkındalık", "Algılanan kalite", "Marka çağrışımları", "Sadakat", "CBBE piramidi", "Kimlik prizması", "Kimlik ve imaj"],
    callout: "Kişisel markana uyarlama: Markan, sen odada yokken iş arkadaşlarının, müşterilerinin ve yöneticinin seni nasıl anlattığıdır. Bu modülün ödevinde bunu doğrudan ölçeceksin.",
    topicQuestions: [
      { q: "Logo ile marka arasındaki fark nedir?", a: "Logo markanın görsel bir işaretidir. Marka ise o işaretin insanların zihninde çağırdığı izlenim, beklenti ve duyguların bütünüdür. Logo değişse de marka algısı devam eder; logo aynı kalsa da kötü bir deneyim markayı zedeler." },
      { q: "Aaker'ın marka değerinin dört temel bileşeni nelerdir?", a: "Marka farkındalığı, algılanan kalite, marka çağrışımları ve marka sadakati. (Aaker bunlara patent ve ticari ilişkiler gibi diğer tescilli varlıkları da ekler.)" },
      { q: "Keller'ın piramidinde en üst basamak nedir ve neden ulaşmak zordur?", a: "Rezonans: insanların markayla aktif, sadık ve duygusal bir ilişki kurmasıdır. Zordur çünkü alttaki basamakların (bilinirlik, net bir anlam, olumlu yargı ve duygular) hepsinin sağlam olmasını gerektirir. Kestirmesi yoktur." },
      { q: "Kapferer prizmasında \"yansıma\" ile \"öz-imaj\" arasındaki fark nedir?", a: "Yansıma, markanın tipik kullanıcısının dışarıdan nasıl göründüğüdür (\"bu markayı kullananlar şöyle insanlardır\"). Öz-imaj ise kullanıcının markayı kullanırken içeride kendini nasıl hissettiği ve gördüğüdür (\"bunu kullandığımda kendimi … hissediyorum\")." },
      { q: "Marka kimliği ile marka imajı arasındaki boşluk neden tehlikelidir?", a: "Söylenen ile yaşatılan arasındaki fark güveni aşındırır. İnsanlar vaadi değil deneyimi hatırlar. Boşluk büyüdükçe iletişim inandırıcılığını kaybeder ve her yeni mesaj şüpheyle karşılanır." }
    ],
    resources: {
      tr: [
        { type: "Kitap", title: "Güçlü Markalar Yaratmak", author: "David A. Aaker", note: "MediaCat Kitapları. Marka kimliği ve marka değerinin temel kitabı (Building Strong Brands çevirisi)." },
        { type: "Kitap", title: "Marka Değeri Yönetimi", author: "David A. Aaker", note: "MediaCat Kitapları. Marka değeri kavramının ilk sistematik anlatımı (Managing Brand Equity çevirisi)." },
        { type: "Kitap", title: "Pazarlama Yönetimi", author: "Philip Kotler & Kevin Lane Keller", note: "Beta Yayınları, çev. İbrahim Kırçova. Marka ve marka değeri bölümleri. Başvuru kitabı olarak elinde bulunsun." },
        { type: "Dergi / Site", title: "MediaCat", url: "https://www.mediacat.com", note: "Türkiye'den marka, reklam ve iletişim vakaları." },
        { type: "Dergi / Site", title: "Marketing Türkiye", url: "https://www.marketingturkiye.com.tr", note: "Sektör haberleri, röportajlar, marka analizleri." }
      ],
      en: [
        { type: "Book", title: "Building Strong Brands", author: "David A. Aaker (1996)", note: "Marka kimliği sistemi: ürün, organizasyon, kişi ve sembol olarak marka." },
        { type: "Book", title: "Strategic Brand Management", author: "Kevin Lane Keller", note: "Akademik ama okunaklı. CBBE modelinin tam anlatımı." },
        { type: "Article", title: "Conceptualizing, Measuring, and Managing Customer-Based Brand Equity", author: "Kevin Lane Keller, Journal of Marketing (1993)", url: "https://doi.org/10.1177/002224299305700101", note: "CBBE'nin orijinal makalesi." },
        { type: "Article", title: "The Brand Report Card", author: "Kevin Lane Keller, Harvard Business Review (2000)", url: "https://hbr.org/2000/01/the-brand-report-card", note: "Güçlü markaların 10 özelliği. Kendi markana da uygulayabileceğin bir kontrol listesi." },
        { type: "Book", title: "The New Strategic Brand Management", author: "Jean-Noël Kapferer", note: "Kimlik Prizması'nın kaynağı." }
      ]
    },
    endQuestions: [
      { id: "q1", q: "Sektöründen güçlü bir B2B marka seç (ör. Siemens, ABB, Festo, Schneider Electric). Kapferer prizmasının altı yüzünü bu marka için doldur." },
      { id: "q2", q: "Kendi adını bir marka olarak düşün. Şu anda iş çevrende seninle ilgili hangi 3 çağrışım olduğunu tahmin ediyorsun? Hangi 3 çağrışımın olmasını isterdin?" },
      { id: "q3", q: "Kimliği ile imajı arasında büyük boşluk oluşmuş bir marka örneği ver (Türkiye'den ya da dünyadan). Boşluğun nedeni neydi, sonuçları ne oldu?" },
      { id: "q4", q: "Keller piramidinin dört basamağını kişisel marka için yeniden yaz. Her basamakta senin için \"başarı\" neye benzer?" }
    ],
    assignment: {
      title: "Algı Haritası: Kimliğin ve İmajın",
      goal: "Olmak istediğin marka ile şu anki algı arasındaki boşluğu ölçmek.",
      steps: [
        "Önce kendin yaz: İnsanların seni anlatırken kullanmasını istediğin 3 kelime.",
        "5–7 kişi seç: en az 2 iş arkadaşı, 1–2 müşteri ya da iş ortağı, 1–2 yakın çevre.",
        "Hepsine aynı kısa mesajı gönder: \"Kişisel gelişimim için küçük bir çalışma yapıyorum. Beni iş hayatında 3 kelimeyle anlatır mısın? Bir de beni en çok hangi konuda ararsın?\"",
        "Cevapları benzer anlamlara göre grupla (ör. \"çözüm odaklı\", \"pratik\", \"iş bitirici\" aynı grupta).",
        "İki sütunlu bir tablo yap: <em>İstediğim algı</em> | <em>Mevcut algı</em>. Örtüşenleri, eksik kalanları ve beklemediğin çağrışımları işaretle.",
        "Boşluğu kapatmak için bu ay atabileceğin 2 somut adım yaz."
      ],
      deliverable: "Algı tablosu + 2 aksiyon. Sonuçları Atölye sayfasındaki \"İstenen algı (3 kelime)\" alanına da taşı."
    },
    advice: [
      "Tutarlılık parlaklıktan önce gelir. Her gün biraz, aynı yönde.",
      "Marka, verdiğin sözlerin toplamıdır. Az söz ver, hepsini tut.",
      "Algıyı tahmin etme, sor. İnsanlar düşündüğünden daha cömert geri bildirim verir.",
      "Ödevden çıkan beklenmedik çağrışımlar çoğu zaman en değerli güçlerindir. Onları görmezden gelme."
    ]
  },

  {
    id: "kisisel-marka-konumlandirma",
    num: 1,
    title: "Kişisel Marka ve Konumlandırma",
    subtitle: "Zihinde sahiplenebileceğin tek bir yer bulmak",
    duration: "~35 dk okuma · ~3 saat ödev",
    status: "ready",
    summary: [
      "Kişisel markalama kavramı 1997'de Tom Peters'ın Fast Company'deki <em>\"The Brand Called You\"</em> makalesiyle yaygınlaştı. Peters'ın tezi şuydu: Hangi pozisyonda olursak olalım, her birimiz \"Ben A.Ş.\"nin CEO'suyuz ve en önemli işimiz \"Sen\" adlı markanın baş pazarlamacısı olmak.",
      "<strong>Konumlandırma</strong> kavramını Al Ries ve Jack Trout tanımladı: Konumlandırma ürüne yapılan bir şey değil, <em>potansiyel müşterinin zihnine</em> yapılan bir şeydir. Zihinler aşırı kalabalıktır ve her kategoride yalnızca birkaç isme yer vardır. Bu yüzden üç stratejiden biri gerekir: bir kategoride <strong>ilk</strong> olmak, kendi <strong>kategorini yaratmak</strong> ya da henüz kimsenin <strong>sahiplenmediği</strong> bir pozisyonu almak.",
      "April Dunford, B2B teknoloji dünyası için daha uygulanabilir bir yöntem önerir. Konumlandırmanın 5 bileşeni vardır: <strong>(1) Rekabetçi alternatifler</strong>: Sen olmasan ne yaparlardı? <strong>(2) Benzersiz özellikler</strong>: Alternatiflerde olmayan neyin var? <strong>(3) Değer</strong>: Bu özellikler müşteriye ne kazandırıyor? <strong>(4) Hedef müşteri</strong>: Bu değeri en çok kim önemsiyor? <strong>(5) Pazar kategorisi</strong>: Hangi çerçevede anılmalısın ki değerin hemen anlaşılsın? Sıralama önemlidir: İşe <em>kendinden</em> değil, <em>alternatiflerden</em> başlanır.",
      "Kişisel markada güçlü bir konumlandırma çoğu zaman bir <strong>kesişimden</strong> doğar. Tek bir alanda en iyi olmak zordur. İki ya da üç alanın kesişiminde ilk akla gelen kişi olmak ise mümkündür. Senin için olası bir kesişim: <em>endüstriyel otomasyon</em> × <em>iş geliştirme</em> × <em>marka ve iletişim</em>. Teknik derinliği iş diline çevirebilen insan sayısı azdır.",
      "Kullanışlı bir konumlandırma cümlesi şablonu: <strong>\"[Hedef kitle] için, [kategori] alanında, [benzersiz değer] sağlarım; çünkü [kanıt].\"</strong> Kanıt kısmı kritiktir. Somut başarılar, projeler, sayılar ve üretilmiş içerikler olmadan konumlandırma yalnızca bir slogan olarak kalır.",
      "Kişisel marka \"kendini pazarlama gürültüsü\" değildir. Dorie Clark'ın vurguladığı gibi tanınan bir uzman olmanın yolu <strong>değer üretmek ve bunu görünür kılmaktır</strong>: içerik üretmek, sosyal kanıt biriktirmek ve ağ kurmak. Austin Kleon'un önerisi de aynı yöndedir: Bitmiş işi değil, <em>süreci</em> paylaş. Bu sitenin kendisi de bu fikre dayanıyor."
    ],
    concepts: ["Konumlandırma", "Kategori", "Rekabetçi alternatifler", "Farklılaşma", "Kesişim / niş", "Kanıt noktaları", "Ben A.Ş."],
    callout: "Dikkat: Kişisel markan, şirketteki rolünle çelişmemeli, onu güçlendirmeli. Konumlandırmanı \"işimi iyi yapan ve bunu anlatabilen insan\" ekseninde kurarsan işvereninle de çıkarların örtüşür.",
    topicQuestions: [
      { q: "Ries & Trout'a göre konumlandırma nerede gerçekleşir?", a: "Ürünün kendisinde değil, hedef kitlenin zihninde. Ürünü değiştirmek değil, zihinde onun için ayrılmış yeri belirlemek ve sahiplenmek amaçlanır." },
      { q: "Dunford'un yöntemi neden \"rekabetçi alternatifler\" ile başlar?", a: "Çünkü müşteri seni her zaman bir alternatifle kıyaslar: başka bir uzman, bir danışmanlık firması, kendi ekibi, ya da hiçbir şey yapmamak. Değerin mutlak değil, alternatife göredir. Alternatifi bilmeden farkını tanımlayamazsın." },
      { q: "\"Herkese hitap etmek\" neden zayıf bir konumlandırmadır?", a: "Zihinde sahiplenilebilecek net bir yer yaratmaz. Herkes için olan, kimsenin ilk aklına gelmez. Dar başlamak ezber gibi görünür ama gerçekte daha hızlı hatırlanmayı ve sonradan genişlemeyi sağlar." },
      { q: "Kişisel markada \"kanıt noktası\" neye denir? Bir örnek ver.", a: "Konumlandırmandaki iddiayı destekleyen doğrulanabilir şeylerdir. Örnek: \"X tesisinde otomasyon projesiyle duruş süresini %18 azalttık\" vakası, sektör etkinliğinde yapılmış bir konuşma, düzenli yayımlanan bir analiz serisi, müşteri referansı." },
      { q: "Kesişim stratejisi neden kişisel markada etkilidir?", a: "Tek bir alanda rekabet çok yoğundur. İki ya da üç alanın kesişiminde ise rakip sayısı katlanarak azalır ve \"bu konuda kime sorarız?\" sorusunun cevabı olmak kolaylaşır." }
    ],
    resources: {
      tr: [
        { type: "Kitap", title: "Konumlandırma: Tüketici Zihnini Fethetme Savaşı", author: "Al Ries & Jack Trout", note: "MediaCat, çev. Ebru Kızıldağ. Konumlandırmanın klasik kaynağı, kısa ve keyifli." },
        { type: "Kitap", title: "Mor İnek", author: "Seth Godin", note: "Fark edilir olmak üzerine kısa bir kitap. \"Güvenli\" olan sıradanlığın aslında riskli olduğunu anlatır." },
        { type: "Kitap", title: "Bir Sanatçı Gibi Araklayın", author: "Austin Kleon", note: "Yaratıcı üretim alışkanlıkları. Aynı yazarın Show Your Work! kitabı henüz Türkçeye çevrilmedi; İngilizce kaynaklarda." },
        { type: "Kitap (bölüm)", title: "Pazarlama Yönetimi: Marka Konumlandırma bölümü", author: "Kotler & Keller", note: "Beta Yayınları. Farklılaşma noktaları ve benzerlik noktaları kavramları." }
      ],
      en: [
        { type: "Article", title: "The Brand Called You", author: "Tom Peters, Fast Company (1997)", url: "https://www.fastcompany.com/28905/brand-called-you", note: "Kişisel markalama hareketini başlatan makale." },
        { type: "Book", title: "Obviously Awesome", author: "April Dunford (2019)", url: "https://www.aprildunford.com", note: "B2B ve teknoloji için en pratik konumlandırma kitabı. 5 bileşen yöntemi." },
        { type: "Book", title: "Reinventing You / Stand Out", author: "Dorie Clark", note: "Kariyerde yeniden konumlanma ve tanınan uzman olma üzerine." },
        { type: "Book", title: "Show Your Work!", author: "Austin Kleon (2014)", url: "https://austinkleon.com/show-your-work/", note: "Öğrendiğini herkesin önünde paylaşma (learning in public) felsefesi." },
        { type: "Book", title: "Positioning: The Battle for Your Mind", author: "Al Ries & Jack Trout", note: "Orijinal metin." }
      ]
    },
    endQuestions: [
      { id: "q1", q: "Senin \"rekabetçi alternatiflerin\" kimler? Bir müşteri ya da işveren seninle çalışmasaydı kimi ya da neyi seçerdi?" },
      { id: "q2", q: "Hangi 2–3 alanın kesişiminde benzersizsin? Bu kesişimde Türkiye'de tanıdığın başka kimler var?" },
      { id: "q3", q: "Üç yıl sonra sektörde adın geçtiğinde hangi cümlenin kurulmasını istersin?" },
      { id: "q4", q: "Konumlandırmanı destekleyen bugün elinde olan 3 kanıt noktası ne? Eksik olan ve 6 ay içinde üretmen gereken kanıt ne?" }
    ],
    assignment: {
      title: "Konumlandırma Atölyesi",
      goal: "Kendine ait, test edilmiş bir konumlandırma cümlesi çıkarmak.",
      steps: [
        "Dunford'un 5 bileşenini kendine uyarla ve her biri için madde madde yaz.",
        "Şablonu kullanarak birbirinden farklı <strong>3 konumlandırma cümlesi</strong> yaz (ör. biri teknik ağırlıklı, biri iş sonucu ağırlıklı, biri kesişim ağırlıklı).",
        "Bu 3 cümleyi hedef kitlenden 3 kişiye göster ve sor: \"Hangisi beni en iyi anlatıyor? Hangisi seni ilgilendirir?\"",
        "Geri bildirime göre birini seç ve keskinleştir.",
        "Seçtiğin cümleyi Atölye sayfasındaki \"Konumlandırma cümlesi\" alanına yaz.",
        "LinkedIn başlığını (headline) ve X biyografini bu cümleye göre yeniden yaz (henüz yayınlamadan taslak olarak)."
      ],
      deliverable: "Seçilmiş konumlandırma cümlesi, 3 kanıt noktası, yeni LinkedIn başlığı ve X biyografisi taslağı."
    },
    advice: [
      "Dar başla, sonra genişle. Bir konuda tanınan biri yeni konulara geçebilir; her konuda biraz bilinen biri hiçbir konuda bilinmez.",
      "Konumlandırma bir kez yazılıp unutulmaz. 6 ayda bir gözden geçir.",
      "\"Ne yaptığını\" değil, \"kimin hangi sorununu çözdüğünü\" anlat.",
      "Kanıt biriktirmek bir alışkanlıktır. Her başarıyı, geri bildirimi ve rakamı bir \"kanıt dosyasına\" not et."
    ]
  },

  {
    id: "hedef-kitle-icgoru",
    num: 2,
    title: "Hedef Kitle ve İçgörü",
    subtitle: "Kime konuştuğunu bilmeden iyi konuşamazsın",
    duration: "~35 dk okuma · ~4 saat ödev",
    status: "ready",
    summary: [
      "Her marka iletişimi bir soruyla başlar: <strong>Kime konuşuyoruz?</strong> Kotler'ın klasik çerçevesi <strong>STP</strong>'dir: <strong>Segmentasyon</strong> (pazarı anlamlı gruplara ayırmak), <strong>Hedefleme</strong> (hangi gruplara odaklanacağını seçmek) ve <strong>Konumlandırma</strong> (seçtiğin grubun zihninde yer almak). B2C'de segmentler demografik, psikografik ve davranışsal olarak ayrılır. B2B'de bunlara <strong>firmografik</strong> kriterler eklenir: sektör, şirket büyüklüğü, coğrafya, kişinin rolü ve unvanı.",
      "<strong>İçgörü (insight)</strong> veri değildir. Veri \"ne\" olduğunu söyler, içgörü \"neden\" olduğunu açıklar. İyi bir içgörü, insanların davranışının arkasındaki ve çoğu zaman yüksek sesle söylenmeyen bir gerçeği yakalar. Duyan kişiye \"Evet, aynen öyle!\" dedirtir. Örnek: \"Fabrika müdürleri otomasyona yatırım yapmak ister ama asıl korkuları, ilk ay yaşanacak üretim kaybından kendilerinin sorumlu tutulmasıdır.\"",
      "<strong>Yapılacak İşler (Jobs-to-be-Done, JTBD)</strong> teorisi (Clayton Christensen): İnsanlar ürün satın almaz, hayatlarındaki bir \"işi\" yaptırmak için ürünü \"işe alırlar\". Her işin üç boyutu vardır: <strong>fonksiyonel</strong> (pratik görev), <strong>duygusal</strong> (nasıl hissetmek istiyorlar) ve <strong>sosyal</strong> (başkalarına nasıl görünmek istiyorlar). Senin içeriğini takip eden biri de seni bir iş için \"işe alır\": belki sektördeki gelişmeleri kısa yoldan öğrenmek, belki yöneticisine sunacağı bir fikir bulmak.",
      "B2B'de satın alma kararını tek bir kişi vermez, bir <strong>satın alma komitesi</strong> verir: karar verici, etkileyici, kullanıcı, satın alma birimi ve onaylayıcı. Her birinin kaygısı farklıdır. Teknik müdür güvenilirliğe, finans geri dönüş süresine, kullanıcı kullanım kolaylığına bakar. İş geliştirme deneyimin bu konuda büyük bir avantaj; bu dinamikleri sahada görüyorsun.",
      "İki pratik araç: <strong>Persona</strong>, hedef kitlenin yarı kurgusal, veriye dayalı bir temsilidir. <strong>Empati haritası</strong> (Dave Gray) ise bu kişinin ne <em>düşünüp hissettiğini</em>, ne <em>duyduğunu</em>, ne <em>gördüğünü</em>, ne <em>söyleyip yaptığını</em>, <em>acılarını</em> ve <em>kazanımlarını</em> haritalandırır.",
      "İçgörü toplamanın en büyük tuzağı yanlış soru sormaktır. Rob Fitzpatrick'in <strong>The Mom Test</strong> yaklaşımı: İnsanlara fikrini sorma (\"Bu iyi bir fikir mi?\" sorusuna herkes kibarca evet der). Bunun yerine <strong>geçmişteki somut davranışlarını</strong> sor: \"Bu sorunu en son ne zaman yaşadın? Ne yaptın? Ne kadar zaman ya da para harcadın?\""
    ],
    concepts: ["STP", "Segmentasyon", "Firmografik kriterler", "İçgörü", "Jobs-to-be-Done", "Satın alma komitesi", "Persona", "Empati haritası", "The Mom Test"],
    callout: "Kişisel marka için: Hedef kitlen \"herkes\" değil. Muhtemelen birincil kitlen otomasyon yatırımı düşünen üretim ve operasyon yöneticileri, ikincil kitlen ise iş geliştirme ve teknik satış profesyonelleri. Bu modülde bunu veriyle netleştireceksin.",
    topicQuestions: [
      { q: "Veri ile içgörü arasındaki fark nedir?", a: "Veri gözlemlenen bir gerçektir (\"ziyaretçilerin %60'ı fiyat sayfasında çıkıyor\"). İçgörü bu davranışın altındaki insani nedeni açıklar (\"fiyat görünce yöneticisine nasıl gerekçelendireceğini bilemiyor\"). İçgörü aksiyona dönüştürülebilir; veri tek başına çoğu zaman dönüştürülemez." },
      { q: "JTBD'de bir \"işin\" üç boyutu nelerdir?", a: "Fonksiyonel (yapılması gereken pratik görev), duygusal (kişinin nasıl hissetmek istediği, ör. kontrolde hissetmek) ve sosyal (başkalarına nasıl görünmek istediği, ör. yenilikçi bir yönetici olarak görünmek)." },
      { q: "B2B satın alma süreci neden B2C'den farklı iletişim gerektirir?", a: "Çünkü karar birden fazla kişiye dağılmıştır, risk ve tutar daha yüksektir, süreç daha uzundur ve kişisel kariyer riski de devrededir. İletişimin komitedeki farklı rollerin farklı kaygılarına cevap vermesi gerekir." },
      { q: "Mom Test'e göre \"Bu ürünü alır mısın?\" neden kötü bir sorudur?", a: "Varsayımsal bir soru olduğu için insanlar nazik davranıp \"evet\" der ve bu cevap gerçek davranışı yansıtmaz. Doğru soru geçmiş davranışa bakar: \"Bu sorunu çözmek için şimdiye kadar ne denedin?\"" },
      { q: "Persona ile segment arasındaki fark nedir?", a: "Segment, ortak özelliklere sahip bir grubun istatistiksel tanımıdır. Persona ise o segmenti temsil eden, adı, hedefleri ve kaygıları olan somut bir \"kişi\" anlatısıdır. Ekibin ve senin empati kurmanı kolaylaştırır." }
    ],
    resources: {
      tr: [
        { type: "Kitap (bölüm)", title: "Pazarlama Yönetimi: Pazar Bölümleri ve Hedef Pazarlar bölümü", author: "Kotler & Keller", note: "Beta Yayınları. STP'nin temel anlatımı, B2B segmentasyon dahil." },
        { type: "Araç", title: "Google Trends (Türkiye)", url: "https://trends.google.com/trends/explore?geo=TR", note: "Hedef kitlenin neyi aradığını ve ilginin zaman içinde nasıl değiştiğini gör." },
        { type: "Veri", title: "TÜİK Veri Portalı", url: "https://data.tuik.gov.tr", note: "Sanayi, istihdam ve sektör verileri. B2B kitleni büyüklük olarak anlamak için." },
        { type: "Site", title: "Pazarlamasyon", url: "https://www.pazarlamasyon.com", note: "Türkçe tüketici içgörüsü ve pazarlama vaka yazıları." }
      ],
      en: [
        { type: "Book", title: "Competing Against Luck", author: "Clayton M. Christensen ve ark. (2016)", note: "Jobs-to-be-Done teorisinin ana kitabı." },
        { type: "Article", title: "Know Your Customers' \"Jobs to Be Done\"", author: "Christensen, Hall, Dillon, Duncan, Harvard Business Review (2016)", url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done", note: "Kitabın 10 dakikalık özeti." },
        { type: "Book", title: "The Mom Test", author: "Rob Fitzpatrick", url: "https://www.momtestbook.com", note: "Doğru müşteri görüşmesi nasıl yapılır? Kısa, çok pratik bir kitap." },
        { type: "Book", title: "Demand-Side Sales 101", author: "Bob Moesta", note: "JTBD'nin satış ve iş geliştirmeye uygulanışı. Doğrudan senin alanın." },
        { type: "Tool", title: "Empathy Map Canvas", author: "Dave Gray (XPLANE)", note: "Empati haritasının güncel versiyonu. İsimle arandığında şablon kolayca bulunur." }
      ]
    },
    endQuestions: [
      { id: "q1", q: "İçeriklerinin birincil hedef kitlesini tanımla: unvan, sektör, şirket büyüklüğü, kariyer aşaması." },
      { id: "q2", q: "Bu kişi seni takip ederek hangi \"işi\" yaptırmak istiyor? Fonksiyonel, duygusal ve sosyal boyutlarıyla yaz." },
      { id: "q3", q: "Sahada gözlemlediğin, hedef kitlenin yüksek sesle söylemediği 3 gerçek (içgörü adayı) nedir?" },
      { id: "q4", q: "Bir otomasyon yatırımındaki satın alma komitesinin her üyesi için tek cümlelik bir mesaj yaz." }
    ],
    assignment: {
      title: "İçgörü Avı",
      goal: "Varsayımlarını gerçek konuşmalarla test etmek ve içerik motoru için bir fikir havuzu oluşturmak.",
      steps: [
        "2 persona oluştur: birincil (ör. otomasyon yatırımı düşünen üretim müdürü) ve ikincil (ör. teknik satış / iş geliştirme profesyoneli).",
        "Her persona için bir empati haritası çiz (düşünür/hisseder, duyar, görür, söyler/yapar, acılar, kazanımlar).",
        "Bu personalara uyan 3 gerçek kişiyle 15–20 dakikalık görüşme yap. Mom Test kurallarına uy: fikir değil, geçmiş davranış sor.",
        "Görüşme notlarından en az <strong>5 içgörü cümlesi</strong> çıkar (\"[Kişi] … ister ama … çünkü …\" formatında).",
        "Her içgörüden 1 içerik fikri türet. Bunlar içerik motorunun ilk fikir havuzu olacak.",
        "Müşteri adı, firma adı ya da gizli bilgi içeren her şeyi anonimleştir."
      ],
      deliverable: "2 persona + 2 empati haritası + 5 içgörü + 5 içerik fikri."
    },
    advice: [
      "Varsayımı gerçek gibi ele alma. Her persona bir hipotezdir, konuşmalarla test edilir.",
      "Haftada en az bir gerçek kitle konuşması yap. İş geliştirme görüşmelerin zaten bir içgörü madeni.",
      "LinkedIn yorumları, sektör forumları ve fuar sohbetleri, anketlerden daha dürüst içgörü verir.",
      "Dinlerken çözüm satmaya çalışma. Önce anla, sonra konuş."
    ]
  },

  /* ---------- Sıradaki modüller (içerik hazırlanacak) ---------- */
  {
    id: "kimlik-hikaye",
    num: 3,
    title: "Marka Kimliği ve Hikâye Anlatımı",
    subtitle: "Ses tonu, arketipler ve anlatı yapısı",
    status: "soon",
    concepts: ["StoryBrand çerçevesi", "Marka arketipleri", "Ses tonu", "Kahramanın yolculuğu", "Görsel kimlik"],
    preview: "Markanın nasıl konuştuğu, hangi hikâyeyi anlattığı ve müşteriyi neden \"kahraman\" yapması gerektiği."
  },
  {
    id: "stratejik-reklam",
    num: 4,
    title: "Stratejik Reklam",
    subtitle: "Markalar gerçekte nasıl büyür?",
    status: "soon",
    concepts: ["Zihinsel ve fiziksel erişilebilirlik", "Ayırt edici varlıklar", "Uzun ve kısa vade dengesi (Binet & Field)", "Yaratıcı brief", "Medya planlama"],
    preview: "Byron Sharp'ın kanıta dayalı pazarlaması, Binet & Field'ın marka ve aktivasyon dengesi, iyi bir yaratıcı brief'in anatomisi."
  },
  {
    id: "metin-yazarligi-ikna",
    num: 5,
    title: "Metin Yazarlığı ve İkna",
    subtitle: "Okunan, hatırlanan ve harekete geçiren metin",
    status: "soon",
    concepts: ["Cialdini'nin ikna ilkeleri", "AIDA / PAS", "Başlık yazımı", "Ogilvy ilkeleri", "Kanca (hook)"],
    preview: "İknanın psikolojisi ve sosyal medyada ilk iki saniyede dikkati yakalayan metin."
  },
  {
    id: "halkla-iliskiler",
    num: 6,
    title: "Halkla İlişkiler (PR)",
    subtitle: "Kazanılmış medya ve güven inşası",
    status: "soon",
    concepts: ["Grunig'in 4 PR modeli", "Paydaş haritası", "Basın bülteni", "Medya ilişkileri", "Düşünce liderliği"],
    preview: "PR'ın reklamdan farkı, gazetecilerle çalışma ve bir basın bülteninin yapısı."
  },
  {
    id: "itibar-kriz",
    num: 7,
    title: "İtibar ve Kriz Yönetimi",
    subtitle: "Güven yıllarda kazanılır, saatlerde kaybedilir",
    status: "soon",
    concepts: ["SCCT (Coombs)", "Kriz türleri", "Özür anatomisi", "Sosyal medya krizi", "Ön hazırlık planı"],
    preview: "Kriz anında ne söylenir, ne söylenmez? Kişisel markada kriz senaryoları."
  },
  {
    id: "icerik-sosyal-medya",
    num: 8,
    title: "İçerik Stratejisi ve Sosyal Medya",
    subtitle: "Sürdürülebilir bir içerik sistemi",
    status: "soon",
    concepts: ["İçerik sütunları", "Platform dinamikleri", "Hub & spoke", "Yeniden kullanım (repurposing)", "Yayın takvimi"],
    preview: "X ve LinkedIn için içerik mimarisi. İçerik motoru bu modülün üzerine kurulacak."
  },
  {
    id: "b2b-teknoloji-pazarlama",
    num: 9,
    title: "B2B ve Teknoloji Pazarlaması",
    subtitle: "Uzun satış döngüsünde marka",
    status: "soon",
    concepts: ["95-5 kuralı", "Düşünce liderliği", "Account-based marketing", "Vaka çalışması yazımı", "Teknik içeriği sadeleştirme"],
    preview: "Alıcıların %95'i bugün pazarda değil. Onlar hazır olduğunda akla ilk gelen sen ol."
  },
  {
    id: "olcumleme",
    num: 10,
    title: "Ölçümleme ve Analitik",
    subtitle: "Neyin işe yaradığını bilmek",
    status: "soon",
    concepts: ["KPI seçimi", "Marka bilinirliği ölçümü", "Etkileşim ve erişim", "Kitle kalitesi", "Deney tasarımı"],
    preview: "Gösteriş metrikleri ile gerçek etkiyi ayırmak. Kendi içerik paneline hangi metrikler girmeli?"
  },
  {
    id: "etik-hukuk",
    num: 11,
    title: "Etik ve Hukuk",
    subtitle: "Güvenilir kalmanın kuralları",
    status: "soon",
    concepts: ["KVKK", "Reklam Kurulu", "Etkileyici reklam kılavuzu", "Telif ve görsel kullanımı", "Yapay zekâ ile üretilmiş içerik"],
    preview: "Türkiye'de reklam ve sosyal medya mevzuatı. İşveren gizliliği ve yapay zekâ içeriğinde şeffaflık."
  }
];

window.GENERAL_ADVICE = [
  {
    title: "Karakter: Marka güvenin üzerine kurulur",
    items: [
      "Sözünü tut. Küçük sözler de sayılır: \"yarın dönerim\" dediysen yarın dön.",
      "Bilgini cömertçe paylaş. Uzmanlık, saklandıkça değil paylaşıldıkça büyür.",
      "Bilmediğini \"bilmiyorum, araştırıp döneceğim\" diye söyleyebilmek güven inşa eder.",
      "Başkalarının başarısını görünür kıl: iş arkadaşlarını ve müşterilerini etiketle, onları öne çıkar.",
      "Eleştiriye savunmayla değil merakla yaklaş."
    ]
  },
  {
    title: "Ustalık: İçerik ancak derinlik kadar iyidir",
    items: [
      "Her hafta bir \"derin çalışma\" bloğu ayır: okuma, not alma, sentez.",
      "Okuduğunu kendi cümlelerinle yaz. Yazamadığını anlamamışsındır.",
      "Sahadaki deneyimin en değerli hammaddedir. Her görüşmeden bir ders not et (anonim).",
      "Tek bir konuda ayda bir \"uzun form\" içerik (makale, vaka analizi) üret."
    ]
  },
  {
    title: "Görünürlük: Sessiz uzman fark edilmez",
    items: [
      "Ritim sıklıktan önemlidir. Haftada 3 iyi paylaşım, günde 3 vasat paylaşımdan iyidir.",
      "Paylaşmaktan çok yorum yap: Sektördeki iyi paylaşımlara değer katan yorumlar, ağını en hızlı büyüten yoldur.",
      "Yılda en az 2 kez canlı görünür ol: etkinlik konuşması, panel, webinar ya da podcast konukluğu.",
      "Platforma değil, kendi kitlene yatırım yap. İleride bir e-posta bülteni düşün."
    ]
  },
  {
    title: "Sınırlar: Uzun vadede korunman gerekenler",
    items: [
      "İşvereninin sosyal medya ve gizlilik politikasını oku. Müşteri ve proje adlarını izinsiz kullanma.",
      "Siyasi ve kutuplaştırıcı tartışmalardan uzak durmak bir tercihtir. Bilinçli ver.",
      "Yapay zekâya yazdırılmış içeriği okumadan ve düzeltmeden asla yayınlama.",
      "Sayılara hayır diyebil: takipçi sayısı için markanın değerlerinden ödün verme."
    ]
  },
  {
    title: "Ritim: Haftalık sistem",
    items: [
      "Pazartesi: Haftanın öğrenme konusu (müfredattan bir alt başlık).",
      "Salı–Perşembe: İçerik motorundan gelen taslakları onayla ve düzenle.",
      "Cuma: Haftanın metriklerine bak, 1 ders çıkar.",
      "Ayda bir: Kişisel marka denetimi (profiller, tutarlılık, konumlandırma).",
      "Çeyrekte bir: Algı haritası ödevini tekrarla ve farkı ölç."
    ]
  }
];
