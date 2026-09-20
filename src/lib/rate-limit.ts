/**
 * Minimal in-memory sliding-window rate limiter.
 * Good enough for a single-region deployment; swap for Upstash/Redis when
 * scaling to multiple instances.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - opts.windowMs;

  const hits = (buckets.get(opts.key) ?? []).filter((t) => t > windowStart);
  if (hits.length >= opts.limit) {
    const retryAfterSec = Math.ceil((hits[0] + opts.windowMs - now) / 1000);
    buckets.set(opts.key, hits);
    return { ok: false, retryAfterSec };
  }

  hits.push(now);
  buckets.set(opts.key, hits);

  // Opportunistic cleanup so the map doesn't grow forever
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= windowStart)) buckets.delete(k);
    }
  }

  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
