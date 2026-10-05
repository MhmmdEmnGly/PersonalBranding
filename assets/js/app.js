(function () {
  "use strict";

  const MODULES = window.MODULES || [];
  const ADVICE = window.GENERAL_ADVICE || [];
  const PHASES = window.PHASES || [];
  const UNITS = window.UNITS || [];
  const STORE_KEY = "markalab:v1";
  const app = document.getElementById("app");

  /* ================= Depolama ================= */
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const d = raw ? JSON.parse(raw) : {};
      return { progress: d.progress || {}, workshop: d.workshop || {}, phases: d.phases || {} };
    } catch (e) {
      return { progress: {}, workshop: {}, phases: {} };
    }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* yok say */ }
  }
  function modState(id) {
    if (!state.progress[id]) state.progress[id] = { done: false, answers: {}, assignment: "", seen: {} };
    if (!state.progress[id].seen) state.progress[id].seen = {};
    if (!state.progress[id].answers) state.progress[id].answers = {};
    return state.progress[id];
  }

  /* ================= Yardımcılar ================= */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const filled = (v) => Boolean(v && String(v).trim());
  let onDataChange = null; // o anki sayfanın, bir alan değişince çalışacak yenileyicisi

  const ICONS = {
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
    send: '<path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z"/><path d="m10 13 5-5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flag: '<path d="M5 21V4h11l-1.5 4L16 12H5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>'
  };
  const icon = (name, cls) => `<svg class="ico ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  const SECTIONS = {
    home: { label: "Yol Haritası", icon: "map" },
    ogren: { label: "Öğren", icon: "book", what: "Teoriyi öğrenirsin.", desc: "12 modülde marka, reklam ve PR. Her modül 5 adım: oku, kendini test et, kaynaklara bak, düşün, uygula.", output: "Bilgi ve cevapların" },
    uygula: { label: "Uygula", icon: "pen", what: "Öğrendiğini kendi markana çevirirsin.", desc: "Atölye'de konumlandırmanı, kitleni, ses tonunu ve içerik sütunlarını yazarsın. Bu senin marka profilin olur.", output: "Marka profilin" },
    uret: { label: "Üret", icon: "send", what: "Profilinden içerik üretilir.", desc: "Yapay zekâ marka profilin ve fikirlerinden taslak yazar. Sen panelde düzenler, onaylar ve planlarsın.", output: "Paylaşımların" },
    rehber: { label: "Rehber", icon: "compass", what: "Nasıl biri olacağını hatırlarsın.", desc: "Kaliteli bir marka ve kişi olmak için ilkeler ve haftalık ritim.", output: "Alışkanlıkların" }
  };

  function sectionHeader(sec, eyebrow, title, lead, extra) {
    return `
      <header class="sec-head" data-sec="${sec}">
        <div class="sec-head-inner">
          <span class="sec-chip">${icon(SECTIONS[sec].icon)} ${esc(eyebrow || SECTIONS[sec].label)}</span>
          <h1>${title}</h1>
          ${lead ? `<p class="lead">${lead}</p>` : ""}
          ${extra || ""}
        </div>
      </header>`;
  }

  function bar(value, label) {
    return `<div class="bar" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" ${label ? `aria-label="${esc(label)}"` : ""}><div style="width:${value}%"></div></div>`;
  }

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
        const field = el.closest(".field");
        flashSaved(field && field.querySelector(".saved"));
        if (field) field.classList.toggle("is-filled", filled(el.value));
        if (onDataChange) onDataChange();
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

  /* ================= Hesaplamalar ================= */
  const phaseTasks = (p) => p.groups.flatMap((g) => g.tasks);
  const taskDone = (id) => Boolean(state.phases[id]);
  function phaseProgress(p) {
    const tasks = phaseTasks(p);
    return pct(tasks.filter((t) => taskDone(t.id)).length, tasks.length);
  }
  function currentPhase() {
    return PHASES.find((p) => phaseProgress(p) < 100) || PHASES[PHASES.length - 1];
  }

  const STEPS = [
    { key: "oku", label: "Oku", icon: "book" },
    { key: "test", label: "Kendini test et", icon: "bulb" },
    { key: "kaynak", label: "Kaynaklar", icon: "compass" },
    { key: "dusun", label: "Düşün", icon: "target" },
    { key: "uygula", label: "Uygula", icon: "pen" }
  ];
  function stepDone(m, key) {
    const ms = state.progress[m.id];
    if (!ms) return false;
    if (key === "dusun") {
      const answered = m.endQuestions.filter((q) => filled(ms.answers && ms.answers[q.id])).length;
      return answered >= Math.ceil(m.endQuestions.length / 2);
    }
    if (key === "uygula") return filled(ms.assignment);
    return Boolean(ms.seen && ms.seen[key]);
  }
  function moduleProgress(m) {
    if (m.status !== "ready") return 0;
    if (state.progress[m.id] && state.progress[m.id].done) return 100;
    return pct(STEPS.filter((s) => stepDone(m, s.key)).length, STEPS.length + 1);
  }

  const WORKSHOP_GROUPS = [
    {
      key: "kimlik", title: "Kimlik", sub: "Kimsin ve neden sen?", module: "kisisel-marka-konumlandirma",
      fields: [
        { key: "konumlandirma", label: "Konumlandırma cümlesi", hint: "[Hedef kitle] için, [kategori] alanında, [benzersiz değer] sağlarım; çünkü [kanıt]." },
        { key: "kanitlar", label: "Kanıt noktaları", hint: "Projeler, sonuçlar, rakamlar, referanslar." },
        { key: "uckelime", label: "İstenen algı (3 kelime)", hint: "İnsanların seni anlatırken kullanmasını istediğin kelimeler." }
      ]
    },
    {
      key: "kitle", title: "Kitle", sub: "Kime konuşuyorsun?", module: "hedef-kitle-icgoru",
      fields: [
        { key: "hedefKitle", label: "Hedef kitle", hint: "Birincil ve ikincil kitle: unvan, sektör, şirket büyüklüğü." },
        { key: "yapilacakIs", label: "Seni neden takip ederler?", hint: "Seni takip ederek hangi işi yaptırıyorlar? Fonksiyonel, duygusal, sosyal." },
        { key: "alternatifler", label: "Rekabetçi alternatifler", hint: "Sen olmasan kimi ya da neyi takip ederlerdi?" }
      ]
    },
    {
      key: "ses", title: "Ses ve içerik", sub: "Nasıl ve ne hakkında konuşacaksın?", module: "kisisel-marka-konumlandirma",
      fields: [
        { key: "sutunlar", label: "İçerik sütunları (3–4 adet)", hint: "Örn: Otomasyonun iş etkisi · İş geliştirme dersleri · Öğrendiğim marka teorisi · Sahadan gözlemler" },
        { key: "sesTonu", label: "Ses tonu", hint: "3 sıfat + yapmayacakların. Örn: sade, kanıta dayalı, samimi. Abartı ve klişe motivasyon yok." },
        { key: "dil", label: "İçerik dili", hint: "Türkçe öncelikli; İngilizce ne zaman ve hangi platformda?" },
        { key: "kirmiziCizgiler", label: "Kırmızı çizgiler", hint: "Asla paylaşmayacakların: müşteri adları, fiyatlar, gizli proje bilgileri, siyasi konular…" }
      ]
    },
    {
      key: "hedef", title: "Hedefler", sub: "12 ay sonra nerede olmak istiyorsun?", module: "marka-nedir",
      fields: [
        { key: "hedefler", label: "12 aylık hedefler", hint: "Takipçi değil, sonuç. Örn: 2 etkinlik konuşması, 10 yeni sektör bağlantısı, 1 vaka çalışması." }
      ]
    }
  ];
  const WORKSHOP_FIELDS = WORKSHOP_GROUPS.flatMap((g) => g.fields);
  const workshopProgress = () => pct(WORKSHOP_FIELDS.filter((f) => filled(state.workshop[f.key])).length, WORKSHOP_FIELDS.length);

  function workshopMarkdown() {
    const lines = ["# Marka Profili", "", `_Güncelleme: ${new Date().toISOString().slice(0, 10)}_`, ""];
    WORKSHOP_GROUPS.forEach((g) => {
      lines.push(`# ${g.title}`, "");
      g.fields.forEach((f) => lines.push(`## ${f.label}`, "", (state.workshop[f.key] || "_(boş)_").trim(), ""));
    });
    return lines.join("\n");
  }

  /* ================= Sayfa: Yol Haritası ================= */
  function taskItem(t, compact) {
    const done = taskDone(t.id);
    return `
      <li class="task ${done ? "done" : ""}">
        <label>
          <input type="checkbox" data-task="${t.id}" ${done ? "checked" : ""}>
          <span class="tick">${icon("check")}</span>
          <span class="task-text">${esc(t.text)}${!compact && t.detail ? `<small>${esc(t.detail)}</small>` : ""}</span>
        </label>
        ${t.link ? `<a class="task-link" href="${t.link}" aria-label="Git">${icon("arrow")}</a>` : ""}
      </li>`;
  }

  function pageHome() {
    const cur = currentPhase();
    const next = phaseTasks(cur).filter((t) => !taskDone(t.id)).slice(0, 4);
    const flow = ["ogren", "uygula", "uret", "rehber"];
    const routeOf = { ogren: "#/ogren", uygula: "#/atolye", uret: "#/uret", rehber: "#/rehber" };
    return `
      <section class="home-hero">
        <div class="home-hero-text">
          <span class="eyebrow">Marka Laboratuvarı</span>
          <h1>Öğren. Uygula. <span class="hl">Üret.</span></h1>
          <p class="lead">Kişisel markanı adım adım kurduğun sistem. Nereden başlayacağını düşünmene gerek yok: sağdaki kartta sıradaki adım her zaman hazır.</p>
        </div>
        <div class="now-card">
          <div class="now-top">
            <span class="pill">Şimdi · Faz ${cur.id}</span>
            <span class="muted small">%${phaseProgress(cur)}</span>
          </div>
          <h2>${esc(cur.title)}</h2>
          ${bar(phaseProgress(cur))}
          <ul class="tasks compact">${next.map((t) => taskItem(t, true)).join("") || `<li class="muted">Bu fazın tüm görevleri tamam.</li>`}</ul>
          <a class="btn" href="#/faz/${cur.id}">Fazın tüm adımları ${icon("arrow")}</a>
        </div>
      </section>

      <section class="block-gap">
        <h2 class="h-section">Sistem nasıl çalışır?</h2>
        <p class="muted">Dört bölüm, tek bir döngü. Her bölümün rengi ve işi farklı.</p>
        <div class="flow-cards">
          ${flow.map((k, i) => `
            <a class="flow-card" data-sec="${k}" href="${routeOf[k]}">
              <span class="flow-num">${k === "rehber" ? "+" : i + 1}</span>
              <span class="flow-ico">${icon(SECTIONS[k].icon)}</span>
              <h3>${SECTIONS[k].label}</h3>
              <p class="flow-what">${SECTIONS[k].what}</p>
              <p class="muted small">${SECTIONS[k].desc}</p>
              <span class="flow-out">Çıktı: <strong>${SECTIONS[k].output}</strong></span>
            </a>`).join("")}
        </div>
      </section>

      <section class="block-gap">
        <h2 class="h-section">Yol haritası</h2>
        <p class="muted">5 faz. Her faza tıklayıp tüm adımlarını görebilir ve işaretleyebilirsin.</p>
        <ol class="timeline">
          ${PHASES.map((p) => {
            const pr = phaseProgress(p);
            const status = pr === 100 ? "done" : p.id === cur.id ? "now" : "next";
            const label = { done: "Tamamlandı", now: "Şimdi", next: "Sırada" }[status];
            return `
              <li class="tl-item ${status}">
                <a href="#/faz/${p.id}">
                  <span class="tl-dot">${pr === 100 ? icon("check") : p.id}</span>
                  <span class="tl-body">
                    <span class="tl-meta"><span class="pill ${status}">${label}</span><span class="muted small">${icon("clock")} ${esc(p.duration)}</span></span>
                    <strong class="tl-title">Faz ${p.id} · ${esc(p.title)}</strong>
                    <span class="muted">${esc(p.short)}</span>
                    ${bar(pr)}
                  </span>
                  <span class="tl-arrow">${icon("arrow")}</span>
                </a>
              </li>`;
          }).join("")}
        </ol>
      </section>`;
  }

  /* ================= Sayfa: Faz detayı ================= */
  function pagePhase(id) {
    const p = PHASES.find((x) => String(x.id) === String(id));
    if (!p) return pageNotFound();
    const prev = PHASES.find((x) => x.id === p.id - 1);
    const next = PHASES.find((x) => x.id === p.id + 1);
    const pr = phaseProgress(p);
    const mods = p.modules.map((n) => MODULES.find((m) => m.num === n)).filter(Boolean);
    return `
      ${sectionHeader("home", `Yol haritası · Faz ${p.id} / ${PHASES.length - 1}`, esc(p.title), esc(p.short), `
        <div class="head-meta">
          <span class="meta-chip">${icon("clock")} ${esc(p.duration)}</span>
          <span class="meta-chip" id="phase-pct">${icon("flag")} %${pr} tamam</span>
        </div>
        <div class="head-bar" id="phase-bar">${bar(pr)}</div>`)}
      <div class="phase-layout">
        <div class="phase-main">
          ${p.groups.map((g, gi) => {
            const done = g.tasks.filter((t) => taskDone(t.id)).length;
            return `
              <section class="card task-group">
                <div class="tg-head">
                  <span class="tg-num">${gi + 1}</span>
                  <h3>${esc(g.title)}</h3>
                  <span class="muted small">${done}/${g.tasks.length}</span>
                </div>
                <ul class="tasks">${g.tasks.map((t) => taskItem(t)).join("")}</ul>
              </section>`;
          }).join("")}
        </div>
        <aside class="phase-side">
          <div class="card side-card">
            <h4>${icon("bulb")} Neden önemli?</h4>
            <p>${esc(p.why)}</p>
          </div>
          ${mods.length ? `
          <div class="card side-card" data-sec="ogren">
            <h4>${icon("book")} Bu fazın modülleri</h4>
            <ul class="side-links">${mods.map((m) => `<li><a href="#/modul/${m.id}"><span class="mod-num">${String(m.num).padStart(2, "0")}</span> ${esc(m.title)} ${m.status !== "ready" ? `<span class="pill">Yakında</span>` : ""}</a></li>`).join("")}</ul>
          </div>` : ""}
          <div class="card side-card">
            <h4>${icon("target")} Çıktılar</h4>
            <ul class="plain">${p.outputs.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
          </div>
          <div class="card side-card highlight">
            <h4>${icon("flag")} Ne zaman biter?</h4>
            <p>${esc(p.doneWhen)}</p>
          </div>
        </aside>
      </div>
      <nav class="pager">
        ${prev ? `<a class="btn secondary" href="#/faz/${prev.id}">← Faz ${prev.id}: ${esc(prev.title)}</a>` : `<a class="btn secondary" href="#/">← Yol haritası</a>`}
        ${next ? `<a class="btn secondary" href="#/faz/${next.id}">Faz ${next.id}: ${esc(next.title)} →</a>` : ""}
      </nav>`;
  }

  /* ================= Sayfa: Öğren (müfredat) ================= */
  function moduleCard(m) {
    const ready = m.status === "ready";
    const pr = moduleProgress(m);
    const done = state.progress[m.id] && state.progress[m.id].done;
    return `
      <a class="mod-card ${ready ? "" : "soon"}" href="#/modul/${m.id}">
        <div class="mod-card-top">
          <span class="mod-num big">${String(m.num).padStart(2, "0")}</span>
          ${done ? `<span class="pill done">${icon("check")} Tamamlandı</span>` : ready ? (pr ? `<span class="pill now">Devam ediyor</span>` : `<span class="pill">Başla</span>`) : `<span class="pill">Yakında</span>`}
        </div>
        <h3>${esc(m.title)}</h3>
        <p class="muted small">${esc(m.subtitle)}</p>
        ${ready ? `
          <div class="step-dots">${STEPS.map((s) => `<span class="${stepDone(m, s.key) ? "on" : ""}" title="${s.label}"></span>`).join("")}</div>
          <span class="muted small">${icon("clock")} ${esc(m.duration)}</span>` : `<span class="muted small">${m.concepts.slice(0, 3).map(esc).join(" · ")}</span>`}
      </a>`;
  }

  function pageCurriculum() {
    const ready = MODULES.filter((m) => m.status === "ready");
    const doneCount = MODULES.filter((m) => state.progress[m.id] && state.progress[m.id].done).length;
    return `
      ${sectionHeader("ogren", null, "Müfredat", SECTIONS.ogren.desc, `
        <div class="head-meta">
          <span class="meta-chip">${icon("book")} ${MODULES.length} modül · ${UNITS.length} ünite</span>
          <span class="meta-chip">${icon("check")} ${doneCount} tamamlandı</span>
          <span class="meta-chip">${ready.length} modül yayında</span>
        </div>`)}
      <div class="how-strip">
        ${STEPS.map((s, i) => `<div class="how-step"><span class="how-num">${i + 1}</span>${icon(s.icon)}<span>${s.label}</span></div>`).join(`<span class="how-arrow">${icon("arrow")}</span>`)}
      </div>
      ${UNITS.map((u, i) => `
        <section class="unit">
          <div class="unit-head">
            <span class="unit-num">Ünite ${i + 1}</span>
            <h2>${esc(u.title)}</h2>
            <p class="muted">${esc(u.text)}</p>
          </div>
          <div class="mod-grid">${u.modules.map((n) => MODULES.find((m) => m.num === n)).filter(Boolean).map(moduleCard).join("")}</div>
        </section>`).join("")}`;
  }

  /* ================= Sayfa: Modül ================= */
  let activeStep = {};

  function resourceList(list) {
    return `<ul class="res-list">${list.map((r) => `
      <li>
        <span class="res-type">${esc(r.type)}</span>
        ${r.url ? `<a class="res-title" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ↗</a>` : `<span class="res-title">${esc(r.title)}</span>`}
        ${r.author ? `<span class="muted small">${esc(r.author)}</span>` : ""}
        ${r.note ? `<p class="res-note">${esc(r.note)}</p>` : ""}
      </li>`).join("")}</ul>`;
  }

  function stepContent(m, key) {
    if (key === "oku") return `
      <div class="prose">${m.summary.map((p) => `<p>${p}</p>`).join("")}</div>
      <h3 class="mini-h">Anahtar kavramlar</h3>
      <div class="concepts">${m.concepts.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
      ${m.callout ? `<div class="callout">${icon("bulb")}<p>${esc(m.callout)}</p></div>` : ""}
      <h3 class="mini-h">Akılda tut</h3>
      <ul class="advice-list">${m.advice.map((a) => `<li>${icon("check")}<span>${esc(a)}</span></li>`).join("")}</ul>`;
    if (key === "test") return `
      <p class="muted">Soruyu oku, cevabı önce kafanda ver, sonra karta tıklayıp kontrol et.</p>
      <div class="flash-grid">${m.topicQuestions.map((q, i) => `
        <button class="flash" type="button" aria-pressed="false">
          <span class="flash-q"><span class="flash-n">Soru ${i + 1}</span>${esc(q.q)}<span class="flash-hint">Cevabı görmek için tıkla</span></span>
          <span class="flash-a"><span class="flash-n">Cevap</span>${esc(q.a)}</span>
        </button>`).join("")}</div>`;
    if (key === "kaynak") return `
      <div class="res-cols">
        <div><h3 class="mini-h"><span class="flag-tag">TR</span> Türkçe</h3>${resourceList(m.resources.tr)}</div>
        <div><h3 class="mini-h"><span class="flag-tag">EN</span> İngilizce</h3>${resourceList(m.resources.en)}</div>
      </div>`;
    if (key === "dusun") return `
      <p class="muted">Tek doğru cevabı olmayan sorular. Yazdıkların otomatik kaydedilir; en az yarısını cevaplayınca bu adım tamamlanır.</p>
      ${m.endQuestions.map((q, i) => `
        <div class="field ${filled(state.progress[m.id] && state.progress[m.id].answers[q.id]) ? "is-filled" : ""}">
          <label for="a-${q.id}"><span class="q-num">${i + 1}</span>${esc(q.q)}</label>
          <textarea id="a-${q.id}" data-bind="progress.${m.id}.answers.${q.id}" placeholder="Düşüncelerini yaz…"></textarea>
          <span class="saved">Kaydedildi</span>
        </div>`).join("")}`;
    const ms = modState(m.id);
    return `
      <div class="assign-head">
        <h3>${esc(m.assignment.title)}</h3>
        <p><strong>Amaç:</strong> ${esc(m.assignment.goal)}</p>
      </div>
      <ol class="num-steps">${m.assignment.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <div class="callout">${icon("target")}<p><strong>Çıktı:</strong> ${esc(m.assignment.deliverable)}</p></div>
      <div class="field">
        <label for="odev-notu">Ödev notların ve çıktın</label>
        <textarea id="odev-notu" style="min-height:200px" data-bind="progress.${m.id}.assignment" placeholder="Ödevi yaparken notlarını burada tut…"></textarea>
        <span class="saved">Kaydedildi</span>
      </div>
      <div class="done-box">
        <button class="btn ${ms.done ? "done" : ""}" id="toggle-done">${ms.done ? `${icon("check")} Modül tamamlandı` : "Modülü tamamladım"}</button>
        <a class="btn secondary" href="#/atolye">Atölye'ye aktar ${icon("arrow")}</a>
      </div>`;
  }

  function pageModule(id) {
    const idx = MODULES.findIndex((m) => m.id === id);
    const m = MODULES[idx];
    if (!m) return pageNotFound();
    const prev = MODULES[idx - 1];
    const next = MODULES[idx + 1];
    const unitIdx = UNITS.findIndex((u) => u.modules.includes(m.num));
    const crumb = `<a href="#/ogren">Öğren</a> › Ünite ${unitIdx + 1}: ${esc(UNITS[unitIdx] ? UNITS[unitIdx].title : "")}`;
    const pager = `
      <nav class="pager">
        ${prev ? `<a class="btn secondary" href="#/modul/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn secondary" href="#/modul/${next.id}">${esc(next.title)} →</a>` : ""}
      </nav>`;

    if (m.status !== "ready") {
      return `
        ${sectionHeader("ogren", `Modül ${m.num} · Yakında`, esc(m.title), esc(m.subtitle), `<p class="crumb">${crumb}</p>`)}
        <div class="narrow">
          <div class="card">
            <p>${esc(m.preview)}</p>
            <h3 class="mini-h">İşlenecek kavramlar</h3>
            <div class="concepts">${m.concepts.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
          </div>
          <div class="callout">${icon("clock")}<p>Bu modülün içeriği Faz 3'te hazırlanacak. Şimdilik yayındaki modüllere odaklan.</p></div>
          ${pager}
        </div>`;
    }

    const step = activeStep[m.id] || "oku";
    modState(m.id);
    return `
      ${sectionHeader("ogren", `Modül ${m.num}`, esc(m.title), esc(m.subtitle), `
        <p class="crumb">${crumb} · ${icon("clock")} ${esc(m.duration)}</p>`)}
      <div class="narrow">
        <nav class="stepper" role="tablist">
          ${STEPS.map((s, i) => `
            <button role="tab" data-step="${s.key}" class="${s.key === step ? "active" : ""} ${stepDone(m, s.key) ? "complete" : ""}" aria-selected="${s.key === step}">
              <span class="st-num">${stepDone(m, s.key) ? icon("check") : i + 1}</span>
              <span class="st-label">${s.label}</span>
            </button>`).join("")}
        </nav>
        <section class="step-body card" id="step-body" data-module="${m.id}">${stepContent(m, step)}</section>
        <div class="step-nav" id="step-nav"></div>
        ${pager}
      </div>`;
  }

  function renderStepNav(m, step) {
    const i = STEPS.findIndex((s) => s.key === step);
    const nav = document.getElementById("step-nav");
    if (!nav) return;
    nav.innerHTML = `
      ${i > 0 ? `<button class="btn secondary" data-goto="${STEPS[i - 1].key}">← ${STEPS[i - 1].label}</button>` : "<span></span>"}
      ${i < STEPS.length - 1 ? `<button class="btn" data-goto="${STEPS[i + 1].key}">Sonraki: ${STEPS[i + 1].label} →</button>` : ""}`;
  }

  function showStep(m, key) {
    activeStep[m.id] = key;
    const ms = modState(m.id);
    if (key === "oku" || key === "test" || key === "kaynak") { ms.seen[key] = true; save(); }
    const body = document.getElementById("step-body");
    body.innerHTML = stepContent(m, key);
    bindInputs(body);
    wireStep(m);
    renderStepNav(m, key);
    refreshStepper(m, key);
  }

  function refreshStepper(m, key) {
    document.querySelectorAll(".stepper button").forEach((b, i) => {
      const s = STEPS[i];
      const done = stepDone(m, s.key);
      b.classList.toggle("active", s.key === key);
      b.classList.toggle("complete", done);
      b.setAttribute("aria-selected", s.key === key);
      b.querySelector(".st-num").innerHTML = done ? icon("check") : String(i + 1);
    });
  }

  function wireStep(m) {
    const body = document.getElementById("step-body");
    body.querySelectorAll(".flash").forEach((f) => f.addEventListener("click", () => {
      f.classList.toggle("flipped");
      f.setAttribute("aria-pressed", f.classList.contains("flipped"));
    }));
    const toggle = document.getElementById("toggle-done");
    if (toggle) toggle.addEventListener("click", () => {
      const ms = modState(m.id);
      ms.done = !ms.done;
      save();
      toggle.classList.toggle("done", ms.done);
      toggle.innerHTML = ms.done ? `${icon("check")} Modül tamamlandı` : "Modülü tamamladım";
    });
  }

  /* ================= Sayfa: Uygula (Atölye) ================= */
  function pageWorkshop() {
    const ready = MODULES.filter((m) => m.status === "ready");
    return `
      ${sectionHeader("uygula", "Uygula · Atölye", "Marka profilin", SECTIONS.uygula.desc, `
        <div class="head-meta"><span class="meta-chip" id="ws-pct">${icon("pen")} %${workshopProgress()} dolu</span></div>
        <div class="head-bar" id="ws-bar">${bar(workshopProgress())}</div>`)}
      <div class="narrow">
        <div class="callout">${icon("send")}<p>Bu profil İçerik Motoru'nun beynidir. Yapay zekâ her taslağı yazarken bunu okur. Ne kadar net yazarsan taslaklar o kadar "sen" olur.</p></div>

        ${WORKSHOP_GROUPS.map((g, gi) => {
          const mod = MODULES.find((m) => m.id === g.module);
          return `
            <section class="card ws-group" data-group="${g.key}">
              <div class="tg-head">
                <span class="tg-num">${gi + 1}</span>
                <div><h3>${esc(g.title)}</h3><p class="muted small">${esc(g.sub)}</p></div>
                <span class="muted small ws-count"></span>
              </div>
              ${g.fields.map((f) => `
                <div class="field ${filled(state.workshop[f.key]) ? "is-filled" : ""}">
                  <label for="w-${f.key}"><span class="fill-dot"></span>${esc(f.label)}</label>
                  <div class="hint">${esc(f.hint)}</div>
                  <textarea id="w-${f.key}" data-bind="workshop.${f.key}"></textarea>
                  <span class="saved">Kaydedildi</span>
                </div>`).join("")}
              ${mod ? `<p class="small muted">Yardım: <a href="#/modul/${mod.id}">Modül ${mod.num} · ${esc(mod.title)}</a></p>` : ""}
            </section>`;
        }).join("")}

        <section class="card">
          <h3>Ödevlerin</h3>
          <p class="muted small">Modül ödevlerinde yazdıkların. Profili doldururken buradan yararlan.</p>
          <ul class="side-links">${ready.map((m) => `<li><a href="#/modul/${m.id}"><span class="mod-num">${String(m.num).padStart(2, "0")}</span> ${esc(m.assignment.title)} ${filled(state.progress[m.id] && state.progress[m.id].assignment) ? `<span class="pill done">Yazıldı</span>` : `<span class="pill">Boş</span>`}</a></li>`).join("")}</ul>
        </section>

        <section class="card">
          <h3>Yedekleme ve aktarma</h3>
          <p class="muted small">Veriler sadece bu tarayıcıda durur. Düzenli yedek al. Başka bir cihaza taşımak için yedeği orada geri yükle.</p>
          <div class="btn-row">
            <button class="btn" id="export-md">Profili indir (.md)</button>
            <button class="btn secondary" id="export-json">Tüm verileri yedekle (.json)</button>
            <label class="btn secondary" for="import-json">Yedekten geri yükle</label>
            <input type="file" id="import-json" accept="application/json" hidden>
          </div>
        </section>
      </div>`;
  }

  function refreshWorkshopMeta() {
    const p = workshopProgress();
    const chip = document.getElementById("ws-pct");
    if (chip) chip.innerHTML = `${icon("pen")} %${p} dolu`;
    const b = document.getElementById("ws-bar");
    if (b) b.innerHTML = bar(p);
    document.querySelectorAll(".ws-group").forEach((el) => {
      const g = WORKSHOP_GROUPS.find((x) => x.key === el.dataset.group);
      const n = g.fields.filter((f) => filled(state.workshop[f.key])).length;
      el.querySelector(".ws-count").textContent = `${n}/${g.fields.length}`;
      el.classList.toggle("complete", n === g.fields.length);
    });
  }

  /* ================= Sayfa: Üret ================= */
  function pageEngine() {
    const p2 = PHASES.find((p) => p.id === 2);
    return `
      ${sectionHeader("uret", "Üret · İçerik Motoru", "Fikirden paylaşıma", SECTIONS.uret.desc, `
        <div class="btn-row"><a class="btn light" href="#/panel">Panele git ${icon("arrow")}</a></div>`)}
      <div class="narrow">
        <div class="engine-steps">
          <div class="es"><span class="es-num">1</span><h3>Fikir ekle</h3><p class="muted small">Panelde fikir havuzuna öğrendiğin bir kavramı ya da sahadan bir gözlemi yaz.</p></div>
          <div class="es"><span class="es-num">2</span><h3>Taslak gelir</h3><p class="muted small">Pazartesi, Çarşamba, Cuma 09:00'da yapay zekâ profilin ve fikirlerinden Türkçe + İngilizce taslak yazar.</p></div>
          <div class="es human"><span class="es-num">3</span><h3>Sen onaylarsın</h3><p class="muted small">Panelde düzenler, dili ve saati seçip onaylarsın. Onaysız hiçbir şey paylaşılmaz.</p></div>
          <div class="es"><span class="es-num">4</span><h3>Paylaşılır</h3><p class="muted small">Zamanı gelince X'te paylaşılır (X anahtarları eklendiğinde).</p></div>
        </div>

        <section class="card">
          <div class="tg-head"><span class="tg-num">${icon("flag")}</span><h3>Kurulum durumu</h3><span class="muted small">%${phaseProgress(p2)}</span></div>
          ${bar(phaseProgress(p2))}
          <p class="muted small" style="margin-top:.75rem">Kurulum adımlarının tamamı Faz 2'de.</p>
          <a class="btn secondary" href="#/faz/2">Kurulum adımlarına git ${icon("arrow")}</a>
        </section>

        <section class="card">
          <h3>Yapay zekâ sağlayıcısı</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Sağlayıcı</th><th>Durum</th><th>Nasıl açılır?</th></tr></thead>
              <tbody>
                <tr><td><strong>Gemini</strong> (ücretsiz katman)</td><td><span class="pill now">Varsayılan</span></td><td>GitHub Secret: <code>GEMINI_API_KEY</code></td></tr>
                <tr><td><strong>Claude</strong></td><td><span class="pill">Hazır, kapalı</span></td><td>Secret: <code>ANTHROPIC_API_KEY</code> + Variable: <code>LLM_PROVIDER</code> = <code>claude</code></td></tr>
              </tbody>
            </table>
          </div>
          <p class="muted small">Not: Gemini'nin ücretsiz katmanında gönderdiğin içerik Google tarafından ürün geliştirmede kullanılabilir. Fikir havuzuna gizli bilgi yazma.</p>
        </section>
      </div>`;
  }

  /* ================= Sayfa: Rehber ================= */
  const ADVICE_ICONS = ["target", "book", "send", "flag", "clock"];
  function pageAdvice() {
    return `
      ${sectionHeader("rehber", null, "Kaliteli bir marka, kaliteli bir insanla başlar", "Teknikler ve platformlar değişir. Kalıcı olan karakter, ustalık ve ritimdir.")}
      <div class="advice-grid">
        ${ADVICE.map((g, i) => `
          <section class="card advice-card">
            <span class="advice-ico">${icon(ADVICE_ICONS[i % ADVICE_ICONS.length])}</span>
            <h3>${esc(g.title)}</h3>
            <ul class="advice-list">${g.items.map((it) => `<li>${icon("check")}<span>${esc(it)}</span></li>`).join("")}</ul>
          </section>`).join("")}
      </div>`;
  }

  function pageNotFound() {
    return `<div class="narrow" style="padding-top:3rem"><h1>Sayfa bulunamadı</h1><p><a href="#/">Yol haritasına dön</a></p></div>`;
  }

  /* ================= Yönlendirme ================= */
  const ALIASES = { mufredat: "ogren", tavsiyeler: "rehber", "icerik-motoru": "uret" };
  const NAV_OF = { "": "home", faz: "home", ogren: "ogren", modul: "ogren", atolye: "uygula", uret: "uret", panel: "uret", rehber: "rehber" };

  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    let [page, param] = hash.split("/");
    if (ALIASES[page]) page = ALIASES[page];
    let html;
    switch (page) {
      case "": html = pageHome(); break;
      case "faz": html = pagePhase(param); break;
      case "ogren": html = pageCurriculum(); break;
      case "modul": html = pageModule(param); break;
      case "atolye": html = pageWorkshop(); break;
      case "uret": html = pageEngine(); break;
      case "panel": html = `${sectionHeader("uret", "Üret · Panel", "İçerik paneli", "Taslakları düzenle, onayla ve planla. Fikir havuzunu besle, marka profilini güncelle.")}<div id="panel-root" class="panel-wrap"></div>`; break;
      case "rehber": html = pageAdvice(); break;
      default: html = pageNotFound();
    }
    const sec = NAV_OF[page] || "home";
    document.body.dataset.section = sec;
    onDataChange = null;
    app.innerHTML = html;
    bindInputs(app);
    afterRender(page, param);

    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === sec));
    document.getElementById("nav").classList.remove("open");
    window.scrollTo(0, 0);
    const h1 = app.querySelector("h1");
    document.title = h1 && page ? `${h1.textContent.trim()} · Marka Laboratuvarı` : "Marka Laboratuvarı";
  }

  function afterRender(page, param) {
    // Görev kutucukları (ana sayfa ve faz sayfası)
    app.querySelectorAll("[data-task]").forEach((cb) => cb.addEventListener("change", () => {
      if (cb.checked) state.phases[cb.dataset.task] = true;
      else delete state.phases[cb.dataset.task];
      save();
      cb.closest(".task").classList.toggle("done", cb.checked);
      if (page === "faz") {
        const p = PHASES.find((x) => String(x.id) === String(param));
        const pr = phaseProgress(p);
        document.getElementById("phase-pct").innerHTML = `${icon("flag")} %${pr} tamam`;
        document.getElementById("phase-bar").innerHTML = bar(pr);
        app.querySelectorAll(".task-group").forEach((g) => {
          const boxes = g.querySelectorAll("[data-task]");
          g.querySelector(".tg-head .small").textContent = `${[...boxes].filter((b) => b.checked).length}/${boxes.length}`;
        });
      } else if (page === "") {
        setTimeout(route, 350); // "Şimdi" kartını sıradaki görevlerle yenile
      }
    }));

    if (page === "modul") {
      const m = MODULES.find((x) => x.id === param);
      if (m && m.status === "ready") {
        const step = activeStep[m.id] || "oku";
        if (step === "oku" || step === "test" || step === "kaynak") { state.progress[m.id].seen[step] = true; save(); }
        onDataChange = () => refreshStepper(m, activeStep[m.id] || "oku");
        wireStep(m);
        renderStepNav(m, step);
        refreshStepper(m, step);
        app.querySelector(".stepper").addEventListener("click", (e) => {
          const b = e.target.closest("[data-step]");
          if (b) showStep(m, b.dataset.step);
        });
        document.getElementById("step-nav").addEventListener("click", (e) => {
          const b = e.target.closest("[data-goto]");
          if (!b) return;
          showStep(m, b.dataset.goto);
          document.querySelector(".stepper").scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }

    if (page === "atolye") {
      refreshWorkshopMeta();
      onDataChange = refreshWorkshopMeta;
      document.getElementById("export-md").addEventListener("click", () =>
        download("marka-profili.md", workshopMarkdown(), "text/markdown;charset=utf-8"));
      document.getElementById("export-json").addEventListener("click", () =>
        download(`markalab-yedek-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), "application/json"));
      document.getElementById("import-json").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        file.text().then((txt) => {
          try {
            const d = JSON.parse(txt);
            state = { progress: d.progress || {}, workshop: d.workshop || {}, phases: d.phases || {} };
            save();
            route();
            alert("Yedek geri yüklendi.");
          } catch (err) {
            alert("Dosya okunamadı. Geçerli bir yedek dosyası seçtiğinden emin ol.");
          }
        });
      });
    }

    if (page === "panel") window.MarkaPanel.mount(document.getElementById("panel-root"));
  }

  /* ================= Tema ve menü ================= */
  try {
    const t = localStorage.getItem("markalab:theme");
    if (t) document.documentElement.dataset.theme = t;
  } catch (e) { /* yok say */ }
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
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
