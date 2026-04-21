# ============================================================
# SURAKSHA AI — Recommender (Updated for actual dataset columns)
# ============================================================

import numpy as np
import joblib
import json

# ── Load Models ───────────────────────────────────────────────
try:
    rf_model = joblib.load('models/rf_model.pkl')
    gb_model = joblib.load('models/gb_model.pkl')
    scaler   = joblib.load('models/scaler.pkl')
    kmeans   = joblib.load('models/kmeans.pkl')
    with open('models/metadata.json') as f:
        metadata = json.load(f)
    POLICY_CATALOG = metadata['policy_catalog']
    ENCODERS       = metadata['encoders']
    print("✅ Models loaded successfully")
except Exception as e:
    print(f"❌ Model load error: {e}")
    raise


def safe_encode(value: str, classes: list, default: int = 0) -> int:
    """Safely encode a value using label encoder classes."""
    value = str(value).strip()
    if value in classes:
        return classes.index(value)
    # Try case-insensitive match
    lower_classes = [c.lower() for c in classes]
    if value.lower() in lower_classes:
        return lower_classes.index(value.lower())
    return default


def encode_user_profile(profile: dict) -> list:
    """Convert user profile into ML feature vector matching training columns."""

    age      = float(profile.get('age', 30))
    bmi      = float(profile.get('bmi', 25.0))
    children = float(profile.get('children', 0))

    # Gender encoding
    gender_raw = profile.get('gender', profile.get('sex', 'male'))
    gender_enc = safe_encode(gender_raw, ENCODERS['gender'])

    # Smoker encoding
    smoker_val = profile.get('smoker', False)
    if isinstance(smoker_val, bool):
        smoker_str = 'yes' if smoker_val else 'no'
    else:
        smoker_str = str(smoker_val).lower()
    smoker_enc = safe_encode(smoker_str, ENCODERS['smoker'])

    # Region encoding
    region_raw = str(profile.get('region', 'southeast')).lower()
    region_map = {
        'north': 'northwest', 'south': 'southeast',
        'east':  'northeast', 'west':  'southwest',
        'northwest': 'northwest', 'southeast': 'southeast',
        'northeast': 'northeast', 'southwest': 'southwest',
    }
    region_mapped = region_map.get(region_raw, 'southeast')
    region_enc = safe_encode(region_mapped, ENCODERS['region'])

    # Medical history encoding
    health_conditions = profile.get('health_conditions', [])
    if isinstance(health_conditions, list) and len(health_conditions) > 0:
        cond = health_conditions[0]
        # Map common conditions to dataset values
        cond_map = {
            'diabetes':           'Diabetes',
            'hypertension':       'High blood pressure',
            'high blood pressure':'High blood pressure',
            'heart disease':      'Heart disease',
            'heart':              'Heart disease',
        }
        medical_str = cond_map.get(cond.lower(), 'None')
    else:
        medical_str = 'None'
    medical_enc = safe_encode(medical_str, ENCODERS['medical'])

    # Family medical history
    family_conditions = profile.get('family_medical_history', [])
    if isinstance(family_conditions, list) and len(family_conditions) > 0:
        fam_str = 'High blood pressure'
    else:
        fam_str = 'None'
    family_enc = safe_encode(fam_str, ENCODERS['family'])

    # Exercise frequency
    exercise_raw = str(profile.get('exercise_frequency', 'Occasionally'))
    exercise_enc = safe_encode(exercise_raw, ENCODERS['exercise'])

    # Occupation encoding
    occupation_raw = str(profile.get('occupation', 'White collar'))
    occ_map = {
        'software engineer': 'White collar',
        'engineer':          'White collar',
        'doctor':            'White collar',
        'teacher':           'White collar',
        'student':           'Student',
        'unemployed':        'Unemployed',
        'labour':            'Blue collar',
        'worker':            'Blue collar',
    }
    occupation_mapped = occ_map.get(occupation_raw.lower(), 'White collar')
    occupation_enc = safe_encode(occupation_mapped, ENCODERS['occupation'])

    # Engineered features
    bmi_category = (
        0 if bmi < 18.5 else
        1 if bmi < 25   else
        2 if bmi < 30   else
        3 if bmi < 35   else 4
    )
    age_group = (
        0 if age < 25 else
        1 if age < 35 else
        2 if age < 45 else
        3 if age < 55 else
        4 if age < 65 else 5
    )
    has_condition = 1 if medical_str != 'None' else 0
    has_family    = 1 if fam_str != 'None' else 0
    is_non_exerciser = 1 if exercise_raw == 'Never' else 0

    risk_score = (
        smoker_enc * 3 +
        (1 if bmi > 30 else 0) * 2 +
        (1 if age > 50 else 0) * 2 +
        children * 0.5 +
        has_condition * 2 +
        has_family * 1 +
        is_non_exerciser * 1
    )

    health_burden = has_condition + has_family

    return [
        age, gender_enc, bmi, children,
        smoker_enc, region_enc, medical_enc,
        family_enc, exercise_enc, occupation_enc,
        bmi_category, age_group, risk_score, health_burden
    ]


