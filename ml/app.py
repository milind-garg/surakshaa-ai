from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import functools
import os

app = Flask(__name__)

# LOW-3: CORS origins driven by env var — localhost excluded in production.
# Dev: set FLASK_DEBUG=true (localhost auto-added)
# Prod: set ALLOWED_ORIGINS=https://surakshaa-ai.vercel.app
_debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
_prod_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "https://surakshaa-ai.vercel.app").split(",") if o.strip()]
_dev_origins  = ["http://localhost:3000", "http://127.0.0.1:3000"]
_allowed_origins = (_prod_origins + _dev_origins) if _debug_mode else _prod_origins

CORS(app, origins=_allowed_origins)

# ── Internal Secret Auth ──────────────────────────────────────
# CRIT-1: All ML routes require X-Internal-Secret header from the Next.js server.
# ML_INTERNAL_SECRET must be set in the environment and match NEXT_PUBLIC_APP_URL caller.
_ML_SECRET = os.environ.get("ML_INTERNAL_SECRET", "")

def require_internal_secret(f):
    """Decorator: rejects requests missing or with wrong X-Internal-Secret header."""
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if _ML_SECRET and request.headers.get("X-Internal-Secret") != _ML_SECRET:
            return jsonify({"error": "Forbidden"}), 403
        return f(*args, **kwargs)
    return decorated


recommender = None

def get_recommender():
    global recommender
    if recommender is None:
        from recommender import get_recommendations
        recommender = get_recommendations
    return recommender

# ── Root route ────────────────────────────────────────────────
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "service": "Suraksha AI ML Service",
        "status":  "running",
        "version": "1.0.0",
        "routes": {
            "GET  /health":     "Health check",
            "POST /recommend":  "Get policy recommendations",
            "POST /score":      "Get charge prediction",
        }
    })

# ── Health check ──────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status":  "ok",
        "service": "Suraksha AI ML Service",
    })

# ── Recommendations ───────────────────────────────────────────
@app.route('/recommend', methods=['POST'])
@require_internal_secret
def recommend():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        profile = data.get('profile', {})
        # HIGH-1: Clamp top_n to prevent resource exhaustion / DoS
        top_n   = min(max(1, int(data.get('top_n', 5))), 20)

        if not profile:
            return jsonify({"error": "Profile is required"}), 400

        safe_profile = {
            'age':               float(profile.get('age', 30)),
            'gender':            str(profile.get('gender', profile.get('sex', 'male'))).lower(),
            'bmi':               float(profile.get('bmi', 25.0)),
            'children':          int(profile.get('children', 0)),
            'smoker':            profile.get('smoker', False),
            'region':            str(profile.get('region', 'north')).lower(),
            'annual_income':     float(profile.get('annual_income', 300000)),
            'health_conditions': profile.get('health_conditions', []),
            'exercise_frequency': profile.get('exercise_frequency', 'Occasionally'),
            'occupation':        profile.get('occupation', 'White collar'),
        }

        recommend_fn    = get_recommender()
        recommendations = recommend_fn(safe_profile, top_n)

        return jsonify({
            "success":         True,
            "profile":         safe_profile,
            "recommendations": recommendations,
            "count":           len(recommendations),
        })

    except Exception as e:
        traceback.print_exc()  # CRIT-2: log full exception server-side only
        return jsonify({"error": "Internal server error", "success": False}), 500


# ── Score single profile ──────────────────────────────────────
@app.route('/score', methods=['POST'])
@require_internal_secret
def score_single():
    try:
        from recommender import predict_charge, get_user_segment
        data    = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        profile = data.get('profile', {})
        if not profile:
            return jsonify({"error": "Profile is required"}), 400
        # MED-3: Sanitize inputs before passing to ML functions
        safe_profile = {
            'age':                float(profile.get('age', 30)),
            'gender':             str(profile.get('gender', profile.get('sex', 'male'))).lower(),
            'bmi':                float(profile.get('bmi', 25.0)),
            'children':           int(profile.get('children', 0)),
            'smoker':             bool(profile.get('smoker', False)),
            'region':             str(profile.get('region', 'north')).lower(),
            'annual_income':      float(profile.get('annual_income', 300000)),
            'health_conditions':  profile.get('health_conditions', []),
            'exercise_frequency': profile.get('exercise_frequency', 'Occasionally'),
            'occupation':         profile.get('occupation', 'White collar'),
        }
        charge  = predict_charge(safe_profile)
        segment = get_user_segment(safe_profile)
        return jsonify({
            "predicted_charge": round(charge, 2),
            "user_segment":     segment,
        })
    except Exception as e:
        traceback.print_exc()  # CRIT-2: log server-side, don't expose to client
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'

    print(f"\n[Suraksha AI ML Service]")
    print(f"   Running at: http://localhost:{port}")
    print(f"   Routes:")
    print(f"     GET  http://localhost:{port}/health")
    print(f"     POST http://localhost:{port}/recommend")
    print(f"     POST http://localhost:{port}/score")
    print(f"\n   Press Ctrl+C to stop\n")

    if debug_mode:
        # Development: use Flask's built-in server (auto-reload, debug UI)
        # Bound to localhost only — never expose dev server to network
        print(f"   Mode: Flask dev server (FLASK_DEBUG=true)\n")
        app.run(host='127.0.0.1', port=port, debug=True)
    else:
        # Production: use waitress (multi-threaded, production-grade WSGI, Windows-compatible)
        # For Linux/Docker: replace with gunicorn -w 4 -b 127.0.0.1:{port} app:app
        try:
            from waitress import serve
            print(f"   Mode: waitress WSGI server (production, 4 threads)\n")
            serve(app, host='127.0.0.1', port=port, threads=4)
        except ImportError:
            print("   [WARNING] waitress not installed. Falling back to Flask dev server.")
            print("   Run: pip install waitress\n")
            app.run(host='127.0.0.1', port=port, debug=False)