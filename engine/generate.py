"""Taslak üretici.

Marka profilini, fikir havuzunu ve son paylaşımları okur; yapay zekâ ile
(varsayılan Gemini, istenirse Claude) Türkçe öncelikli ve İngilizce gönderi
taslakları üretir; Supabase'e kaydeder ve e-postayla gönderir.
Hiçbir şey onaysız yayınlanmaz.
"""

import html
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

from common import Supabase, env, mail_configured, send_mail
from llm import generate_json

X_LIMIT = 280

SYSTEM_PROMPT = """Sen, bir kişinin kişisel markası için X (Twitter) gönderisi taslakları hazırlayan bir içerik editörüsün.
Taslaklar kişinin kendi sesiyle yazılmalı: aşağıdaki marka profilindeki konumlandırma, hedef kitle, ses tonu ve içerik sütunlarına sadık kal.

İlkeler:
- Her gönderi tek bir net fikir taşısın ve hedef kitleye somut bir değer versin: bir içgörü, bir ders, bir çerçeve ya da düşündüren bir soru.
- Klişe motivasyon cümleleri, abartılı iddialar, uydurma istatistikler ve uydurma anekdotlar kullanma. Sayı ya da olay ancak fikir havuzunda verilmişse kullanılabilir.
- Profildeki kırmızı çizgilere kesinlikle uy. Müşteri adı, firma adı, fiyat ya da gizli proje bilgisi yazma; fikir havuzunda geçse bile anonimleştir.
- Türkçe metin asıl metindir; doğal ve akıcı bir Türkçe kullan. İngilizce metin birebir çeviri değil, aynı fikrin İngilizce okura doğal gelen uyarlamasıdır.
- Her metin en fazla 280 karakter olsun. Hashtag kullanma ya da en fazla bir tane kullan.
- Son paylaşımlarla aynı fikri ya da aynı açılış cümlesini tekrarlama.
- Gönderileri farklı içerik sütunlarına dağıt."""

