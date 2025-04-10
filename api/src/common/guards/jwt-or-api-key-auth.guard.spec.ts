import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { JwtOrApiKeyAuthGuard } from "./jwt-or-api-key-auth.guard";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Create a mock module to avoid the actual AuthGuard implementation
vi.mock("@nestjs/passport", () => ({
  AuthGuard: () => {
    return class MockAuthGuard {
      canActivate() {
        return true;
      }
    };
  },
}));

describe("JwtOrApiKeyAuthGuard", () => {
  let guard: JwtOrApiKeyAuthGuard;

  beforeEach(async () => {
    guard = new JwtOrApiKeyAuthGuard();

    // Mock the handleRequest method for testing
    guard.handleRequest = vi.fn(guard.handleRequest);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  describe("handleRequest", () => {
    it("should return the user when user is present and no error", () => {
      const user = { walletAddress: "test-wallet" };
      const originalHandleRequest = vi.spyOn(
        JwtOrApiKeyAuthGuard.prototype,
        "handleRequest"
      );

      const result = guard.handleRequest(null, user, null);

      expect(result).toBe(user);
    });

    it("should throw UnauthorizedException when no user is present", () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        UnauthorizedException
      );
      expect(() => guard.handleRequest(null, null, null)).toThrow(
        "Authentication required. Use either JWT or API Key."
      );
    });

    it("should throw original error when error is present", () => {
      const error = new Error("Test error");
      expect(() => guard.handleRequest(error, null, null)).toThrow(error);
    });
  });
});
