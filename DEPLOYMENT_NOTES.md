# Suraksha AI — Deployment Notes

## Environment Variables Required in Vercel

```
NEXT_PUBLIC_SUPABASE_URL=https://pqhcfpnudjytyrgrccsf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaGNmcG51ZGp5dHlyZ3JjY3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDUyNzIsImV4cCI6MjA5MjA4MTI3Mn0.bOc4AMuaTzdMxJ8UtDYKBfvu6rHkmUowRAmuBdIzGac
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaGNmcG51ZGp5dHlyZ3JjY3NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjUwNTI3MiwiZXhwIjoyMDkyMDgxMjcyfQ.g0iAIpUiyLv493-j1Ap57455Sx4K_0_VShVM4Qc9_U4
GEMINI_API_KEY=AIzaSyDwmac03tgw-5wiOdm1xxl9JTCBnaxy93k
GOOGLE_VISION_API_KEY=AIzaSyCx0kDVfozTqIOZX-WAhka_NtwAzlBpu7I
NEXT_PUBLIC_APP_URL=https://surakshaa-ai.vercel.app
NEXT_PUBLIC_APP_NAME=Suraksha AI
```

## Post-Deploy Steps
1. Add Vercel URL to Supabase Auth → URL Configuration
2. Add Vercel URL to Supabase Storage CORS settings
3. Test signup/login on live URL
4. Test file upload on live URL
5. Test chatbot on live URL