/* İçerik motoru onay paneli: taslakları düzenle, onayla, planla; fikir havuzu ve marka profili. */
(function () {
  "use strict";

  const CFG = window.MARKALAB_CONFIG || {};
  const SUPABASE_JS = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  const X_LIMIT = 280;
  const esc = (s) => window.MarkaLab.esc(s == null ? "" : s);

  let client = null;
  let root = null;
  let tab = "pending";

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (window.supabase) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Supabase kütüphanesi yüklenemedi."));
      document.head.appendChild(s);
    });
  }

  async function getClient() {
    if (client) return client;
    await loadScript(SUPABASE_JS);
    client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true }
    });
    return client;
  }

  const configured = () => Boolean(CFG.supabaseUrl && CFG.supabaseAnonKey);

  /* ---------- Yardımcılar ---------- */
  function nextSlot() {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 2);
    return toLocalInput(d);
  }
  function toLocalInput(date) {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  const fmt = (iso) => iso ? new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" }) : "-";

  function counter(textarea) {
    const out = textarea.parentElement.querySelector(".count");
    if (!out) return;
    const n = [...textarea.value].length;
    out.textContent = `${n} / ${X_LIMIT}`;
    out.classList.toggle("over", n > X_LIMIT);
  }

  function toast(msg, isError) {
    const el = document.createElement("div");
    el.className = "toast" + (isError ? " error" : "");
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  /* ---------- Görünümler ---------- */
  function viewSetup() {
    return `
      <div class="narrow">
        <section class="hero">
          <span class="eyebrow">Panel</span>
          <h1>Panel henüz bağlanmadı</h1>
          <p class="lead">Panelin çalışması için Supabase projesinin adresi ve herkese açık (anon) anahtarı <code>assets/js/config.js</code> dosyasına yazılmalı.</p>
        </section>
        <div class="callout">Kurulum adımları README dosyasında ve İçerik Motoru sayfasında.</div>
      </div>`;
  }

  function viewLogin(sent) {
    return `
      <div class="narrow">
        <section class="hero">
          <span class="eyebrow">Panel</span>
          <h1>Giriş</h1>
          <p class="lead">E-postana tek kullanımlık bir giriş bağlantısı gönderilecek. Şifre yok.</p>
        </section>
        ${sent ? `<div class="callout">Bağlantı gönderildi. E-postanı kontrol et ve bağlantıyı <strong>bu tarayıcıda</strong> aç.</div>` : `
        <form id="login-form" class="card">
          <div class="field">
            <label for="login-email">E-posta</label>
            <input type="text" id="login-email" inputmode="email" autocomplete="email" value="${esc(CFG.ownerEmail || "")}">
          </div>
          <button class="btn" type="submit">Giriş bağlantısı gönder</button>
        </form>`}
      </div>`;
  }

  function shell(inner, email) {
    const tabs = [
      ["pending", "Onay bekleyenler"],
      ["approved", "Planlananlar"],
      ["history", "Geçmiş"],
      ["ideas", "Fikir havuzu"],
      ["profile", "Marka profili"]
    ];
    return `
      <section class="hero" style="padding-bottom:0">
        <span class="eyebrow">Panel · ${esc(email)}</span>
        <h1>İçerik motoru</h1>
      </section>
      <nav class="tabs">
        ${tabs.map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? "active" : ""}">${l}</button>`).join("")}
        <button data-action="logout" class="ghost">Çıkış</button>
      </nav>
      <div id="tab-body">${inner}</div>`;
  }

  function draftCard(d, editable) {
    const statusBadge = {
      pending: `<span class="badge accent">Onay bekliyor</span>`,
      approved: `<span class="badge ok">Planlandı · ${fmt(d.scheduled_at)}</span>`,
      published: `<span class="badge ok">Yayınlandı · ${fmt(d.published_at)}</span>`,
      rejected: `<span class="badge">Reddedildi</span>`,
      failed: `<span class="badge error">Hata</span>`
    }[d.status] || "";
    if (!editable) {
      return `
        <div class="card draft" data-id="${d.id}">
          <div class="card-meta">${statusBadge}${d.pillar ? `<span class="badge">${esc(d.pillar)}</span>` : ""}</div>
          <p class="post">${esc(d.content_tr)}</p>
          ${d.content_en ? `<p class="post muted"><strong>EN:</strong> ${esc(d.content_en)}</p>` : ""}
          ${d.error ? `<p class="error-text">${esc(d.error)}</p>` : ""}
          ${d.status === "approved" || d.status === "failed" ? `<div class="btn-row"><button class="btn secondary" data-action="unapprove">Onay bekleyenlere geri al</button></div>` : ""}
        </div>`;
    }
    return `
      <div class="card draft" data-id="${d.id}">
        <div class="card-meta">${statusBadge}${d.pillar ? `<span class="badge">${esc(d.pillar)}</span>` : ""}<span class="badge">${fmt(d.created_at)}</span></div>
        <div class="field">
          <label>Türkçe</label>
          <textarea data-f="content_tr"></textarea>
          <span class="count"></span>
        </div>
        <div class="field">
          <label>English</label>
          <textarea data-f="content_en"></textarea>
          <span class="count"></span>
        </div>
        <div class="draft-controls">
          <label>Dil
            <select data-f="publish_lang">
              <option value="tr">Sadece Türkçe</option>
              <option value="en">Sadece İngilizce</option>
              <option value="both">İkisi de (2 ayrı gönderi)</option>
            </select>
          </label>
          <label>Zaman
            <input type="datetime-local" data-f="scheduled_at" value="${nextSlot()}">
          </label>
        </div>
        <div class="btn-row">
          <button class="btn" data-action="approve">Onayla ve planla</button>
          <button class="btn secondary" data-action="save">Kaydet</button>
          <button class="btn secondary" data-action="reject">Reddet</button>
        </div>
      </div>`;
  }

  async function renderTab() {
    const body = root.querySelector("#tab-body");
    body.innerHTML = `<p class="muted">Yükleniyor…</p>`;
    try {
      if (tab === "pending" || tab === "approved" || tab === "history") {
        const statuses = { pending: ["pending"], approved: ["approved"], history: ["published", "rejected", "failed"] }[tab];
        const order = tab === "approved" ? { col: "scheduled_at", asc: true } : { col: "created_at", asc: false };
        const { data, error } = await client.from("drafts").select("*").in("status", statuses)
          .order(order.col, { ascending: order.asc }).limit(50);
        if (error) throw error;
        if (!data.length) {
          body.innerHTML = `<p class="muted">${tab === "pending" ? "Onay bekleyen taslak yok. Yeni taslaklar GitHub Actions'taki 'Taslak üret' iş akışıyla gelir." : "Burada henüz bir şey yok."}</p>`;
          return;
        }
        body.innerHTML = `<div class="grid">${data.map((d) => draftCard(d, tab === "pending")).join("")}</div>`;
        if (tab === "pending") {
          data.forEach((d) => {
            const card = body.querySelector(`[data-id="${d.id}"]`);
            card.querySelector('[data-f="content_tr"]').value = d.content_tr || "";
            card.querySelector('[data-f="content_en"]').value = d.content_en || "";
            card.querySelector('[data-f="publish_lang"]').value = d.publish_lang || "tr";
            card.querySelectorAll("textarea").forEach((t) => { counter(t); t.addEventListener("input", () => counter(t)); });
          });
        }
      } else if (tab === "ideas") {
        const { data, error } = await client.from("ideas").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        body.innerHTML = `
          <form id="idea-form" class="card">
            <div class="field">
              <label for="idea-text">Yeni fikir</label>
              <div class="hint">Öğrendiğin bir kavram, sahadan bir gözlem, ödevden bir içgörü. Müşteri adı yazma; yazsan da taslakta anonimleştirilir.</div>
              <textarea id="idea-text" required></textarea>
            </div>
            <div class="field">
              <label for="idea-pillar">İçerik sütunu (isteğe bağlı)</label>
              <input type="text" id="idea-pillar">
            </div>
            <button class="btn" type="submit">Fikir havuzuna ekle</button>
          </form>
          <h3 style="margin-top:1.5rem">Havuz</h3>
          <ul class="res-list">${data.map((i) => `
            <li data-idea="${i.id}">
              <div class="card-meta">${i.used_at ? `<span class="badge ok">Kullanıldı</span>` : `<span class="badge accent">Bekliyor</span>`}${i.pillar ? `<span class="badge">${esc(i.pillar)}</span>` : ""}</div>
              <div>${esc(i.text)}</div>
              <button class="link-btn" data-action="delete-idea">Sil</button>
            </li>`).join("") || `<li class="muted">Havuz boş.</li>`}</ul>`;
      } else if (tab === "profile") {
        const { data, error } = await client.from("profile").select("content,updated_at").eq("id", 1).maybeSingle();
        if (error) throw error;
        body.innerHTML = `
          <div class="card">
            <p class="muted">Yapay zekâ her taslakta bu profili okur. Son güncelleme: ${fmt(data && data.updated_at)}</p>
            <div class="field">
              <textarea id="profile-text" style="min-height:360px"></textarea>
            </div>
            <div class="btn-row">
              <button class="btn" data-action="save-profile">Kaydet</button>
              <button class="btn secondary" data-action="fill-profile">Atölye'deki profille doldur</button>
            </div>
          </div>`;
        body.querySelector("#profile-text").value = (data && data.content) || "";
      }
    } catch (err) {
      body.innerHTML = `<div class="callout">Veri alınamadı: ${esc(err.message || err)}</div>`;
    }
  }

  /* ---------- Olaylar ---------- */
  async function onClick(e) {
    const btn = e.target.closest("button");
    if (!btn || !root.contains(btn)) return;

    if (btn.dataset.tab) {
      tab = btn.dataset.tab;
      root.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b === btn));
      return renderTab();
    }
    const action = btn.dataset.action;
    if (!action) return;
    if (action === "logout") {
      await client.auth.signOut();
      return mount(root);
    }

    btn.disabled = true;
    try {
      const card = btn.closest(".draft");
      const id = card && card.dataset.id;
      const val = (f) => card.querySelector(`[data-f="${f}"]`).value;

      if (action === "approve" || action === "save") {
        const values = {
          content_tr: val("content_tr").trim(),
          content_en: val("content_en").trim(),
          publish_lang: val("publish_lang")
        };
        if (action === "approve") {
          const when = val("scheduled_at");
          if (!when) throw new Error("Paylaşım zamanını seç.");
          const texts = values.publish_lang === "en" ? [values.content_en]
            : values.publish_lang === "both" ? [values.content_tr, values.content_en] : [values.content_tr];
          if (texts.some((t) => !t)) throw new Error("Seçtiğin dildeki metin boş.");
          if (texts.some((t) => [...t].length > X_LIMIT)) throw new Error("Metin 280 karakteri aşıyor.");
          values.status = "approved";
          values.scheduled_at = new Date(when).toISOString();
        }
        const { error } = await client.from("drafts").update(values).eq("id", id);
        if (error) throw error;
        toast(action === "approve" ? "Onaylandı ve planlandı." : "Kaydedildi.");
        if (action === "approve") card.remove();
      } else if (action === "reject") {
        const { error } = await client.from("drafts").update({ status: "rejected" }).eq("id", id);
        if (error) throw error;
        card.remove();
        toast("Reddedildi.");
      } else if (action === "unapprove") {
        const { error } = await client.from("drafts").update({ status: "pending", error: null }).eq("id", id);
        if (error) throw error;
        card.remove();
        toast("Onay bekleyenlere taşındı.");
      } else if (action === "delete-idea") {
        const li = btn.closest("[data-idea]");
        const { error } = await client.from("ideas").delete().eq("id", li.dataset.idea);
        if (error) throw error;
        li.remove();
      } else if (action === "save-profile") {
        const content = root.querySelector("#profile-text").value;
        const { error } = await client.from("profile").update({ content, updated_at: new Date().toISOString() }).eq("id", 1);
        if (error) throw error;
        toast("Marka profili kaydedildi.");
      } else if (action === "fill-profile") {
        const ta = root.querySelector("#profile-text");
        if (ta.value.trim() && !confirm("Mevcut metnin yerine Atölye'deki profil yazılsın mı?")) return;
        ta.value = window.MarkaLab.workshopMarkdown();
        toast("Atölye'den dolduruldu. Kaydetmeyi unutma.");
      }
    } catch (err) {
      toast(err.message || String(err), true);
    } finally {
      btn.disabled = false;
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (e.target.id === "login-form") {
      const email = root.querySelector("#login-email").value.trim();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true }
      });
      if (error) return toast(error.message, true);
      root.innerHTML = viewLogin(true);
    } else if (e.target.id === "idea-form") {
      const text = root.querySelector("#idea-text").value.trim();
      const pillar = root.querySelector("#idea-pillar").value.trim() || null;
      if (!text) return;
      const { error } = await client.from("ideas").insert({ text, pillar });
      if (error) return toast(error.message, true);
      toast("Fikir eklendi.");
      renderTab();
    }
  }

  async function mount(el) {
    root = el;
    if (!configured()) { root.innerHTML = viewSetup(); return; }
    root.innerHTML = `<p class="muted">Yükleniyor…</p>`;
    try {
      await getClient();
    } catch (err) {
      root.innerHTML = `<div class="callout">${esc(err.message)}</div>`;
      return;
    }
    if (!root._bound) {
      root.addEventListener("click", onClick);
      root.addEventListener("submit", onSubmit);
      root._bound = true;
    }
    const { data } = await client.auth.getSession();
    const session = data.session;
    if (!session) { root.innerHTML = viewLogin(false); return; }
    root.innerHTML = shell("", session.user.email);
    renderTab();
  }

  // Giriş bağlantısından dönüşte (?code=...) oturumu kur ve panele geç
  async function handleAuthRedirect() {
    const params = new URLSearchParams(location.search);
    if (!params.has("code") || !configured()) return false;
    await getClient();
    await client.auth.getSession(); // detectSessionInUrl kodu oturuma çevirir
    history.replaceState(null, "", location.pathname + "#/panel");
    return true;
  }

  window.MarkaPanel = { mount, handleAuthRedirect };
})();
