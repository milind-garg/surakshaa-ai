# 🛡️ Suraksha AI

<div align="center">

![Suraksha AI Banner](https://img.shields.io/badge/Suraksha_AI-Insurance_Intelligence-1E3A5F?style=for-the-badge&logo=shield&logoColor=white)

**AI-powered insurance intelligence platform for Indian families**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-orange?style=flat-square&logo=google)](https://aistudio.google.com)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow?style=flat-square&logo=python)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)](LICENSE)

[Live Demo](https://surakshaa-ai.vercel.app/) · [Report Bug](https://github.com/milind-garg/surakshaa-ai/issues) · [Request Feature](https://github.com/milind-garg/surakshaa-ai/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [ML Model Details](#-ml-model-details)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [How It Works](#-how-it-works)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

**Suraksha AI** (सुरक्षा AI) is an AI-powered insurance intelligence platform built specifically for Indian families. Insurance in India is notoriously difficult to understand — complex jargon, hidden exclusions, and a lack of Hindi-language support leave most people confused about what their policies actually cover.

Suraksha AI solves this by:

- Reading your insurance policy documents using **Google Cloud Vision OCR** and **Google Gemini AI**
- Explaining coverage in **plain Hindi and English**
- Identifying **coverage gaps** you didn't know existed
- Predicting your **claim success probability**
- Recommending the **top 5 policies** using a **trained ML model** based on your profile

> 💡 Built as a **college macro project** by a team of 3, this is a full-stack, production-deployed application with real AI/ML capabilities.

---

## ✨ Key Features

### 🔍 Policy Analysis
- Upload insurance PDFs or photos of physical documents
- Google Gemini AI reads and analyzes the entire document
- Extracts: policy name, insurer, premium, sum insured, coverage details
- Identifies exclusions and coverage gaps automatically

### 🌐 Bilingual Support (Hindi + English)
- Complete policy summaries in both Hindi and English
- UI labels in Hindi (Devanagari script)
- AI responses adapt to user's preferred language

### 🤖 AI Chatbot with ML Recommendations
- Conversational AI powered by Google Gemini
- **ML model trained on 1M+ insurance records** (Kaggle dataset)
- Top 5 personalized policy recommendations with match scores
- Profile-aware responses based on age, income, family, health conditions
- Persistent chat session history

### 📊 Coverage Gap Analysis
- Identifies what your policy does NOT cover
- Visualizes coverage with checkmarks and cross marks
- Suggests riders and add-ons to fill gaps

### 📈 Claim Success Predictor
- AI-calculated probability of successful claim (0–100%)
- Based on policy structure, exclusions, and coverage completeness

### 👤 User Profile System
- Complete family profile (members, health conditions, income)
- Profile data used for personalized AI recommendations
- View and Edit modes for profile management

### 🔐 Secure Authentication
- Email/password signup and login
- Password reset via email
- Route-level protection (middleware)
- Row Level Security (RLS) in database

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.4 | Full-stack React framework |
| React | 18 | UI library |
| TypeScript | 5.0 | Type safety |
| Tailwind CSS | 4.0 | Utility-first styling |
| shadcn/ui | Latest | Pre-built UI components |
| Lucide React | Latest | Icon library |
| React Hot Toast | Latest | Toast notifications |
| React Dropzone | Latest | Drag & drop file upload |
| Framer Motion | Latest | Animations |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Next.js API Routes | 16.2.4 | Serverless API endpoints |
| Supabase | Latest | PostgreSQL database |
| Supabase Auth | Latest | Authentication |
| Supabase Storage | Latest | File storage |
| @supabase/ssr | Latest | Server-side Supabase |

### AI / ML
| Technology | Purpose |
|---|---|
| Google Gemini API (gemini-2.5-flash) | Policy analysis + chatbot responses |
| Google Cloud Vision API | OCR text extraction from images |
| Python scikit-learn | ML model training (Random Forest + Gradient Boosting) |
| Flask | ML microservice REST API |
| pandas / numpy | Data processing |
| KMeans Clustering | Customer segmentation |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| Vercel | Frontend + API deployment |
| GitHub | Version control |
| Railway (optional) | ML service deployment |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                    Next.js 16 (React 18)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
    │  /api/chat  │ │/api/analyze │ │/api/recommend│
    │  (Gemini)   │ │(OCR+Gemini) │ │  (ML+Gemini)│
    └──────┬──────┘ └──────┬──────┘ └─────┬──────┘
           │               │               │
           │        ┌──────▼──────┐        │
           │        │   Google    │        │
           │        │ Cloud Vision│        │
           │        │  (OCR API)  │        │
           │        └─────────────┘        │
           │                               │
    ┌──────▼───────────────────────────────▼──────┐
    │              Google Gemini API               │
    │         (gemini-2.5-flash)            │
    └─────────────────────────────────────────────┘
           │                               │
    ┌──────▼──────┐               ┌────────▼──────┐
    │  Supabase   │               │  Python Flask  │
    │ PostgreSQL  │               │  ML Service    │
    │ + Storage   │               │ localhost:5001  │
    │ + Auth      │               │                │
    └─────────────┘               └────────────────┘
                                          │
                                  ┌───────▼────────┐
                                  │  ML Models      │
                                  │  - RandomForest │
                                  │  - GradBoost    │
                                  │  - KMeans       │
                                  │  (Kaggle data)  │
                                  └────────────────┘
```

### Data Flow for Policy Analysis
```
Upload PDF/Image
      ↓
Supabase Storage (encrypted)
      ↓
Google Vision OCR → Extract text
      ↓
Google Gemini AI → Analyze content
      ↓
Structured JSON (coverage, gaps, summary)
      ↓
Supabase PostgreSQL (policy_analyses table)
      ↓
Dashboard + Detail Page
```

### Data Flow for AI Recommendations
```
User types in chatbot
      ↓
Intent detection (regex)
      ↓
Fetch user profile from Supabase
      ↓
Call Flask ML service (/recommend)
      ↓
Random Forest + Gradient Boosting prediction
      ↓
Score 10 Indian policies (0-100%)
      ↓
Top 5 sent to Gemini for personalized explanation
      ↓
Recommendation cards displayed in chat
      ↓
Saved to policy_recommendations table
```

---

## 🗄️ Database Schema

```sql
-- 8 tables with Row Level Security enabled

user_profiles          -- Extended user info (age, income, health, preferences)
family_members         -- Family member details per user
policies               -- Uploaded policy document metadata
policy_analyses        -- AI-generated analysis results (JSON)
chat_sessions          -- Chatbot conversation sessions
chat_messages          -- Individual chat messages
policy_recommendations -- ML-generated policy recommendations
notifications          -- User notification system

-- Key relationships:
user_profiles    ←── user_id ──→ auth.users (Supabase Auth)
policies         ←── user_id ──→ auth.users
policy_analyses  ←── policy_id ─→ policies
chat_sessions    ←── user_id ──→ auth.users
chat_messages    ←── session_id ─→ chat_sessions
```

---

## 🤖 ML Model Details

### Dataset
- **Source:** [Kaggle — Insurance Data for Machine Learning](https://www.kaggle.com/datasets/sridharstreaks/insurance-data-for-machine-learning)
- **Size:** 1,000,000 records
- **Features:** age, gender, BMI, children, smoker, region, medical_history, family_medical_history, exercise_frequency, occupation, coverage_level, charges

### Model Architecture
```
Input Features (14):
  age, gender, bmi, children, smoker, region,
  medical_history, family_medical_history,
  exercise_frequency, occupation,
  bmi_category, age_group, risk_score, health_burden

Training:
  500,000 samples (50% of dataset)
  80% train / 20% test split

Models:
  1. Random Forest Regressor (200 trees, depth=12)
  2. Gradient Boosting Regressor (100 trees, lr=0.1)
  3. Ensemble = RF×0.6 + GB×0.4

Performance:
  R² Score: ~0.77 (77% variance explained)
  MAE: ~₹1,837

Clustering:
  KMeans (6 segments) for customer profiling

Policy Scoring:
  10 real Indian policies scored on 8 factors:
  age suitability, income fit, smoker status,
  BMI range, family size, charge range match,
  health conditions, exercise habits
```

### Policy Catalog
The ML model scores recommendations from 10 real Indian insurance products:
- Star Health Comprehensive
- HDFC Ergo Optima Restore
- Niva Bupa ReAssure 2.0
- LIC Tech Term Plan
- HDFC Click 2 Protect Super
- ICICI Pru Heart & Cancer Protect
- Star Senior Citizen Red Carpet
- Bajaj Allianz Health Guard Family Floater
- SBI Life eWealth Insurance (ULIP)
- Tata AIG Accident Guard

---

## 📦 Prerequisites

Make sure you have these installed:

| Tool | Version | Check |
|---|---|---|
| Node.js | v20.x (LTS) | `node --version` |
| npm | v10.x | `npm --version` |
| Python | 3.10+ | `python --version` |
| Git | Latest | `git --version` |

### Required Accounts & API Keys
- [Supabase](https://supabase.com) — Free tier
- [Google AI Studio](https://aistudio.google.com/app/apikey) — Gemini API key
- [Google Cloud Console](https://console.cloud.google.com) — Vision API key
- [Kaggle](https://kaggle.com) — For downloading dataset
- [Vercel](https://vercel.com) — For deployment (free tier)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/milind-garg/surakshaa-ai.git
cd suraksha-ai
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor** → Run these scripts in order:

**Create Tables:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT, age INTEGER, gender TEXT, occupation TEXT,
  annual_income BIGINT DEFAULT 0, family_size INTEGER DEFAULT 1,
  health_conditions TEXT[] DEFAULT '{}', existing_policies TEXT[] DEFAULT '{}',
  risk_appetite TEXT DEFAULT 'medium', preferred_language TEXT DEFAULT 'english',
  avatar_url TEXT, is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, relation TEXT NOT NULL, age INTEGER,
  gender TEXT, health_conditions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.policies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL, file_path TEXT NOT NULL, file_url TEXT,
  file_type TEXT NOT NULL, file_size BIGINT,
  status TEXT DEFAULT 'uploading', extracted_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.policy_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  policy_name TEXT, policy_type TEXT, insurer TEXT,
  premium_amount BIGINT, sum_insured BIGINT,
  coverage_details JSONB DEFAULT '[]', exclusions TEXT[] DEFAULT '{}',
  key_benefits TEXT[] DEFAULT '{}', coverage_gaps TEXT[] DEFAULT '{}',
  claim_process TEXT, claim_success_probability FLOAT,
  summary_english TEXT, summary_hindi TEXT,
  recommendations TEXT[] DEFAULT '{}', raw_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Chat', is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, content TEXT NOT NULL, metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.policy_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  recommendations JSONB NOT NULL DEFAULT '[]', user_requirements TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, message TEXT NOT NULL,
  type TEXT DEFAULT 'info', is_read BOOLEAN DEFAULT FALSE,
  link TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Enable RLS and create triggers** (see full SQL in `/docs/supabase-schema.sql`)

3. Go to **Authentication** → **URL Configuration** → Add:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`, `http://localhost:3000/update-password`

4. Go to **Storage** → Create bucket: `policy-documents` (private), `avatars` (public)

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Google Cloud Vision (OCR)
GOOGLE_VISION_API_KEY=your_vision_api_key_here

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Suraksha AI

# ML Service
ML_SERVICE_URL=http://localhost:5001
```

### 5. Set Up Python ML Environment

```bash
# Navigate to ml folder
cd ml

# Create virtual environment (Windows)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install pandas numpy scikit-learn flask flask-cors joblib requests kaggle
```

### 6. Download & Prepare Dataset

```bash
# Set up Kaggle credentials first
# Place kaggle.json in C:\Users\YourName\.kaggle\

# Download dataset
kaggle datasets download -d sridharstreaks/insurance-data-for-machine-learning

# Extract
# Windows:
Expand-Archive -Path "insurance-data-for-machine-learning.zip" -DestinationPath "data"
```

### 7. Train the ML Model

```bash
# Make sure you're in ml/ with venv activated
python train_model.py
```

> ⏳ Training takes 3–7 minutes. Expected R² score: ~0.77

```bash
# Verify model works
python recommender.py
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server only) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `GEMINI_MODEL` | ✅ | Gemini model name (e.g. gemini-1.5-flash-latest) |
| `GOOGLE_VISION_API_KEY` | ✅ | Google Cloud Vision API key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your app URL (localhost or Vercel URL) |
| `NEXT_PUBLIC_APP_NAME` | ❌ | App display name (default: Suraksha AI) |
| `ML_SERVICE_URL` | ❌ | ML Flask service URL (default: http://localhost:5001) |

---

## ▶️ Running the Project

You need **3 terminals** running simultaneously:

**Terminal 1 — ML Service:**
```bash
cd ml
.\venv\Scripts\Activate.ps1   # Windows
# source venv/bin/activate    # Mac/Linux
python app.py
# Runs at: http://localhost:5001
```

**Terminal 2 — Next.js App:**
```bash
# In project root
npm run dev
# Runs at: http://localhost:3000
```

**Terminal 3 — Available for testing**

### Verify Setup
Open browser → `http://localhost:3000/api/test-connection`

Expected:
```json
{
  "success": true,
  "database": "Connected",
  "environment": {
    "supabaseUrl": true,
    "supabaseAnonKey": true,
    "geminiKey": true,
    "visionKey": true
  }
}
```

---

## 📁 Project Structure

```
suraksha-ai/
│
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth layout group
│   │   ├── login/page.tsx            # Login page
│   │   ├── signup/page.tsx           # Signup page
│   │   ├── forgot-password/page.tsx  # Forgot password
│   │   ├── actions.ts                # Auth server actions
│   │   └── layout.tsx                # Auth layout (dark gradient)
│   │
│   ├── (dashboard)/                  # Dashboard layout group
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── upload/page.tsx           # Policy upload
│   │   ├── policies/                 # My policies
│   │   │   ├── page.tsx              # Policies list
│   │   │   └── [id]/page.tsx         # Policy detail
│   │   ├── chatbot/page.tsx          # AI chatbot
│   │   ├── profile/page.tsx          # User profile
│   │   └── layout.tsx                # Dashboard layout
│   │
│   ├── api/                          # API routes (serverless)
│   │   ├── analyze/route.ts          # Policy analysis (OCR + Gemini)
│   │   ├── chat/route.ts             # AI chatbot (Gemini)
│   │   ├── recommend/route.ts        # ML recommendations
│   │   └── test-connection/route.ts  # Backend health check
│   │
│   ├── auth/callback/route.ts        # Supabase auth callback
│   ├── update-password/page.tsx      # Password reset page
│   ├── globals.css                   # Global styles (Tailwind v4)
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── shared/                       # Shared components
│   │   ├── Navbar.tsx                # Public navbar
│   │   ├── Footer.tsx                # Public footer
│   │   └── ThemeProvider.tsx         # Theme wrapper
│   ├── dashboard/
│   │   ├── DashboardNav.tsx          # Dashboard top bar
│   │   └── DashboardSidebar.tsx      # Dashboard sidebar
│   ├── policy/
│   │   ├── UploadContainer.tsx       # Upload orchestration
│   │   ├── FileDropzone.tsx          # Drag & drop zone
│   │   ├── UploadProgress.tsx        # Progress animation
│   │   └── UploadSuccess.tsx         # Success screen
│   └── chatbot/
│       ├── ChatMessage.tsx           # Message bubble
│       ├── ChatInput.tsx             # Input with quick prompts
│       ├── ChatSidebar.tsx           # Session list
│       └── RecommendationCards.tsx   # Policy rec cards
│
├── hooks/
│   ├── useAuth.ts                    # Auth state hook
│   ├── useUserProfile.ts             # Profile CRUD hook
│   └── useChatStore.ts               # Chat state management
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase client
│   │   ├── middleware.ts             # Middleware Supabase client
│   │   └── database.types.ts         # TypeScript DB types
│   └── utils/
│       └── index.ts                  # Utility functions (cn, formatINR, etc.)
│
├── types/
│   └── index.ts                      # Global TypeScript types
│
├── ml/                               # Python ML service
│   ├── app.py                        # Flask REST API
│   ├── train_model.py                # Model training script
│   ├── recommender.py                # Recommendation engine
│   ├── policy_catalog.py             # 10 Indian policies database
│   ├── explore_data.py               # Dataset exploration
│   ├── data/                         # Kaggle dataset (gitignored)
│   │   └── insurance.csv
│   ├── models/                       # Trained models (gitignored)
│   │   ├── rf_model.pkl
│   │   ├── gb_model.pkl
│   │   ├── scaler.pkl
│   │   ├── kmeans.pkl
│   │   └── metadata.json
│   └── venv/                         # Python virtual env (gitignored)
│
├── proxy.ts                          # Next.js middleware (route protection)
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs                # PostCSS configuration
├── components.json                   # shadcn/ui configuration
└── .env.local                        # Environment variables (gitignored)
```

---

## 🔌 API Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/test-connection` | Health check for all services | No |
| `POST` | `/api/analyze` | Analyze uploaded policy with AI | Yes |
| `POST` | `/api/chat` | Send message to AI chatbot | Yes |
| `POST` | `/api/recommend` | Get ML policy recommendations | Yes |
| `GET` | `/auth/callback` | Supabase OAuth/email callback | No |

### ML Service (Flask — Port 5001)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health check |
| `POST` | `/recommend` | Get ranked policy recommendations |
| `POST` | `/score` | Get charge prediction for profile |

---

## 💡 How It Works

### 1. User Onboarding
```
Sign up → Auto profile created (DB trigger) → Complete profile
(age, income, family, health conditions)
```

### 2. Policy Analysis
```
Upload PDF/Image → Supabase Storage
→ Google Vision OCR (for images) or Gemini Vision (for PDFs)
→ Gemini analyzes: coverage, exclusions, gaps, claim probability
→ Bilingual summary (Hindi + English) generated
→ Results saved to database → Detail page rendered
```

### 3. AI Chatbot
```
User message → Intent detection
→ If recommendation intent:
    Fetch user profile from DB
    → Call ML Flask service (/recommend)
    → ML scores 10 policies based on user features
    → Top 5 sent to Gemini for natural language explanation
    → Recommendation cards shown with match scores
→ If general question:
    Gemini responds with insurance expertise
    Profile context included for personalization
→ Message saved to DB
```

### 4. Password Reset Flow
```
Enter email → Supabase sends email
→ Click link → /auth/callback
→ Session created → /update-password
→ Enter new password → Saved to Supabase Auth
→ Auto sign out → Redirect to /login
```

---

## 🖼️ Screenshots

| Page | Description |
|---|---|
| Landing Page | Hero section with Hindi text, features, testimonials |
| Dashboard | Stats, quick actions, recent policies, recommendations |
| Upload Page | Drag & drop with progress animation |
| Policy Detail | Coverage details, Hindi/English summary, claim probability |
| AI Chatbot | Conversational UI with recommendation cards |
| Profile Page | View + Edit modes with family member management |

---

## 👥 Team

**Suraksha AI** was built as a college macro project (Semester 4) by a team of 3.

| Role | Responsibilities |
|---|---|
| Team Member 1 | Frontend (Landing, Dashboard, UI/UX) |
| Team Member 2 | Backend (API routes, Supabase, Auth) |
| Team Member 3 | ML Model (Training, Flask service, Recommendations) |

---

## 🔭 Future Scope

### Short Term (Next Semester)
- [ ] **OCR Improvement** — Better PDF parsing using PDF.js for text-based PDFs
- [ ] **More Policy Types** — Vehicle, travel, crop insurance support
- [ ] **WhatsApp Integration** — Send policy summaries via WhatsApp
- [ ] **Dark Mode** — Full dark mode support
- [ ] **PWA Support** — Install as mobile app

### Medium Term
- [ ] **Premium Comparison** — Real-time premium quotes from insurers
- [ ] **Claim Filing Assistant** — Step-by-step claim guidance with document checklist
- [ ] **Policy Renewal Alerts** — Email/SMS reminders before policy expires
- [ ] **Multi-language Support** — Bengali, Tamil, Telugu, Marathi
- [ ] **Voice Interface** — Ask questions by voice (Hindi speech recognition)

### Long Term
- [ ] **Insurer API Integration** — Direct policy purchase within the platform
- [ ] **IRDAI Compliance** — Regulatory compliance for financial advisory
- [ ] **Blockchain Policy Storage** — Tamper-proof policy document storage
- [ ] **Federated Learning** — Privacy-preserving ML model improvement
- [ ] **Group Insurance** — Corporate/group policy management
- [ ] **Better ML Dataset** — Train on real Indian insurance claims data

### Technical Improvements
- [ ] **Model Retraining Pipeline** — Automated retraining as new data arrives
- [ ] **Streaming Responses** — Real-time AI response streaming
- [ ] **Redis Caching** — Cache frequent recommendations
- [ ] **Rate Limiting** — API rate limiting per user
- [ ] **Analytics Dashboard** — Usage analytics for admins

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Add Environment Variables in Vercel
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from `.env.local` (update `NEXT_PUBLIC_APP_URL` to your Vercel URL).

### Update Supabase for Production
Go to Supabase → Authentication → URL Configuration → Add your Vercel URL to Redirect URLs.

### Deploy ML Service (Railway)
```bash
# In ml/ folder, create Procfile:
echo "web: python app.py" > Procfile

# Push to Railway
railway up
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict typing
- Add `"use client"` directive for client components
- Always `await createClient()` in server components
- Test all changes with `npm run build` before PR

---

## 🐛 Known Issues

| Issue | Status | Workaround |
|---|---|---|
| Large PDFs (>3MB) slow to analyze | Open | Compress PDF before upload |
| Vision OCR misses handwritten text | Open | Use typed/digital documents |
| ML service must run locally | Open | Deploy to Railway for production |
| Gemini model names change frequently | Ongoing | Update `GEMINI_MODEL` in `.env.local` |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [Google AI Studio](https://aistudio.google.com) — Gemini API
- [Supabase](https://supabase.com) — Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) — Beautiful UI components
- [Kaggle — sridharstreaks](https://www.kaggle.com/datasets/sridharstreaks/insurance-data-for-machine-learning) — Insurance dataset
- [IRDAI](https://irdai.gov.in) — Indian insurance regulatory reference
- [Next.js](https://nextjs.org) — The React framework
- [Vercel](https://vercel.com) — Deployment platform

---

<div align="center">

**Made with ❤️ for Indian families**

*Suraksha AI — बीमा को समझें, आसान भाषा में*

⭐ Star this repo if you found it helpful!

</div>
