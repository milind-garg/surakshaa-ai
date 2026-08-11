-- ============================================================
-- SURAKSHA AI — PostgreSQL Schema Update & Performance Indexing
-- ============================================================

-- 1. Add Extended Physical & Lifestyle Metrics to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS height_cm INT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS weight_kg INT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bmi NUMERIC(4,1);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS smoker BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS exercise_frequency VARCHAR(50);

-- 2. Add Composite Indexes for High-Performance Querying
CREATE INDEX IF NOT EXISTS idx_policies_user_status ON policies(user_id, status);
CREATE INDEX IF NOT EXISTS idx_policy_analyses_user_policy ON policy_analyses(user_id, policy_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_session ON policy_recommendations(user_id, session_id);

-- 3. Row Level Security (RLS) Policy Enforcement
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. User Data Isolation Policies
DROP POLICY IF EXISTS "Users manage own profiles" ON user_profiles;
CREATE POLICY "Users manage own profiles" ON user_profiles FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own family members" ON family_members;
CREATE POLICY "Users manage own family members" ON family_members FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own policies" ON policies;
CREATE POLICY "Users manage own policies" ON policies FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own policy analyses" ON policy_analyses;
CREATE POLICY "Users manage own policy analyses" ON policy_analyses FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own recommendations" ON policy_recommendations;
CREATE POLICY "Users manage own recommendations" ON policy_recommendations FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own chat sessions" ON chat_sessions;
CREATE POLICY "Users manage own chat sessions" ON chat_sessions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own chat messages" ON chat_messages;
CREATE POLICY "Users manage own chat messages" ON chat_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chat_sessions s WHERE s.id = chat_messages.session_id AND s.user_id = auth.uid()
  )
);
