// ============================================================
// SURAKSHA AI — Rate Limiting Utility (Sliding Window Algorithm)
// Prevents API quota exhaustion, spamming, and denial-of-wallet
// ============================================================

interface RateLimitEntry {
  timestamps: number[];
}

// Rate limit memory store for sliding window
const rateLimitStore = new Map<string, RateLimitEntry>();

// Lazy cleanup helper to prevent memory leaks without background timers in serverless environments
function pruneExpiredEntries(now: number, windowMs: number) {
  if (rateLimitStore.size > 1000) {
    for (const [key, entry] of rateLimitStore.entries()) {
      const valid = entry.timestamps.filter((ts) => now - ts < windowMs);
      if (valid.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { timestamps: valid });
      }
    }
  }
}

export interface RateLimitConfig {
  limit: number;      // Maximum allowed requests
  windowMs: number;   // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 15, windowMs: 10 * 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;

  pruneExpiredEntries(now, config.windowMs);

  const entry = rateLimitStore.get(key) ?? { timestamps: [] };
  
  // Filter out timestamps outside the sliding window
  const validTimestamps = entry.timestamps.filter(
    (ts) => now - ts < config.windowMs
  );

  if (validTimestamps.length >= config.limit) {
    const oldest = validTimestamps[0];
    const resetMs = config.windowMs - (now - oldest);
    
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  // Record current request
  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - validTimestamps.length,
    resetMs: config.windowMs,
  };
}