POSTS_SCHEMA = {
    "type": "object",
    "properties": {
        "posts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "pillar": {"type": "string", "description": "Gönderinin ait olduğu içerik sütunu"},
                    "idea_id": {"type": "string", "description": "Kullanılan fikrin id'si; fikir havuzundan değilse boş"},
                    "content_tr": {"type": "string"},
                    "content_en": {"type": "string"},
                    "rationale": {"type": "string", "description": "Bu gönderi neden işe yarar? Tek cümle."},
                },
                "required": ["pillar", "idea_id", "content_tr", "content_en", "rationale"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["posts"],
    "additionalProperties": False,
}


def load_profile(db):
    rows = db.select("profile", {"select": "content", "id": "eq.1"})
    content = (rows[0]["content"] if rows else "").strip()
    if not content:
        fallback = Path(__file__).with_name("brand-profile.md")
        if fallback.exists():
            content = fallback.read_text(encoding="utf-8").strip()
    if not content:
        sys.exit("Marka profili boş. Paneldeki 'Marka profili' sekmesinden profilini kaydet.")
    return content


def build_prompt(profile, ideas, recent, count):
    ideas_text = "\n".join(
        f"- [id: {i['id']}] ({i.get('pillar') or 'sütun belirtilmemiş'}) {i['text']}" for i in ideas
    ) or "(Fikir havuzu boş. Taslakları marka profilindeki içerik sütunlarından üret.)"
    recent_text = "\n".join(f"- {r['content_tr']}" for r in recent) or "(Henüz paylaşım yok.)"
    return f"""<marka_profili>
{profile}
</marka_profili>

<fikir_havuzu>
{ideas_text}
</fikir_havuzu>

<son_paylasimlar>
{recent_text}
</son_paylasimlar>

{count} adet gönderi taslağı hazırla. Fikir havuzunda fikir varsa önce onları kullan ve idea_id alanına o fikrin id'sini yaz."""


def generate(profile, ideas, recent, count):
    result = generate_json(SYSTEM_PROMPT, build_prompt(profile, ideas, recent, count), POSTS_SCHEMA)
    posts = [p for p in result.get("posts", []) if (p.get("content_tr") or "").strip()]
    if not posts:
        sys.exit("Model hiç taslak döndürmedi.")
    for p in posts:
        p.setdefault("idea_id", "")
        p.setdefault("content_en", "")
        p.setdefault("pillar", "")
    return posts


def render_email(drafts, panel_url):
    cards_html, cards_text = [], []
    for i, d in enumerate(drafts, 1):
        warn = " ⚠ 280 karakteri aşıyor" if len(d["content_tr"]) > X_LIMIT else ""
        cards_html.append(f"""
        <div style="border:1px solid #e0dbd0;border-radius:12px;padding:16px;margin:0 0 14px;background:#fff">
          <div style="font-size:12px;color:#c2410c;font-weight:600;text-transform:uppercase;letter-spacing:.05em">
            {i}. {html.escape(d.get('pillar') or '')}{warn}</div>
          <p style="font-size:16px;line-height:1.55;margin:8px 0;white-space:pre-wrap">{html.escape(d['content_tr'])}</p>
          <p style="font-size:14px;line-height:1.5;margin:8px 0;color:#6b665d;white-space:pre-wrap"><b>EN:</b> {html.escape(d.get('content_en') or '')}</p>
        </div>""")
        cards_text.append(f"{i}. [{d.get('pillar') or ''}]\nTR: {d['content_tr']}\nEN: {d.get('content_en') or ''}\n")

    html_body = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;background:#f7f5f0;padding:20px;color:#1d1b18">
      <h2 style="font-family:Georgia,serif;margin:0 0 6px">{len(drafts)} yeni taslak onay bekliyor</h2>
      <p style="color:#6b665d;margin:0 0 18px">Düzenlemek, onaylamak ve paylaşım zamanını seçmek için panele git.</p>
      {''.join(cards_html)}
      <p style="text-align:center;margin:22px 0">
        <a href="{html.escape(panel_url)}" style="background:#c2410c;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">Panelde onayla</a>
      </p>
    </div>"""
    text_body = f"{len(drafts)} yeni taslak onay bekliyor.\n\n" + "\n".join(cards_text) + f"\nPanel: {panel_url}\n"
    return html_body, text_body


def main():
    count = int(env("DRAFT_COUNT", default="5"))
    panel_url = env("PANEL_URL", default="https://mhmmdemngly.github.io/PersonalBranding/#/panel")

    db = Supabase()
    profile = load_profile(db)
    ideas = db.select("ideas", {"select": "id,text,pillar", "used_at": "is.null", "order": "created_at.asc", "limit": "10"})
    recent = db.select("drafts", {
        "select": "content_tr",
        "status": "in.(approved,published,pending)",
        "order": "created_at.desc",
        "limit": "30",
    })

    posts = generate(profile, ideas, recent, count)
    idea_ids = {i["id"] for i in ideas}
    batch_id = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M") + "-" + uuid.uuid4().hex[:6]

    rows = [{
        "batch_id": batch_id,
        "pillar": p["pillar"],
        "source": p["idea_id"] if p["idea_id"] in idea_ids else "profil",
        "content_tr": p["content_tr"].strip(),
        "content_en": p["content_en"].strip(),
    } for p in posts]
    saved = db.insert("drafts", rows)
    print(f"{len(saved)} taslak kaydedildi (batch {batch_id}).")

    used = {p["idea_id"] for p in posts if p["idea_id"] in idea_ids}
    if used:
        db.update("ideas", {"id": f"in.({','.join(used)})"}, {"used_at": datetime.now(timezone.utc).isoformat()})

    if mail_configured():
        html_body, text_body = render_email(saved, panel_url)
        send_mail(f"MarkaLab: {len(saved)} yeni taslak onay bekliyor", html_body, text_body)
        print("Taslaklar e-postayla gönderildi.")
    else:
        print("E-posta ayarları yok; taslaklar sadece panelde.")


if __name__ == "__main__":
    main()