def predict_charge(profile: dict) -> float:
    """Predict insurance charge for a user profile."""
    features = encode_user_profile(profile)
    scaled   = scaler.transform([features])
    rf_pred  = rf_model.predict(scaled)[0]
    gb_pred  = gb_model.predict(scaled)[0]
    return float(rf_pred * 0.6 + gb_pred * 0.4)


def get_user_segment(profile: dict) -> int:
    """Assign user to a customer segment."""
    features = encode_user_profile(profile)
    scaled   = scaler.transform([features])
    return int(kmeans.predict(scaled)[0])


def score_policy(policy: dict, profile: dict, predicted_charge: float) -> float:
    """Score a policy for a given user. Returns 0–100."""
    score = 50.0

    age             = float(profile.get('age', 30))
    income          = float(profile.get('annual_income', 300000))
    smoker          = profile.get('smoker', False)
    if isinstance(smoker, str):
        smoker = smoker.lower() == 'yes'
    bmi             = float(profile.get('bmi', 25.0))
    children        = int(profile.get('children', 0))
    health_conds    = profile.get('health_conditions', [])
    has_conditions  = len(health_conds) > 0 if isinstance(health_conds, list) else bool(health_conds)
    exercise        = str(profile.get('exercise_frequency', 'Occasionally'))

    # Age suitability
    if policy['min_age'] <= age <= policy['max_age']:
        score += 15
    elif age > policy['max_age']:
        score -= 30
    else:
        score -= 10

    # Income suitability
    if income >= policy['min_income']:
        ratio = min(income / (policy['min_income'] * 3), 1.0)
        score += ratio * 10
    else:
        score -= 20

    # Smoker handling
    if smoker and not policy['smoker_ok']:
        score -= 25
    elif smoker and policy['smoker_ok']:
        score += 5

    # BMI match
    bmi_min, bmi_max = policy['ideal_bmi_range']
    if bmi_min <= bmi <= bmi_max:
        score += 10
    else:
        score -= 5

    # Family size
    if children > 0 and policy['type'] == 'family_floater':
        score += children * policy.get('family_size_weight', 1.0) * 5
    if children > 0:
        score += policy.get('family_size_weight', 1.0) * 3

    # Charge range match
    c_min, c_max = policy['charge_range']
    if c_min <= predicted_charge <= c_max:
        score += 15
    else:
        distance = min(abs(predicted_charge - c_min), abs(predicted_charge - c_max))
        score   -= min(distance / 5000, 15)

    # Special boosts
    if age >= 60 and policy['type'] == 'senior_health':
        score += 30
    if (smoker or bmi > 35 or has_conditions) and policy['type'] == 'critical_illness':
        score += 20
    if has_conditions and policy['type'] in ['health', 'family_floater']:
        score += 10
    if exercise == 'Never' and policy['type'] == 'health':
        score += 5

    return max(0.0, min(100.0, score))


def calculate_premium(policy: dict, profile: dict) -> str:
    """Estimate annual premium in Indian Rupees."""
    base     = policy['premium_base']
    age      = float(profile.get('age', 30))
    smoker   = profile.get('smoker', False)
    if isinstance(smoker, str):
        smoker = smoker.lower() == 'yes'
    bmi      = float(profile.get('bmi', 25.0))
    children = int(profile.get('children', 0))
    income   = float(profile.get('annual_income', 300000))

    target_si = min(
        max(income * 0.5, policy['min_sum_insured']),
        policy['max_sum_insured']
    )
    si_lakhs  = target_si / 100000
    premium   = base + (si_lakhs * policy['premium_per_lakh'])

    if age > 50:    premium *= 1.5
    elif age > 40:  premium *= 1.25
    elif age > 35:  premium *= 1.1
    if smoker:      premium *= 1.3
    if bmi > 30:    premium *= 1.1
    if children > 0: premium *= (1 + children * 0.05)

    low  = int(premium * 0.85 / 100) * 100
    high = int(premium * 1.15 / 100) * 100

    if low > 100000:
        return f"₹{low/100000:.1f}L – ₹{high/100000:.1f}L/year"
    return f"₹{low:,} – ₹{high:,}/year"


