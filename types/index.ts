// ============================================
// SURAKSHA AI — Global TypeScript Types
// ============================================

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  gender: "male" | "female" | "other";
  occupation: string;
  annual_income: number;
  family_size: number;
  family_members: FamilyMember[];
  health_conditions: string[];
  existing_policies: string[];
  risk_appetite: "low" | "medium" | "high";
  preferred_language: "hindi" | "english" | "hinglish";
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  name: string;
  relation: string;
  age: number;
  health_conditions: string[];
}

export interface Policy {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: "pdf" | "image";
  status: "uploading" | "processing" | "analyzed" | "error";
  extracted_text?: string;
  analysis?: PolicyAnalysis;
  created_at: string;
  updated_at: string;
}

export interface PolicyAnalysis {
  policy_name: string;
  policy_type: string;
  insurer: string;
  premium_amount: number;
  sum_insured: number;
  coverage_details: CoverageDetail[];
  exclusions: string[];
  claim_process: string;
  key_benefits: string[];
  coverage_gaps: string[];
  claim_success_probability: number;
  plain_language_summary: {
    hindi: string;
    english: string;
  };
  recommendations: string[];
}

export interface CoverageDetail {
  category: string;
  covered: boolean;
  amount?: number;
  conditions?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface PolicyRecommendation {
  rank: number;
  policy_name: string;
  insurer: string;
  policy_type: string;
  premium_estimate: string;
  sum_insured: string;
  key_features: string[];
  why_recommended: string;
  match_score: number;
}

export interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}