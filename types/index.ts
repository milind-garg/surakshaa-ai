// ============================================
// SURAKSHA AI — Global TypeScript Types
// ============================================

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  gender: "male" | "female" | "other" | string | null;
  occupation: string | null;
  annual_income: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  bmi?: number | null;
  smoker?: boolean | null;
  exercise_frequency?: "never" | "occasionally" | "regularly" | "daily" | string | null;
  family_size: number | null;
  family_members?: FamilyMember[] | null;
  health_conditions: string[] | null;
  existing_policies: string[] | null;
  risk_appetite: "low" | "medium" | "high" | string | null;
  preferred_language: "hindi" | "english" | "hinglish" | string | null;
  avatar_url: string | null;
  is_profile_complete: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id?: string;
  name: string;
  relation: string;
  age: number;
  health_conditions?: string[];
}

export interface Policy {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_url?: string | null;
  file_type: "pdf" | "image" | string;
  file_size?: number | null;
  status: "uploading" | "processing" | "analyzed" | "error" | string;
  extracted_text?: string | null;
  ocr_confidence?: number | null;
  analysis?: PolicyAnalysis;
  created_at: string;
  updated_at: string;
}

export interface PolicyAnalysis {
  id?: string;
  policy_id: string;
  user_id: string;
  policy_name: string | null;
  policy_type: string | null;
  insurer: string | null;
  premium_amount: number | null;
  sum_insured: number | null;
  coverage_details: CoverageDetail[];
  exclusions: string[];
  claim_process: string | null;
  key_benefits: string[];
  coverage_gaps: string[];
  claim_success_probability: number | null;
  summary_english: string | null;
  summary_hindi: string | null;
  recommendations: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CoverageDetail {
  category: string;
  covered: boolean;
  amount?: number | null;
  conditions?: string | null;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string | Date;
  recommendations?: PolicyRecommendation[];
  isLoading?: boolean;
}

export interface PolicyRecommendation {
  rank: number;
  policy_id?: string;
  policy_name: string;
  insurer: string;
  policy_type: string;
  premium_estimate: string;
  sum_insured: string;
  key_features: string[];
  why_recommended: string;
  match_score: number;
  predicted_charge?: number;
  user_segment?: number;
}

export interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}