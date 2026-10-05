"""Yayıncı.

Panelde onaylanmış ve zamanı gelmiş taslakları X'te paylaşır.
X anahtarları henüz tanımlı değilse sessizce çıkar; böylece sistem
X API'si olmadan da (taslak + onay akışıyla) kullanılabilir.
"""

import html
from datetime import datetime, timezone

import requests
from requests_oauthlib import OAuth1

from common import Supabase, env, mail_configured, send_mail

X_POST_URL = "https://api.x.com/2/tweets"


def x_auth():
    keys = [env(k) for k in ("X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET")]
    if not all(keys):
        return None
    return OAuth1(*keys)


def post_to_x(auth, text):
    r = requests.post(X_POST_URL, auth=auth, json={"text": text}, timeout=30)
    if r.status_code >= 400:
        raise RuntimeError(f"X API {r.status_code}: {r.text[:300]}")
    return r.json()["data"]["id"]


def texts_for(draft):
    lang = draft["publish_lang"]
    out = []
    if lang in ("tr", "both"):
        out.append(("tr", draft["content_tr"]))
    if lang in ("en", "both") and draft.get("content_en"):
        out.append(("en", draft["content_en"]))
    return out


def main():
    auth = x_auth()
    if auth is None:
        print("X anahtarları tanımlı değil; yayın adımı atlandı.")
        return
    dry_run = env("DRY_RUN", default="false").lower() == "true"

    db = Supabase()
    now = datetime.now(timezone.utc).isoformat()
    due = db.select("drafts", {
        "select": "*",
        "status": "eq.approved",
        "platform": "eq.x",
        "scheduled_at": f"lte.{now}",
        "order": "scheduled_at.asc",
        "limit": "5",
    })
    if not due:
        print("Zamanı gelen onaylı taslak yok.")
        return

    failures = []
    for d in due:
        ids = {}
        try:
            for lang, text in texts_for(d):
                ids[lang] = "dry-run" if dry_run else post_to_x(auth, text)
            db.update("drafts", {"id": f"eq.{d['id']}"}, {
                "status": "published",
                "published_at": datetime.now(timezone.utc).isoformat(),
                "external_ids": ids,
                "error": None,
            })
            print(f"Yayınlandı: {d['id']} {ids}")
        except Exception as e:  # bir taslağın hatası diğerlerini durdurmasın
            db.update("drafts", {"id": f"eq.{d['id']}"}, {
                "status": "failed",
                "external_ids": ids or None,
                "error": str(e)[:500],
            })
            failures.append((d, str(e)))
            print(f"Hata: {d['id']} {e}")

    if failures and mail_configured():
        items = "".join(
            f"<li><p>{html.escape(d['content_tr'])}</p><p style='color:#b91c1c'>{html.escape(err)}</p></li>"
            for d, err in failures
        )
        send_mail(
            f"MarkaLab: {len(failures)} gönderi yayınlanamadı",
            f"<div style='font-family:Segoe UI,Arial,sans-serif'><h3>Yayınlanamayan gönderiler</h3><ul>{items}</ul></div>",
            "\n\n".join(f"{d['content_tr']}\nHata: {err}" for d, err in failures),
        )


if __name__ == "__main__":
    main()
