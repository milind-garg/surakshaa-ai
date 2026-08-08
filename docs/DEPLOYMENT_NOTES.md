# 🚀 Suraksha AI — Vercel Deployment Notes

## Environment Variables Required in Vercel

When deploying to [Vercel](https://vercel.com), configure the following environment variables under **Project Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_VISION_API_KEY=your-google-vision-api-key
NEXT_PUBLIC_APP_URL=https://surakshaa-ai.vercel.app
NEXT_PUBLIC_APP_NAME=Suraksha AI
```

> [!WARNING]
> Never commit actual API keys or secret tokens to Git repository files.

## Post-Deploy Checklist

1. **Authentication Configuration**:
   - Navigate to **Supabase Dashboard → Authentication → URL Configuration**.
   - Add your production Vercel URL (e.g., `https://surakshaa-ai.vercel.app`) to **Site URL** and **Redirect URLs**.

2. **Storage CORS Configuration**:
   - In Supabase Storage settings for the `policy-documents` bucket, add your Vercel domain to allowed origins.

3. **Production Verification**:
   - [ ] Verify user signup / login on live domain.
   - [ ] Test policy PDF/image file upload.
   - [ ] Test AI policy analysis endpoint.
   - [ ] Test chatbot and ML policy recommendation engine.