const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const requestWindows = new Map<string, number[]>();

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function checkTwinChatRateLimit(key: string, now = Date.now()): RateLimitResult {
  const windowStart = now - WINDOW_MS;
  const recentRequests = (requestWindows.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (recentRequests.length >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((recentRequests[0] + WINDOW_MS - now) / 1000));
    requestWindows.set(key, recentRequests);
    return { allowed: false, retryAfterSeconds };
  }

  recentRequests.push(now);
  requestWindows.set(key, recentRequests);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetTwinChatRateLimitForTests() {
  requestWindows.clear();
}
