(function () {
  "use strict";

  const MODULES = window.MODULES || [];
  const ADVICE = window.GENERAL_ADVICE || [];
  const STORE_KEY = "markalab:v1";
  const app = document.getElementById("app");

  /* ---------------- Depolama ---------------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      return { progress: data.progress || {}, workshop: data.workshop || {} };
    } catch (e) {
      return { progress: {}, workshop: {} };
    }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); return true; }
    catch (e) { return false; }
  }
  function modState(id) {
    if (!state.progress[id]) state.progress[id] = { done: false, answers: {}, assignment: "" };
    return state.progress[id];
  }

  /* ---------------- Yardımcılar ---------------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ready = MODULES.filter((m) => m.status === "ready");
  const doneCount = () => MODULES.filter((m) => state.progress[m.id] && state.progress[m.id].done).length;

  function download(filename, text, type) {
    const blob = new Blob([text], { type: type || "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function flashSaved(el) {
    if (!el) return;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 1200);
  }

  // data-bind="progress.<modId>.answers.<qid>" ya da "workshop.<key>" alanlarını depoya bağlar
  function bindInputs(root) {
    root.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.dataset.bind.split(".");
      el.value = getPath(path) || "";
      el.addEventListener("input", () => {
        setPath(path, el.value);
        save();
        flashSaved(el.closest(".field") && el.closest(".field").querySelector(".saved"));
      });
    });
  }
  function getPath(path) {
    let o = state;
    for (const k of path) { if (o == null) return undefined; o = o[k]; }
    return o;
  }
  function setPath(path, value) {
    if (path[0] === "progress") modState(path[1]);
    let o = state;
    for (let i = 0; i < path.length - 1; i++) {
      if (o[path[i]] == null) o[path[i]] = {};
      o = o[path[i]];
    }
    o[path[path.length - 1]] = value;
  }

  /* ---------------- Sayfalar ---------------- */
  const ROADMAP = [
    { phase: "Faz 0", title: "Konumlandırma", text: "Kim olduğun, kime konuştuğun, ne vaat ettiğin. Atölye sayfasındaki marka profilini doldur.", status: "Şimdi" },
    { phase: "Faz 1", title: "Site ve ilk modüller", text: "Bu site ve ilk 3 modül (Marka, Konumlandırma, Hedef Kitle).", status: "Hazır" },
    { phase: "Faz 2", title: "İçerik motoru v1", text: "Yapay zekâ taslak üretir, e-postana gelir, Panel'den onaylarsın, X'te zamanlanmış paylaşım yapılır.", status: "Şimdi" },
    { phase: "Faz 3", title: "Kalan modüller ve ölçüm", text: "Reklam, PR, kriz, içerik, B2B, ölçümleme ve etik modülleri. Metrik paneli.", status: "Planlı" },
    { phase: "Faz 4", title: "Döngüyü kapatmak", text: "Metrikler, hangi konuları öğrenip neyi yazacağını yönlendirir. LinkedIn eklenir.", status: "Planlı" }
  ];

  function pageHome() {
    const pct = Math.round((doneCount() / MODULES.length) * 100);
    const next = MODULES.find((m) => m.status === "ready" && !(state.progress[m.id] && state.progress[m.id].done));
    return `
      <section class="hero">
        <span class="eyebrow">Kişisel marka sistemi</span>
        <h1>Öğren, uygula, üret.<br>Markanı adım adım kur.</h1>
        <p class="lead">Markalaşma, stratejik reklam ve PR üzerine yapılandırılmış bir müfredat, gerçek çıktılar üreten ödevler ve öğrendiklerini içeriğe dönüştüren bir otomasyon sistemi.</p>
        <div class="loop" aria-label="Sistem döngüsü">
          <span class="step">Öğren</span><span class="arrow">→</span>
          <span class="step">Uygula</span><span class="arrow">→</span>
          <span class="step">Üret</span><span class="arrow">→</span>
          <span class="step">Yayınla</span><span class="arrow">→</span>
          <span class="step">Ölç</span><span class="arrow">↺</span>
        </div>
      </section>

      <div class="grid grid-2">
        <div class="card">
          <h3>İlerleme</h3>
          <p class="muted">${doneCount()} / ${MODULES.length} modül tamamlandı · ${ready.length} modül yayında</p>
          <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>
          <div class="btn-row">
            ${next ? `<a class="btn" href="#/modul/${next.id}">Devam et: ${esc(next.title)}</a>` : `<a class="btn" href="#/mufredat">Müfredata git</a>`}
          </div>
        </div>
        <div class="card">
          <h3>Önce Faz 0</h3>
          <p class="muted">İçerik motorunun \"beyni\" senin marka profilin olacak: konumlandırma, kitle, ses tonu ve içerik sütunları. Modülleri okurken Atölye'yi doldur.</p>
          <div class="btn-row"><a class="btn secondary" href="#/atolye">Atölyeyi aç</a></div>
        </div>
      </div>

      <h2>Yol haritası</h2>
      <ol class="roadmap">
        ${ROADMAP.map((r) => `
          <li class="card">
            <span class="phase">${r.phase}</span>
            <div>
              <div class="card-meta"><strong>${r.title}</strong>
                <span class="badge ${r.status === "Hazır" ? "ok" : r.status === "Şimdi" ? "accent" : ""}">${r.status}</span></div>
              <p class="muted">${r.text}</p>
            </div>
          </li>`).join("")}
      </ol>`;
  }

  function moduleCard(m) {
    const ms = state.progress[m.id];
    const done = ms && ms.done;
    const isReady = m.status === "ready";
    const badge = done ? `<span class="badge ok">Tamamlandı</span>`
      : isReady ? `<span class="badge accent">Yayında</span>` : `<span class="badge">Yakında</span>`;
    const inner = `
      <div class="card-meta"><span class="module-num">${String(m.num).padStart(2, "0")}</span></div>
      <h3>${esc(m.title)}</h3>
      <p class="muted">${esc(m.subtitle)}</p>
      <div class="card-meta">${badge}${m.duration ? `<span class="badge">${esc(m.duration)}</span>` : ""}</div>`;
    return isReady
      ? `<a class="card" href="#/modul/${m.id}">${inner}</a>`
      : `<a class="card locked" href="#/modul/${m.id}">${inner}</a>`;
  }

  function pageCurriculum() {
    return `
      <section class="hero">
        <span class="eyebrow">Müfredat</span>
        <h1>12 modülde marka, reklam ve PR</h1>
        <p class="lead">Her modülde kısa bir anlatım, Türkçe ve İngilizce kaynaklar, konu soruları, bölüm sonu soruları, pratik bir ödev ve tavsiyeler var. Modüller sırayla birbirinin üzerine kurulur.</p>
      </section>
      <div class="grid grid-3">${MODULES.map(moduleCard).join("")}</div>`;
  }

  function resourceList(list) {
    return `<ul class="res-list">${list.map((r) => `
      <li>
        <span class="type">${esc(r.type)}</span>
        ${r.url ? `<a class="title" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ↗</a>` : `<span class="title">${esc(r.title)}</span>`}
        ${r.author ? `<span class="muted">${esc(r.author)}</span>` : ""}
        ${r.note ? `<div class="note">${esc(r.note)}</div>` : ""}
      </li>`).join("")}</ul>`;
  }

  function pageModule(id) {
    const idx = MODULES.findIndex((m) => m.id === id);
    const m = MODULES[idx];
    if (!m) return pageNotFound();
    const prev = MODULES[idx - 1];
    const next = MODULES[idx + 1];
    const pager = `
      <nav class="pager">
        ${prev ? `<a class="btn secondary" href="#/modul/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn secondary" href="#/modul/${next.id}">${esc(next.title)} →</a>` : ""}
      </nav>`;

    if (m.status !== "ready") {
      return `
        <div class="narrow">
          <div class="module-head">
            <span class="eyebrow">Modül ${m.num} · Yakında</span>
            <h1>${esc(m.title)}</h1>
            <p class="lead muted">${esc(m.subtitle)}</p>
          </div>
          <p>${esc(m.preview)}</p>
          <h3>İşlenecek kavramlar</h3>
          <div class="concepts">${m.concepts.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
          <div class="callout">Bu modülün içeriği Faz 3'te hazırlanacak. Şimdilik önceki modüllere odaklan.</div>
          ${pager}
        </div>`;
    }

    const ms = modState(m.id);
    return `
      <article class="narrow">
        <header class="module-head">
          <span class="eyebrow">Modül ${m.num} · ${esc(m.duration)}</span>
          <h1>${esc(m.title)}</h1>
          <p class="lead muted">${esc(m.subtitle)}</p>
          <nav class="toc" aria-label="Bölümler">
            <a href="#anlatim" data-scroll>Anlatım</a>
            <a href="#konu-sorulari" data-scroll>Konu soruları</a>
            <a href="#kaynaklar" data-scroll>Kaynaklar</a>
            <a href="#bolum-sonu" data-scroll>Bölüm sonu</a>
            <a href="#odev" data-scroll>Ödev</a>
            <a href="#tavsiyeler" data-scroll>Tavsiyeler</a>
          </nav>
        </header>

        <section class="block" id="anlatim">
          <h2>Anlatım</h2>
          ${m.summary.map((p) => `<p>${p}</p>`).join("")}
          <div class="concepts">${m.concepts.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
          ${m.callout ? `<div class="callout">${esc(m.callout)}</div>` : ""}
        </section>

        <section class="block" id="konu-sorulari">
          <h2>Konu soruları</h2>
          <p class="muted">Önce kendin cevapla, sonra açıp kontrol et.</p>
          ${m.topicQuestions.map((q, i) => `
            <details class="q">
              <summary>${i + 1}. ${esc(q.q)}</summary>
              <div class="answer">${esc(q.a)}</div>
            </details>`).join("")}
        </section>

        <section class="block" id="kaynaklar">
          <h2>Kaynaklar</h2>
          <div class="grid grid-2">
            <div><h3>Türkçe</h3>${resourceList(m.resources.tr)}</div>
            <div><h3>İngilizce</h3>${resourceList(m.resources.en)}</div>
          </div>
        </section>

        <section class="block" id="bolum-sonu">
          <h2>Bölüm sonu soruları</h2>
          <p class="muted">Doğru tek bir cevabı olmayan, düşündüren sorular. Cevapların otomatik kaydedilir.</p>
          ${m.endQuestions.map((q, i) => `
            <div class="field">
              <label for="a-${q.id}">${i + 1}. ${esc(q.q)}</label>
              <textarea id="a-${q.id}" data-bind="progress.${m.id}.answers.${q.id}"></textarea>
              <span class="saved">Kaydedildi</span>
            </div>`).join("")}
        </section>

        <section class="block" id="odev">
          <h2>Pratik ödev: ${esc(m.assignment.title)}</h2>
          <p><strong>Amaç:</strong> ${esc(m.assignment.goal)}</p>
          <ol class="steps">${m.assignment.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
          <div class="callout"><strong>Çıktı:</strong> ${esc(m.assignment.deliverable)}</div>
          <div class="field">
            <label for="odev-notu">Ödev notların ve çıktın</label>
            <textarea id="odev-notu" style="min-height:180px" data-bind="progress.${m.id}.assignment"></textarea>
            <span class="saved">Kaydedildi</span>
          </div>
        </section>

        <section class="block" id="tavsiyeler">
          <h2>Tavsiyeler</h2>
          <ul>${m.advice.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </section>

        <div class="btn-row">
          <button class="btn ${ms.done ? "done" : ""}" id="toggle-done">${ms.done ? "✓ Tamamlandı" : "Modülü tamamladım"}</button>
        </div>
        ${pager}
      </article>`;
  }

  const WORKSHOP_FIELDS = [
    { key: "konumlandirma", label: "Konumlandırma cümlesi", hint: "[Hedef kitle] için, [kategori] alanında, [benzersiz değer] sağlarım; çünkü [kanıt]. (Modül 1)" },
    { key: "hedefKitle", label: "Hedef kitle", hint: "Birincil ve ikincil kitle: unvan, sektör, şirket büyüklüğü. (Modül 2)" },
    { key: "yapilacakIs", label: "Kitlenin beni \"işe alma\" nedeni", hint: "Takip ederek hangi işi yaptırıyorlar? Fonksiyonel, duygusal, sosyal. (Modül 2)" },
    { key: "alternatifler", label: "Rekabetçi alternatifler", hint: "Ben olmasam kimi ya da neyi takip ederlerdi? (Modül 1)" },
    { key: "kanitlar", label: "Kanıt noktaları", hint: "Projeler, sonuçlar, rakamlar, referanslar. (Modül 1)" },
    { key: "uckelime", label: "İstenen algı (3 kelime)", hint: "İnsanların beni anlatırken kullanmasını istediğim kelimeler. (Modül 0)" },
    { key: "sutunlar", label: "İçerik sütunları (3–4 adet)", hint: "Örn: Otomasyonun iş etkisi · İş geliştirme dersleri · Öğrendiğim marka teorisi · Sahadan gözlemler" },
    { key: "sesTonu", label: "Ses tonu", hint: "3 sıfat + yapmayacaklarım. Örn: sade, kanıta dayalı, samimi. Abartı yok, klişe motivasyon yok." },
    { key: "dil", label: "İçerik dili", hint: "Türkçe / İngilizce / ikisi birden? Hangi platformda hangisi?" },
    { key: "kirmiziCizgiler", label: "Kırmızı çizgiler", hint: "Asla paylaşmayacağım şeyler: müşteri adları, fiyatlar, gizli proje bilgileri, siyasi konular…" },
    { key: "hedefler", label: "12 aylık hedefler", hint: "Ölçülebilir: takipçi değil, sonuç. Örn: 2 etkinlik konuşması, 10 yeni sektör bağlantısı, 1 vaka çalışması." }
  ];

  function pageWorkshop() {
    return `
      <div class="narrow">
        <section class="hero">
          <span class="eyebrow">Faz 0 · Atölye</span>
          <h1>Marka profilin</h1>
          <p class="lead">Modüllerden çıkan kararlar burada birikir. Bu profil, içerik motorunun yapay zekâya vereceği talimatların temeli olacak. Ne kadar net olursa içerik o kadar \"sen\" olur.</p>
        </section>
        ${WORKSHOP_FIELDS.map((f) => `
          <div class="field">
            <label for="w-${f.key}">${esc(f.label)}</label>
            <div class="hint">${esc(f.hint)}</div>
            <textarea id="w-${f.key}" data-bind="workshop.${f.key}"></textarea>
            <span class="saved">Kaydedildi</span>
          </div>`).join("")}

        <h2>Yedekleme ve dışa aktarma</h2>
        <p class="muted">Veriler yalnızca bu tarayıcıda durur. Düzenli yedek al. Marka profili dosyası (.md) ileride içerik motoruna verilecek.</p>
        <div class="btn-row">
          <button class="btn" id="export-md">Marka profilini indir (.md)</button>
          <button class="btn secondary" id="export-json">Tüm verileri yedekle (.json)</button>
          <label class="btn secondary" for="import-json">Yedekten geri yükle</label>
          <input type="file" id="import-json" accept="application/json" hidden>
        </div>
      </div>`;
  }

  function workshopMarkdown() {
    const lines = ["# Marka Profili", "", `_Güncelleme: ${new Date().toISOString().slice(0, 10)}_`, ""];
    WORKSHOP_FIELDS.forEach((f) => {
      lines.push(`## ${f.label}`, "", (state.workshop[f.key] || "_(boş)_").trim(), "");
    });
    return lines.join("\n");
  }

  function pageAdvice() {
    return `
      <div class="narrow">
        <section class="hero">
          <span class="eyebrow">Tavsiyeler</span>
          <h1>Kaliteli bir marka, kaliteli bir insanla başlar</h1>
          <p class="lead">Teknikler değişir, platformlar değişir. Kalıcı olan karakter, ustalık ve ritimdir.</p>
        </section>
        ${ADVICE.map((g) => `
          <div class="card" style="margin-bottom:1rem">
            <h3>${esc(g.title)}</h3>
            <ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
          </div>`).join("")}
      </div>`;
  }

  function pageEngine() {
    return `
      <div class="narrow">
        <section class="hero">
          <span class="eyebrow">Faz 2 · Kurulumda</span>
          <h1>İçerik motoru</h1>
          <p class="lead">Öğrendiklerini ve sahadan gözlemlerini senin ses tonunda taslaklara çeviren, onayından sonra X'te (ardından LinkedIn'de) paylaşan yarı otomatik sistem.</p>
        </section>

        <h2>Akış</h2>
        <div class="flow">
          <div class="node"><strong>1. Kaynaklar</strong><span class="muted">Modül notların, ödev çıktıların, içgörü havuzu, sektör haberleri</span></div>
          <div class="down">↓</div>
          <div class="node"><strong>2. Marka profili</strong><span class="muted">Atölye'deki konumlandırma, ses tonu, sütunlar ve kırmızı çizgiler</span></div>
          <div class="down">↓</div>
          <div class="node"><strong>3. Taslak üretimi</strong><span class="muted">Yapay zekâ her sütun için taslak gönderiler hazırlar ve gizlilik filtresinden geçirir</span></div>
          <div class="down">↓</div>
          <div class="node human"><strong>4. Senin onayın</strong><span class="muted">Düzenle, onayla ya da reddet. Bu adım hiçbir zaman atlanmaz.</span></div>
          <div class="down">↓</div>
          <div class="node"><strong>5. Zamanlanmış paylaşım</strong><span class="muted">X (önce), LinkedIn (sonra)</span></div>
          <div class="down">↓</div>
          <div class="node"><strong>6. Ölçüm</strong><span class="muted">Etkileşim, profil ziyareti, yeni bağlantılar → haftalık rapor → sonraki konular</span></div>
        </div>

        <h2>Kararlar</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Konu</th><th>Seçim</th><th>Durum</th></tr></thead>
            <tbody>
              <tr><td>Barındırma</td><td>GitHub Pages</td><td><span class="badge ok">Kuruldu</span></td></tr>
              <tr><td>Otomasyon</td><td>Python + GitHub Actions (zamanlanmış iş akışları)</td><td><span class="badge ok">Kuruldu</span></td></tr>
              <tr><td>Veri</td><td>Supabase (taslaklar, fikir havuzu, marka profili)</td><td><span class="badge accent">Kurulum bekliyor</span></td></tr>
              <tr><td>Yapay zekâ</td><td>Claude API</td><td><span class="badge accent">Anahtar bekliyor</span></td></tr>
              <tr><td>İçerik dili</td><td>Türkçe öncelikli, her taslağın İngilizce uyarlaması da var</td><td><span class="badge ok">Karar verildi</span></td></tr>
              <tr><td>Onay</td><td>Taslaklar e-postayla gelir, onay bu sitedeki Panel'den verilir</td><td><span class="badge ok">Karar verildi</span></td></tr>
              <tr><td>X API</td><td>Anahtarlar eklenene kadar yayın adımı otomatik atlanır</td><td><span class="badge">Sonra</span></td></tr>
            </tbody>
          </table>
        </div>

        <h2>Zamanlama</h2>
        <ul>
          <li><strong>Taslak üretimi:</strong> Pazartesi, Çarşamba, Cuma 09:00. Ya da GitHub → Actions → "Taslak üret" → <em>Run workflow</em> ile istediğin an.</li>
          <li><strong>Yayın:</strong> Her 30 dakikada bir, zamanı gelen onaylı gönderiler paylaşılır.</li>
        </ul>
        <div class="btn-row"><a class="btn" href="#/panel">Panele git</a></div>
      </div>`;
  }

  function pageNotFound() {
    return `<div class="narrow"><h1>Sayfa bulunamadı</h1><p><a href="#/">Ana sayfaya dön</a></p></div>`;
  }

  /* ---------------- Yönlendirme ---------------- */
  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [page, param] = hash.split("/");
    let html;
    switch (page) {
      case "": html = pageHome(); break;
      case "mufredat": html = pageCurriculum(); break;
      case "modul": html = pageModule(param); break;
      case "atolye": html = pageWorkshop(); break;
      case "tavsiyeler": html = pageAdvice(); break;
      case "icerik-motoru": html = pageEngine(); break;
      case "panel": html = `<div id="panel-root"></div>`; break;
      default: html = pageNotFound();
    }
    app.innerHTML = html;
    if (page === "panel") window.MarkaPanel.mount(document.getElementById("panel-root"));
    bindInputs(app);
    afterRender(page, param);

    const active = page === "modul" ? "mufredat" : page || "home";
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === active));
    document.getElementById("nav").classList.remove("open");
    window.scrollTo(0, 0);
    const h1 = app.querySelector("h1");
    document.title = h1 && page ? `${h1.textContent} · Marka Laboratuvarı` : "Marka Laboratuvarı";
  }

  function afterRender(page, param) {
    // Sayfa içi bağlantılar hash yönlendirmesini bozmasın
    app.querySelectorAll("a[data-scroll]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const t = document.getElementById(a.getAttribute("href").slice(1));
        if (t) t.scrollIntoView({ behavior: "smooth" });
      });
    });

    const toggle = document.getElementById("toggle-done");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const ms = modState(param);
        ms.done = !ms.done;
        save();
        toggle.classList.toggle("done", ms.done);
        toggle.textContent = ms.done ? "✓ Tamamlandı" : "Modülü tamamladım";
      });
    }

    if (page === "atolye") {
      document.getElementById("export-md").addEventListener("click", () =>
        download("marka-profili.md", workshopMarkdown(), "text/markdown;charset=utf-8"));
      document.getElementById("export-json").addEventListener("click", () =>
        download(`markalab-yedek-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), "application/json"));
      document.getElementById("import-json").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        file.text().then((txt) => {
          try {
            const data = JSON.parse(txt);
            state = { progress: data.progress || {}, workshop: data.workshop || {} };
            save();
            route();
            alert("Yedek geri yüklendi.");
          } catch (err) {
            alert("Dosya okunamadı. Geçerli bir yedek dosyası seçtiğinden emin ol.");
          }
        });
      });
    }
  }

  /* ---------------- Tema ve menü ---------------- */
  try {
    const t = localStorage.getItem("markalab:theme");
    if (t) document.documentElement.dataset.theme = t;
  } catch (e) { /* yok say */ }
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("markalab:theme", root.dataset.theme); } catch (e) { /* yok say */ }
  });
  const menuBtn = document.querySelector(".menu-toggle");
  menuBtn.addEventListener("click", () => {
    const nav = document.getElementById("nav");
    nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  window.MarkaLab = { esc, workshopMarkdown };

  window.addEventListener("hashchange", route);
  window.MarkaPanel.handleAuthRedirect()
    .catch((e) => console.error(e))
    .finally(route);
})();
