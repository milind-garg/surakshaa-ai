# ============================================================
# SURAKSHA AI — ML Model Training (Updated for actual dataset)
# ============================================================

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.cluster import KMeans
import joblib
import json
import os
import warnings
warnings.filterwarnings('ignore')

from policy_catalog import POLICY_CATALOG

print("=" * 60)
print("SURAKSHA AI — Model Training")
print("=" * 60)

# ── Step 1: Load Dataset ──────────────────────────────────────
print("\n[1/8] Loading dataset...")
df = pd.read_csv('data/insurance_dataset.csv')
print(f"  Loaded {len(df)} records")
print(f"  Columns: {list(df.columns)}")

# ── Step 2: Handle Missing Values ────────────────────────────
print("\n[2/8] Handling missing values...")
df['medical_history']        = df['medical_history'].fillna('None')
df['family_medical_history'] = df['family_medical_history'].fillna('None')
print(f"  Missing values handled.")

# ── Step 3: Encode Categorical Columns ───────────────────────
print("\n[3/8] Encoding categorical columns...")

le_gender    = LabelEncoder()
le_smoker    = LabelEncoder()
le_region    = LabelEncoder()
le_medical   = LabelEncoder()
le_family    = LabelEncoder()
le_exercise  = LabelEncoder()
le_occupation= LabelEncoder()
le_coverage  = LabelEncoder()

df['gender_enc']    = le_gender.fit_transform(df['gender'])
df['smoker_enc']    = le_smoker.fit_transform(df['smoker'])
df['region_enc']    = le_region.fit_transform(df['region'])
df['medical_enc']   = le_medical.fit_transform(df['medical_history'])
df['family_enc']    = le_family.fit_transform(df['family_medical_history'])
df['exercise_enc']  = le_exercise.fit_transform(df['exercise_frequency'])
df['occupation_enc']= le_occupation.fit_transform(df['occupation'])
df['coverage_enc']  = le_coverage.fit_transform(df['coverage_level'])

print(f"  Gender classes:    {le_gender.classes_.tolist()}")
print(f"  Smoker classes:    {le_smoker.classes_.tolist()}")
print(f"  Region classes:    {le_region.classes_.tolist()}")
print(f"  Medical classes:   {le_medical.classes_.tolist()}")
print(f"  Exercise classes:  {le_exercise.classes_.tolist()}")
print(f"  Occupation classes:{le_occupation.classes_.tolist()}")
print(f"  Coverage classes:  {le_coverage.classes_.tolist()}")

# ── Step 4: Feature Engineering ──────────────────────────────
print("\n[4/8] Engineering features...")

df['bmi_category'] = pd.cut(
    df['bmi'],
    bins=[0, 18.5, 25, 30, 35, 100],
    labels=[0, 1, 2, 3, 4]
).astype(int)

df['age_group'] = pd.cut(
    df['age'],
    bins=[0, 25, 35, 45, 55, 65, 100],
    labels=[0, 1, 2, 3, 4, 5]
).astype(int)

df['risk_score'] = (
    df['smoker_enc'] * 3 +
    (df['bmi'] > 30).astype(int) * 2 +
    (df['age'] > 50).astype(int) * 2 +
    df['children'] * 0.5 +
    (df['medical_history'] != 'None').astype(int) * 2 +
    (df['family_medical_history'] != 'None').astype(int) * 1 +
    (df['exercise_frequency'] == 'Never').astype(int) * 1
)

df['health_burden'] = (
    (df['medical_history'] != 'None').astype(int) +
    (df['family_medical_history'] != 'None').astype(int)
)

print(f"  Risk score range: {df['risk_score'].min():.1f} — {df['risk_score'].max():.1f}")

# ── Step 5: Sample for faster training (500k rows) ───────────
print("\n[5/8] Sampling dataset for training...")
df_sample = df.sample(n=min(500000, len(df)), random_state=42)
print(f"  Using {len(df_sample)} samples")

FEATURES = [
    'age', 'gender_enc', 'bmi', 'children',
    'smoker_enc', 'region_enc', 'medical_enc',
    'family_enc', 'exercise_enc', 'occupation_enc',
    'bmi_category', 'age_group', 'risk_score', 'health_burden'
]
TARGET = 'charges'

X = df_sample[FEATURES]
y = df_sample[TARGET]

print(f"  Features: {FEATURES}")
print(f"  Charge range: ₹{y.min():.0f} — ₹{y.max():.0f}")

