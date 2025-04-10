import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { ApiKeyStrategy } from "./api-key.strategy";
import { ApiKeysService } from "../../api-keys/api-keys.service";
import { PrismaService } from "../../prisma/prisma.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the Strategy from passport-http-bearer
vi.mock("passport-http-bearer", () => {
  return {
    Strategy: class MockStrategy {
      constructor(verify) {
        this.name = "bearer";
        this.verify = verify;
      }
    },
  };
});

describe("ApiKeyStrategy", () => {
  let strategy: ApiKeyStrategy;
  let mockApiKeysService: any;
  let mockPrismaService: any;

  beforeEach(async () => {
    vi.resetAllMocks();

    // Create mocks
    mockApiKeysService = {
      verifyApiKey: vi.fn(),
      getWalletAddressFromApiKey: vi.fn(),
    };

    mockPrismaService = {
      apiKey: {
        updateMany: vi.fn(),
      },
    };

    // Create strategy instance with mocks
    strategy = new ApiKeyStrategy(mockApiKeysService, mockPrismaService);
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  describe("validate", () => {
    it("should return user object for valid API key", async () => {
      const apiKey = "valid-api-key";
      const walletAddress = "test-wallet";

      mockApiKeysService.verifyApiKey.mockResolvedValue(true);
      mockApiKeysService.getWalletAddressFromApiKey.mockResolvedValue(
        walletAddress
      );
      mockPrismaService.apiKey.updateMany.mockResolvedValue({ count: 1 });

      const result = await strategy.validate(apiKey);

      expect(mockApiKeysService.verifyApiKey).toHaveBeenCalledWith(apiKey);
      expect(
        mockApiKeysService.getWalletAddressFromApiKey
      ).toHaveBeenCalledWith(apiKey);
      expect(mockPrismaService.apiKey.updateMany).toHaveBeenCalledWith({
        where: { key: apiKey },
        data: expect.objectContaining({ lastUsedAt: expect.any(Date) }),
      });
      expect(result).toEqual({ walletAddress });
    });

    it("should throw UnauthorizedException for invalid API key", async () => {
      const apiKey = "invalid-api-key";

      mockApiKeysService.verifyApiKey.mockResolvedValue(false);

      await expect(strategy.validate(apiKey)).rejects.toThrow(
        UnauthorizedException
      );

      expect(mockApiKeysService.verifyApiKey).toHaveBeenCalledWith(apiKey);
      expect(
        mockApiKeysService.getWalletAddressFromApiKey
      ).not.toHaveBeenCalled();
      expect(mockPrismaService.apiKey.updateMany).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if wallet address not found", async () => {
      const apiKey = "valid-api-key-no-wallet";

      mockApiKeysService.verifyApiKey.mockResolvedValue(true);
      mockApiKeysService.getWalletAddressFromApiKey.mockResolvedValue(null);

      await expect(strategy.validate(apiKey)).rejects.toThrow(
        UnauthorizedException
      );

      expect(mockApiKeysService.verifyApiKey).toHaveBeenCalledWith(apiKey);
      expect(
        mockApiKeysService.getWalletAddressFromApiKey
      ).toHaveBeenCalledWith(apiKey);
      expect(mockPrismaService.apiKey.updateMany).not.toHaveBeenCalled();
    });
  });
});
