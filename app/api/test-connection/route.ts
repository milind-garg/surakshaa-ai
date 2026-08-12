import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET() {
  try {
    // await the async createClient
    const supabase = await createClient();

    // SECURITY: Protect this diagnostic endpoint — only authenticated users
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // LOW-4: Rate limit diagnostic endpoint — max 10 calls per minute per user
    const rateCheck = await checkRateLimit(`health_${user.id}`, { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    // Test environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      geminiKey: !!process.env.GEMINI_API_KEY,
      visionKey: !!process.env.GOOGLE_VISION_API_KEY,
    };

    // If Supabase URL is missing, skip DB test
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        success: false,
        message: "Supabase URL is missing in .env.local",
        environment: envCheck,
      });
    }

    // Test database connection
    const { error } = await supabase
      .from("user_profiles")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Database connection failed",
        error: error.message,
        environment: envCheck,
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Suraksha AI backend is connected!",
      database: "Connected",
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("test-connection error:", err);
    return NextResponse.json({
      success: false,
      message: "Unexpected error during health check",
    }, { status: 500 });
  }
}