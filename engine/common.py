"""İçerik motorunun ortak yardımcıları: ayarlar, Supabase REST erişimi ve e-posta."""

import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests


def env(name, default=None, required=False):
    value = os.environ.get(name, "").strip() or default
    if required and not value:
        sys.exit(f"Eksik ayar: {name}. GitHub → Settings → Secrets and variables → Actions altına ekle.")
    return value


class Supabase:
    """Supabase'in REST (PostgREST) arayüzü için ince bir sarmalayıcı.

    service_role anahtarı kullanılır; bu anahtar yalnızca GitHub Secrets'ta durur,
    asla siteye ya da koda konmaz.
    """

    def __init__(self):
        self.base = env("SUPABASE_URL", required=True).rstrip("/") + "/rest/v1"
        key = env("SUPABASE_SERVICE_KEY", required=True)
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }

    def select(self, table, params):
        r = requests.get(f"{self.base}/{table}", headers=self.headers, params=params, timeout=30)
        r.raise_for_status()
        return r.json()

    def insert(self, table, rows):
        r = requests.post(
            f"{self.base}/{table}",
            headers={**self.headers, "Prefer": "return=representation"},
            json=rows,
            timeout=30,
        )
        r.raise_for_status()
        return r.json()

    def update(self, table, filters, values):
        r = requests.patch(
            f"{self.base}/{table}",
            headers={**self.headers, "Prefer": "return=minimal"},
            params=filters,
            json=values,
            timeout=30,
        )
        r.raise_for_status()


def mail_configured():
    return bool(env("GMAIL_USER") and env("GMAIL_APP_PASSWORD"))


def send_mail(subject, html, text):
    """Gmail SMTP üzerinden gönderir. Gmail'de 2 adımlı doğrulama ve uygulama şifresi gerekir."""
    user = env("GMAIL_USER", required=True)
    password = env("GMAIL_APP_PASSWORD", required=True)
    to = env("NOTIFY_EMAIL", default=user)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"MarkaLab <{user}>"
    msg["To"] = to
    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as smtp:
        smtp.login(user, password.replace(" ", ""))
        smtp.sendmail(user, [to], msg.as_string())
