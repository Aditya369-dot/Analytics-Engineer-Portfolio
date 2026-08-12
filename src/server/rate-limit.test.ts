import assert from "node:assert/strict";
import test from "node:test";
import { checkTwinChatRateLimit, resetTwinChatRateLimitForTests } from "./rate-limit.ts";

test("limits repeated twin-chat requests within one minute", () => {
  resetTwinChatRateLimitForTests();
  for (let index = 0; index < 10; index += 1) {
    assert.equal(checkTwinChatRateLimit("visitor", 1_000 + index).allowed, true);
  }

  const limited = checkTwinChatRateLimit("visitor", 2_000);
  assert.equal(limited.allowed, false);
  assert.ok(limited.retryAfterSeconds > 0);
});

test("allows requests after the window expires", () => {
  resetTwinChatRateLimitForTests();
  for (let index = 0; index < 10; index += 1) {
    checkTwinChatRateLimit("visitor", index);
  }

  assert.equal(checkTwinChatRateLimit("visitor", 60_001).allowed, true);
});
