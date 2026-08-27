export interface RateLimitConfig {
  max: number;
  windowMs: number;
}

export class MemoryRateLimiter {
  private buckets = new Map<string, { count: number; resetAt: number }>();

  constructor(private readonly config: RateLimitConfig) {}

  allow(key: string): boolean {
    const now = Date.now();
    if (this.buckets.size > 10_000) this.prune(now);
    const bucket = this.buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      this.buckets.set(key, { count: 1, resetAt: now + this.config.windowMs });
      return true;
    }
    if (bucket.count >= this.config.max) return false;
    bucket.count += 1;
    return true;
  }

  private prune(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (now >= bucket.resetAt) this.buckets.delete(key);
    }
  }
}
