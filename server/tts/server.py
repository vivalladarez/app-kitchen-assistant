"""
Servidor TTS local para o Cozinha Assistida (Opção A — edge-tts).

Uso:
  pip install -r requirements.txt
  python server.py

O app chama: GET http://IP-DO-PC:8765/speak?text=...&voice=jacquin
"""

from __future__ import annotations

import asyncio
import hashlib
import sys
from pathlib import Path

import edge_tts
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

PORT = 8765
CACHE_DIR = Path(__file__).parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

# voice profile -> (edge voice id, rate)
VOICES: dict[str, tuple[str, str]] = {
    "jacquin": ("pt-BR-AntonioNeural", "-8%"),
    "louro-jose": ("pt-BR-AntonioNeural", "-18%"),
    "paola-carosella": ("pt-BR-FranciscaNeural", "+0%"),
    "palmirinha": ("pt-BR-FranciscaNeural", "-10%"),
    "remy": ("pt-BR-AntonioNeural", "+8%"),
    "linguini": ("pt-BR-AntonioNeural", "+4%"),
}

app = Flask(__name__)
CORS(app)


def cache_path(text: str, profile: str, voice_id: str, rate: str) -> Path:
    key = hashlib.sha256(f"{text}|{profile}|{voice_id}|{rate}".encode()).hexdigest()
    return CACHE_DIR / f"{key}.mp3"


async def synthesize(text: str, profile: str) -> Path:
    voice_id, rate = VOICES.get(profile, VOICES["palmirinha"])
    output = cache_path(text, profile, voice_id, rate)

    if output.exists():
        return output

    communicate = edge_tts.Communicate(text, voice_id, rate=rate)
    await communicate.save(str(output))
    return output


@app.get("/health")
def health():
    return jsonify({"ok": True, "voices": list(VOICES.keys())})


@app.get("/speak")
def speak():
    text = request.args.get("text", "").strip()
    profile = request.args.get("voice", "palmirinha").strip()

    if not text:
        return jsonify({"error": "text is required"}), 400

    if profile not in VOICES:
        profile = "palmirinha"

    try:
        path = asyncio.run(synthesize(text, profile))
        return send_file(path, mimetype="audio/mpeg")
    except Exception as exc:  # noqa: BLE001 — demo server
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    print(f"TTS server on http://0.0.0.0:{PORT}", file=sys.stderr)
    print("Test: http://localhost:8765/health", file=sys.stderr)
    app.run(host="0.0.0.0", port=PORT, debug=False)
