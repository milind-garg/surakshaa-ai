from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://*.vercel.app"])

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
def recommend():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        profile = data.get('profile', {})
        top_n   = int(data.get('top_n', 5))

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
        traceback.print_exc()
        return jsonify({"error": str(e), "success": False}), 500


# ── Score single profile ──────────────────────────────────────
@app.route('/score', methods=['POST'])
def score_single():
    try:
        from recommender import predict_charge, get_user_segment
        data    = request.get_json()
        profile = data.get('profile', {})
        charge  = predict_charge(profile)
        segment = get_user_segment(profile)
        return jsonify({
            "predicted_charge": round(charge, 2),
            "user_segment":     segment,
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"\n🚀 Suraksha AI ML Service")
    print(f"   Running at: http://localhost:{port}")
    print(f"   Routes:")
    print(f"     GET  http://localhost:{port}/health")
    print(f"     POST http://localhost:{port}/recommend")
    print(f"     POST http://localhost:{port}/score")
    print(f"\n   Press Ctrl+C to stop\n")
    app.run(host='0.0.0.0', port=port, debug=True)