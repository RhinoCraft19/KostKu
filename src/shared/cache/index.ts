import { Redis } from '@upstash/redis';

/**
 * Upstash Redis client initialized from environment variables.
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */
const redis = Redis.fromEnv();

export default redis;

/**
 * Set a cache entry with an optional TTL (seconds).
 * Defaults to 120 seconds (2 minutes).
 */
export async function setCache<T>(key: string, data: T, ttl = 120): Promise<void> {
  await redis.set(key, JSON.stringify(data), { ex: ttl });
}

/**
 * Get a cache entry. Returns null if not found or expired.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await redis.get<string>(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Invalidate (delete) a specific cache key.
 */
export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}