def calculate_sum_insured(policy: dict, profile: dict) -> str:
    """Suggest appropriate sum insured."""
    income   = float(profile.get('annual_income', 300000))
    children = int(profile.get('children', 0))
    age      = float(profile.get('age', 30))

    recommended = max(income * 0.5, policy['min_sum_insured'])
    if children > 0: recommended *= 1.2
    if age > 50:     recommended *= 1.3
    recommended = min(recommended, policy['max_sum_insured'])

    if recommended >= 10000000:
        return f"₹{recommended/10000000:.1f} Cr"
    return f"₹{recommended/100000:.0f} Lakh"


def generate_why(policy: dict, profile: dict, score: float) -> str:
    """Generate human-readable explanation."""
    age      = int(profile.get('age', 30))
    income   = float(profile.get('annual_income', 300000))
    children = int(profile.get('children', 0))
    smoker   = profile.get('smoker', False)
    if isinstance(smoker, str):
        smoker = smoker.lower() == 'yes'
    bmi      = float(profile.get('bmi', 25.0))
    has_cond = len(profile.get('health_conditions', [])) > 0

    reasons = []

    if age >= 60 and policy['type'] == 'senior_health':
        reasons.append(f"designed for people aged {age}+")
    elif policy['min_age'] <= age <= policy['max_age']:
        reasons.append(f"perfect age fit for {age} years")

    if income >= policy['min_income'] * 2:
        reasons.append(f"suits your income of ₹{income/100000:.1f}L/year")

    if children > 0 and policy['type'] == 'family_floater':
        reasons.append(f"covers your whole family including {children} child(ren)")

    if smoker and policy['smoker_ok'] and policy['type'] == 'critical_illness':
        reasons.append("provides critical illness protection important for smokers")

    if bmi > 30 and policy['type'] in ['health', 'family_floater']:
        reasons.append("covers obesity-related health risks")

    if has_cond and policy['type'] == 'health':
        reasons.append("covers pre-existing conditions after waiting period")

    if not reasons:
        reasons.append(f"matches your risk profile with {score:.0f}% compatibility")

    return f"Recommended because it {', and '.join(reasons)}."


def get_recommendations(profile: dict, top_n: int = 5) -> list:
    """Main function — returns top N ranked policy recommendations."""
    predicted_charge = predict_charge(profile)
    user_segment     = get_user_segment(profile)

    scored = []
    for policy in POLICY_CATALOG:
        score = score_policy(policy, profile, predicted_charge)
        scored.append((policy, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:top_n]

    results = []
    for rank, (policy, score) in enumerate(top, 1):
        results.append({
            "rank":             rank,
            "policy_id":        policy['id'],
            "policy_name":      policy['name'],
            "insurer":          policy['insurer'],
            "policy_type":      policy['type'],
            "premium_estimate": calculate_premium(policy, profile),
            "sum_insured":      calculate_sum_insured(policy, profile),
            "key_features":     policy['features'],
            "match_score":      round(score, 1),
            "predicted_charge": round(predicted_charge, 2),
            "user_segment":     user_segment,
            "why_recommended":  generate_why(policy, profile, score),
        })

    return results


if __name__ == '__main__':
    # Test with a sample profile matching the new dataset columns
    test_profile = {
        'age':                    35,
        'gender':                 'male',
        'bmi':                    27.5,
        'children':               2,
        'smoker':                 False,
        'region':                 'northwest',
        'medical_history':        'Diabetes',
        'family_medical_history': 'High blood pressure',
        'exercise_frequency':     'Occasionally',
        'occupation':             'White collar',
        'annual_income':          800000,
        'health_conditions':      ['Diabetes'],
    }

    print("\nTest Profile:", test_profile)
    print("\nPredicted Charge: ₹", predict_charge(test_profile))
    print("\nTop 5 Recommendations:")
    recs = get_recommendations(test_profile)
    for r in recs:
        print(f"  #{r['rank']} {r['policy_name']} ({r['insurer']}) "
              f"— {r['match_score']}% match — {r['premium_estimate']}")