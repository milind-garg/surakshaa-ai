// ============================================================
// SURAKSHA AI — Rate Limiting Utility
// MED-5 Fix: Production-grade sliding window with Upstash Redis.
//
// Strategy:
//   Production (Vercel): Upstash Redis via @upstash/ratelimit
//     — persistent across serverless cold starts, no bypass possible.
//   Local dev (no env vars set): in-memory Map fallback
//     — same behaviour as before, zero config needed locally.
//
// To activate Redis: set in Vercel env vars:
//   UPSTASH_REDIS_REST_URL  = https://...upstash.io
//   UPSTASH_REDIS_REST_TOKEN = your-token
// ============================================================

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Shared types ──────────────────────────────────────────────
export interface RateLimitConfig {
  limit: number;    // Maximum allowed requests in the window
  windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number; // Milliseconds until the window resets
}

// ── Upstash Redis path (production) ──────────────────────────

// Cache Ratelimit instances by config so we don't recreate on every request.
const upstashLimiters = new Map<string, Ratelimit>();

/**
 * Convert a millisecond window into the duration string that Upstash expects,
 * e.g. 600000 → "10 m", 3600000 → "1 h", 86400000 → "1 d".
 */
function msToUpstashWindow(ms: number): `${number} ${"ms" | "s" | "m" | "h" | "d"}` {
  const d = 24 * 60 * 60 * 1000;
  const h = 60 * 60 * 1000;
  const m = 60 * 1000;
  const s = 1000;
  if (ms % d === 0) return `${ms / d} d`;
  if (ms % h === 0) return `${ms / h} h`;
  if (ms % m === 0) return `${ms / m} m`;
  if (ms % s === 0) return `${ms / s} s`;
  return `${ms} ms`;
}

async function checkRateLimitUpstash(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const cacheKey = `${config.limit}_${config.windowMs}`;

  if (!upstashLimiters.has(cacheKey)) {
    upstashLimiters.set(
      cacheKey,
      new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(config.limit, msToUpstashWindow(config.windowMs)),
        prefix: "suraksha_rl", // namespace in Redis
        analytics: false,
      })
    );
  }

  const limiter = upstashLimiters.get(cacheKey)!;
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    // `reset` is a Unix timestamp in ms; convert to "ms until reset"
    resetMs: Math.max(0, reset - Date.now()),
  };
}

// ── In-memory fallback (local dev only) ──────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function pruneExpiredEntries(now: number, windowMs: number) {
  if (rateLimitStore.size > 1000) {
    for (const [key, entry] of rateLimitStore.entries()) {
      const valid = entry.timestamps.filter((ts) => now - ts < windowMs);
      if (valid.length === 0) rateLimitStore.delete(key);
      else rateLimitStore.set(key, { timestamps: valid });
    }
  }
}

function checkRateLimitInMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  pruneExpiredEntries(now, config.windowMs);

  const entry = rateLimitStore.get(identifier) ?? { timestamps: [] };
  const validTimestamps = entry.timestamps.filter((ts) => now - ts < config.windowMs);

  if (validTimestamps.length >= config.limit) {
    const oldest = validTimestamps[0];
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetMs: Math.max(0, config.windowMs - (now - oldest)),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: validTimestamps });

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - validTimestamps.length,
    resetMs: config.windowMs,
  };
}

// ── Main export ───────────────────────────────────────────────

/**
 * Check rate limit for an identifier.
 * Uses Upstash Redis in production (when UPSTASH_REDIS_REST_URL is set)
 * and falls back to an in-memory store for local development.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 15, windowMs: 10 * 60 * 1000 }
): Promise<RateLimitResult> {
  const useUpstash =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (useUpstash) {
    try {
      return await checkRateLimitUpstash(identifier, config);
    } catch (err) {
      // Graceful degradation: if Redis is unreachable, fall back to in-memory
      // so the app keeps running. Log the error for investigation.
      console.error("[RateLimit] Upstash error — falling back to in-memory:", err);
    }
  }

  return checkRateLimitInMemory(identifier, config);
}
