// ============================================
// Suraksha AI — Database Types
// Auto-generated structure matching our schema
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          age: number | null;
          gender: string | null;
          occupation: string | null;
          annual_income: number | null;
          family_size: number | null;
          health_conditions: string[] | null;
          existing_policies: string[] | null;
          risk_appetite: string | null;
          preferred_language: string | null;
          avatar_url: string | null;
          is_profile_complete: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          age?: number | null;
          gender?: string | null;
          occupation?: string | null;
          annual_income?: number | null;
          family_size?: number | null;
          health_conditions?: string[] | null;
          existing_policies?: string[] | null;
          risk_appetite?: string | null;
          preferred_language?: string | null;
          avatar_url?: string | null;
          is_profile_complete?: boolean | null;
        };
        Update: {
          full_name?: string | null;
          age?: number | null;
          gender?: string | null;
          occupation?: string | null;
          annual_income?: number | null;
          family_size?: number | null;
          health_conditions?: string[] | null;
          existing_policies?: string[] | null;
          risk_appetite?: string | null;
          preferred_language?: string | null;
          avatar_url?: string | null;
          is_profile_complete?: boolean | null;
        };
      };
      policies: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_path: string;
          file_url: string | null;
          file_type: string;
          file_size: number | null;
          status: string;
          extracted_text: string | null;
          ocr_confidence: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_path: string;
          file_url?: string | null;
          file_type: string;
          file_size?: number | null;
          status?: string;
          extracted_text?: string | null;
        };
        Update: {
          status?: string;
          extracted_text?: string | null;
          file_url?: string | null;
          ocr_confidence?: number | null;
        };
      };
      policy_analyses: {
        Row: {
          id: string;
          policy_id: string;
          user_id: string;
          policy_name: string | null;
          policy_type: string | null;
          insurer: string | null;
          premium_amount: number | null;
          sum_insured: number | null;
          coverage_details: Json;
          exclusions: string[];
          key_benefits: string[];
          coverage_gaps: string[];
          claim_process: string | null;
          claim_success_probability: number | null;
          summary_english: string | null;
          summary_hindi: string | null;
          recommendations: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          policy_id: string;
          user_id: string;
          policy_name?: string | null;
          policy_type?: string | null;
          insurer?: string | null;
          premium_amount?: number | null;
          sum_insured?: number | null;
          coverage_details?: Json;
          exclusions?: string[];
          key_benefits?: string[];
          coverage_gaps?: string[];
          claim_process?: string | null;
          claim_success_probability?: number | null;
          summary_english?: string | null;
          summary_hindi?: string | null;
          recommendations?: string[];
          raw_analysis?: Json;
        };
        Update: {
          policy_name?: string | null;
          policy_type?: string | null;
          insurer?: string | null;
          premium_amount?: number | null;
          sum_insured?: number | null;
          coverage_details?: Json;
          exclusions?: string[];
          key_benefits?: string[];
          coverage_gaps?: string[];
          claim_success_probability?: number | null;
          summary_english?: string | null;
          summary_hindi?: string | null;
          recommendations?: string[];
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title?: string;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          is_active?: boolean;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: string;
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          session_id: string;
          user_id: string;
          role: string;
          content: string;
          metadata?: Json;
        };
        Update: never;
      };
    };
  };
}