# ── Step 6: Train/Test Split & Scale ─────────────────────────
print("\n[6/8] Splitting and scaling...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)
print(f"  Train: {len(X_train)} | Test: {len(X_test)}")

# ── Step 7: Train Models ──────────────────────────────────────
print("\n[7/8] Training models (this may take 2-5 minutes)...")

rf_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=12,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
print("  Training Random Forest...")
rf_model.fit(X_train_scaled, y_train)

gb_model = GradientBoostingRegressor(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42,
    subsample=0.8
)
print("  Training Gradient Boosting...")
gb_model.fit(X_train_scaled, y_train)

# Evaluate
rf_pred       = rf_model.predict(X_test_scaled)
gb_pred       = gb_model.predict(X_test_scaled)
ensemble_pred = rf_pred * 0.6 + gb_pred * 0.4

rf_r2  = r2_score(y_test, rf_pred)
gb_r2  = r2_score(y_test, gb_pred)
ens_r2 = r2_score(y_test, ensemble_pred)
rf_mae = mean_absolute_error(y_test, rf_pred)

print(f"\n  Random Forest  R² = {rf_r2:.4f}, MAE = {rf_mae:.2f}")
print(f"  Gradient Boost R² = {gb_r2:.4f}")
print(f"  Ensemble       R² = {ens_r2:.4f}")

# Feature importance
print("\n  Feature Importances:")
imp_df = pd.DataFrame({
    'feature': FEATURES,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)
for _, row in imp_df.iterrows():
    bar = "█" * int(row['importance'] * 40)
    print(f"    {row['feature']:20s} {bar} {row['importance']:.4f}")

# ── Step 8: Customer Segmentation ────────────────────────────
print("\n[8/8] Building customer segments...")

# Use full scaled data for segmentation (matching df_sample size)
X_full_scaled = scaler.transform(df_sample[FEATURES])

# Fit KMeans on a 50k subset for speed
kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
kmeans.fit(X_full_scaled[:50000])

# Predict on ALL samples to match df_sample length
seg_labels = kmeans.predict(X_full_scaled)
df_sample = df_sample.copy()
df_sample['segment'] = seg_labels

segment_profiles = {}
for seg in range(6):
    mask   = df_sample['segment'] == seg
    seg_df = df_sample[mask]
    segment_profiles[str(seg)] = {
        'avg_age':      round(float(seg_df['age'].mean()), 1),
        'avg_bmi':      round(float(seg_df['bmi'].mean()), 1),
        'avg_charge':   round(float(seg_df['charges'].mean()), 0),
        'smoker_pct':   round(float((seg_df['smoker'] == 'yes').mean() * 100), 1),
        'avg_children': round(float(seg_df['children'].mean()), 1),
        'count':        int(mask.sum()),
    }
    print(f"  Seg {seg}: age={segment_profiles[str(seg)]['avg_age']}, "
          f"bmi={segment_profiles[str(seg)]['avg_bmi']:.1f}, "
          f"charge=₹{segment_profiles[str(seg)]['avg_charge']:.0f}, "
          f"n={segment_profiles[str(seg)]['count']}")

# ── Save Models ───────────────────────────────────────────────
os.makedirs('models', exist_ok=True)

joblib.dump(rf_model,  'models/rf_model.pkl')
joblib.dump(gb_model,  'models/gb_model.pkl')
joblib.dump(scaler,    'models/scaler.pkl')
joblib.dump(kmeans,    'models/kmeans.pkl')

encoders = {
    'gender':    le_gender.classes_.tolist(),
    'smoker':    le_smoker.classes_.tolist(),
    'region':    le_region.classes_.tolist(),
    'medical':   le_medical.classes_.tolist(),
    'family':    le_family.classes_.tolist(),
    'exercise':  le_exercise.classes_.tolist(),
    'occupation':le_occupation.classes_.tolist(),
    'coverage':  le_coverage.classes_.tolist(),
}

metadata = {
    'features':          FEATURES,
    'encoders':          encoders,
    'segment_profiles':  segment_profiles,
    'charge_stats': {
        'min':  float(y.min()),
        'max':  float(y.max()),
        'mean': float(y.mean()),
        'std':  float(y.std()),
    },
    'model_performance': {
        'rf_r2':       float(rf_r2),
        'gb_r2':       float(gb_r2),
        'ensemble_r2': float(ens_r2),
        'rf_mae':      float(rf_mae),
    },
    'policy_catalog': POLICY_CATALOG,
}

with open('models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n" + "=" * 60)
print("✅ Training complete! Models saved to ml/models/")
print("=" * 60)
print(f"  Ensemble R² Score: {ens_r2:.4f} ({ens_r2*100:.1f}% variance explained)")