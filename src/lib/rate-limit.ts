/**
 * In-memory Token Bucket Rate Limiter
 * Provides anti-scraping and abuse protection for sensitive endpoints
 * (OTP requests, Representative's Radar queries, and verification).
 */

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

class TokenBucketRateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private readonly maxTokens: number;
  private readonly refillRatePerSecond: number;
  private readonly windowMs: number;

  constructor(maxTokens: number, windowSeconds: number) {
    this.maxTokens = maxTokens;
    this.windowMs = windowSeconds * 1000;
    this.refillRatePerSecond = maxTokens / windowSeconds;

    // Periodic cleanup of stale records
    if (typeof setInterval !== "undefined") {
      const timer = setInterval(() => this.cleanup(), 60000);
      if (timer.unref) {
        timer.unref();
      }
    }
  }

  /**
   * Check and consume a token for a given key (e.g. IP or User ID)
   * Returns { success: true } or { success: false, retryAfterSeconds }
   */
  public consume(key: string, tokensToConsume = 1): { success: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    let record = this.records.get(key);

    if (!record) {
      record = {
        tokens: this.maxTokens,
        lastRefill: now,
      };
      this.records.set(key, record);
    } else {
      // Calculate refilled tokens
      const elapsedSeconds = (now - record.lastRefill) / 1000;
      const addedTokens = elapsedSeconds * this.refillRatePerSecond;
      record.tokens = Math.min(this.maxTokens, record.tokens + addedTokens);
      record.lastRefill = now;
    }

    if (record.tokens >= tokensToConsume) {
      record.tokens -= tokensToConsume;
      return { success: true, retryAfterSeconds: 0 };
    }

    const missingTokens = tokensToConsume - record.tokens;
    const retryAfterSeconds = Math.ceil(missingTokens / this.refillRatePerSecond);

    return {
      success: false,
      retryAfterSeconds,
    };
  }

  private cleanup() {
    const now = Date.now();
    this.records.forEach((record, key) => {
      if (now - record.lastRefill > this.windowMs * 2) {
        this.records.delete(key);
      }
    });
  }
}

// 1. Radar Search Rate Limiter: 30 requests per minute per MP/admin session to prevent data mass scraping
export const radarSearchLimiter = new TokenBucketRateLimiter(30, 60);

// 2. OTP Request Limiter: 3 requests per 2 minutes per phone/IP to prevent SMS spam and brute force
export const otpRequestLimiter = new TokenBucketRateLimiter(3, 120);

// 3. OTP Verification Limiter: 5 attempts per 2 minutes
export const otpVerifyLimiter = new TokenBucketRateLimiter(5, 120);

// 4. Coupon Verification Limiter: 20 per minute per merchant
export const couponVerifyLimiter = new TokenBucketRateLimiter(20, 60);
