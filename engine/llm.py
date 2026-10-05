"""Yapay zekâ sağlayıcı katmanı.

Varsayılan sağlayıcı Gemini'dir (ücretsiz katman). Claude'a geçmek için:
  1) GitHub Secrets'a ANTHROPIC_API_KEY ekle
  2) GitHub Variables'a LLM_PROVIDER = claude ekle
Başka hiçbir değişiklik gerekmez.
"""

import json
import sys

import requests

from common import env

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
GEMINI_DEFAULT_MODELS = ["gemini-2.5-flash", "gemini-flash-latest"]
CLAUDE_MODEL = "claude-opus-5-5"


def provider():
    return (env("LLM_PROVIDER", default="gemini") or "gemini").lower()


def generate_json(system, prompt, schema):
    """Sistem talimatı + istemi gönderir, şemaya uyan JSON nesnesini döndürür."""
    p = provider()
    if p == "gemini":
        return _gemini(system, prompt, schema)
    if p == "claude":
        return _claude(system, prompt, schema)
    sys.exit(f"Bilinmeyen LLM_PROVIDER: {p}. 'gemini' ya da 'claude' olmalı.")


# ---------------- Gemini ----------------

def _to_gemini_schema(schema):
    """JSON Schema'yı Gemini'nin responseSchema biçimine çevirir (additionalProperties desteklenmez)."""
    out = {"type": schema["type"].upper()}
    if "description" in schema:
        out["description"] = schema["description"]
    if "properties" in schema:
        out["properties"] = {k: _to_gemini_schema(v) for k, v in schema["properties"].items()}
        out["propertyOrdering"] = list(schema["properties"].keys())
    if "required" in schema:
        out["required"] = schema["required"]
    if "items" in schema:
        out["items"] = _to_gemini_schema(schema["items"])
    return out


def _gemini(system, prompt, schema):
    key = env("GEMINI_API_KEY", required=True)
    custom = env("GEMINI_MODEL")
    models = [custom] if custom else GEMINI_DEFAULT_MODELS
    body = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": _to_gemini_schema(schema),
            "temperature": 0.9,
        },
    }
    last_error = None
    for model in models:
        r = requests.post(
            GEMINI_URL.format(model=model),
            headers={"x-goog-api-key": key, "Content-Type": "application/json"},
            json=body,
            timeout=120,
        )
        if r.status_code == 404:  # model adı değişmiş olabilir; sıradakini dene
            last_error = f"{model}: bulunamadı"
            continue
        if r.status_code == 429:
            sys.exit("Gemini ücretsiz kota sınırına takıldı. Biraz sonra tekrar dene.")
        if r.status_code >= 400:
            sys.exit(f"Gemini hatası {r.status_code}: {r.text[:400]}")
        data = r.json()
        candidates = data.get("candidates") or []
        if not candidates:
            sys.exit(f"Gemini yanıt üretmedi: {json.dumps(data.get('promptFeedback', {}), ensure_ascii=False)}")
        cand = candidates[0]
        if cand.get("finishReason") not in (None, "STOP"):
            sys.exit(f"Gemini yanıtı tamamlanmadı: {cand.get('finishReason')}")
        text = "".join(p.get("text", "") for p in cand["content"]["parts"] if not p.get("thought"))
        print(f"Model: gemini/{model}")
        return json.loads(text)
    sys.exit(f"Uygun Gemini modeli bulunamadı ({last_error}). GEMINI_MODEL değişkenini güncelle.")


# ---------------- Claude ----------------

def _claude(system, prompt, schema):
    import anthropic  # yalnızca Claude seçiliyken gerekir

    env("ANTHROPIC_API_KEY", required=True)
    client = anthropic.Anthropic()
    response = client.beta.messages.create(
        model=env("CLAUDE_MODEL", default=CLAUDE_MODEL),
        max_tokens=16000,
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        thinking={"type": "adaptive"},
        output_config={"effort": "high", "format": {"type": "json_schema", "schema": schema}},
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    if response.stop_reason == "refusal":
        sys.exit("Model isteği reddetti. Marka profilini ve fikir havuzunu kontrol et.")
    if response.stop_reason == "max_tokens":
        sys.exit("Yanıt yarıda kesildi. DRAFT_COUNT değerini düşürmeyi dene.")
    text = [b.text for b in response.content if b.type == "text"][-1]
    print(f"Model: claude/{response.model}")
    return json.loads(text)
