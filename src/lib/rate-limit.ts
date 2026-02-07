/**
 * Simple in-memory rate limiter for server actions.
 * Uses a sliding window approach per key.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited.
 * @param key - Unique identifier (e.g., action name + user ID or IP)
 * @param maxRequests - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the request is allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  cleanup(windowMs);

  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { timestamps: [now] });
    return true;
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    return false;
  }

  entry.timestamps.push(now);
  return true;
}

/**
 * Rate limit helper that throws a standardized error.
 * @param key - Unique identifier
 * @param maxRequests - Max requests per window (default: 10)
 * @param windowMs - Window in ms (default: 60000 = 1 minute)
 */
export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { allowed: true } | { allowed: false; error: string } {
  if (checkRateLimit(key, maxRequests, windowMs)) {
    return { allowed: true };
  }
  return { allowed: false, error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' };
}
