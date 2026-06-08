"""
Gateway mock da cozinha conectada — 4 sensores simulados.

Sensores (lab IHM):
  1. pan     → Potenciômetro slider no Pico W (temperatura panela)
  2. ambient → DHT11 na Micro:bit (temp/umidade ambiente)
  3. color   → TCS3200 na Micro:bit (claro → dourado → escuro → queimado)
  4. sound   → Sensor de som no Pico W (chiado/estalo)

Uso:
  pip install flask flask-cors
  python server/kitchen/server.py

Demo com valores simulados:
  GET /status
  GET /status?pan=52&ambient=27&humidity=58&color=golden&sound=25
  GET /status?pan=55&color=burned&sound=85
"""

from __future__ import annotations

import sys

from flask import Flask, jsonify, request
from flask_cors import CORS

PORT = 8770
AMBIENT_HEAT_ALERT_CELSIUS = 35
SOUND_ALERT_LEVEL = 70
COLOR_ALERT_LEVELS = {"dark", "burned"}
VALID_COLOR_LEVELS = {"light", "golden", "dark", "burned"}


app = Flask(__name__)
CORS(app)


def build_status(
    pan_celsius: float = 52,
    ambient_celsius: float = 27,
    humidity: float = 58,
    color_level: str = "golden",
    sound_level: float = 25,
    state: str = "idle",
) -> dict:
    if color_level not in VALID_COLOR_LEVELS:
        color_level = "golden"

    pan_alert = pan_celsius > 40
    ambient_alert = ambient_celsius >= AMBIENT_HEAT_ALERT_CELSIUS
    color_alert = color_level in COLOR_ALERT_LEVELS
    sound_alert = sound_level >= SOUND_ALERT_LEVEL
    has_alert = pan_alert or ambient_alert or color_alert or sound_alert

    return {
        "online": True,
        "temperature": pan_celsius,
        "state": "alert" if has_alert else state,
        "sensors": {
            "pan": {
                "id": "slider",
                "celsius": pan_celsius,
                "alert": pan_alert,
            },
            "ambient": {
                "id": "dht11",
                "celsius": ambient_celsius,
                "humidity": humidity,
                "alert": ambient_alert,
            },
            "color": {
                "id": "tcs3200",
                "level": color_level,
                "alert": color_alert,
            },
            "sound": {
                "id": "sound",
                "level": round(min(100, max(0, sound_level))),
                "alert": sound_alert,
            },
        },
    }


@app.get("/health")
def health():
    return jsonify({"ok": True, "sensors": ["pan", "ambient", "color", "sound"]})


@app.get("/status")
def status():
    pan = request.args.get("pan", type=float, default=52.0)
    ambient = request.args.get("ambient", type=float, default=27.0)
    humidity = request.args.get("humidity", type=float, default=58.0)
    color = request.args.get("color", default="golden")
    sound = request.args.get("sound", type=float, default=25.0)
    state = request.args.get("state", default="idle")

    return jsonify(build_status(pan, ambient, humidity, color, sound, state))


if __name__ == "__main__":
    print(f"Kitchen gateway on http://0.0.0.0:{PORT}", file=sys.stderr)
    print("Try: /status?pan=55&color=burned&sound=85", file=sys.stderr)
    app.run(host="0.0.0.0", port=PORT, debug=False)
