import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // await the async createClient
    const supabase = await createClient();

    // Test environment variables first
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
    return NextResponse.json({
      success: false,
      message: "Unexpected error",
      error: String(err),
    }, { status: 500 });
  }
}