import { Test, TestingModule } from "@nestjs/testing";
import { ApiKeysService } from "./api-keys.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("ApiKeysService", () => {
  let service: ApiKeysService;
  let mockPrismaService: any;

  const mockApiKey = {
    id: "test-id",
    key: "test-key",
    name: "Test Key",
    walletAddress: "test-wallet",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: null,
    lastUsedAt: null,
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    // Create a mock PrismaService
    mockPrismaService = {
      apiKey: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
    };

    // Create service instance with mock
    service = new ApiKeysService(mockPrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createApiKey", () => {
    it("should create and return a new API key", async () => {
      const walletAddress = "TestWalletAddress";
      const createApiKeyDto = { name: "Test Key" };

      mockPrismaService.apiKey.create.mockResolvedValue(mockApiKey);

      const result = await service.createApiKey(walletAddress, createApiKeyDto);

      expect(mockPrismaService.apiKey.create).toHaveBeenCalled();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("key");
      expect(result.name).toBe(createApiKeyDto.name);
    });

    it("should set an expiration date when expiresInDays is provided", async () => {
      const walletAddress = "TestWalletAddress";
      const createApiKeyDto = { name: "Test Key", expiresInDays: 30 };

      const mockKeyWithExpiration = {
        ...mockApiKey,
        expiresAt: new Date(),
      };

      mockPrismaService.apiKey.create.mockResolvedValue(mockKeyWithExpiration);

      const result = await service.createApiKey(walletAddress, createApiKeyDto);

      expect(mockPrismaService.apiKey.create).toHaveBeenCalled();
      expect(result.expiresAt).toBeDefined();
    });
  });

  describe("getApiKeys", () => {
    it("should return all API keys for a wallet address", async () => {
      const walletAddress = "test-wallet";

      mockPrismaService.apiKey.findMany.mockResolvedValue([mockApiKey]);

      const result = await service.getApiKeys(walletAddress);

      expect(mockPrismaService.apiKey.findMany).toHaveBeenCalledWith({
        where: { walletAddress: walletAddress.toLowerCase() },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("id", mockApiKey.id);
      expect(result[0]).toHaveProperty("name", mockApiKey.name);
      // Make sure full key is not returned
      expect(result[0].key).not.toBe(mockApiKey.key);
      expect(result[0].key).toContain("...");
    });
  });

  describe("revokeApiKey", () => {
    it("should revoke an API key", async () => {
      const walletAddress = "test-wallet";
      const id = "test-id";

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);
      mockPrismaService.apiKey.update.mockResolvedValue({
        ...mockApiKey,
        isActive: false,
      });

      const result = await service.revokeApiKey(walletAddress, id);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id },
        data: { isActive: false },
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw NotFoundException if API key does not exist", async () => {
      const walletAddress = "test-wallet";
      const id = "non-existent-id";

      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      await expect(service.revokeApiKey(walletAddress, id)).rejects.toThrow(
        NotFoundException
      );

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockPrismaService.apiKey.update).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenException if API key belongs to a different wallet", async () => {
      const walletAddress = "different-wallet";
      const id = "test-id";

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);

      await expect(service.revokeApiKey(walletAddress, id)).rejects.toThrow(
        ForbiddenException
      );

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockPrismaService.apiKey.update).not.toHaveBeenCalled();
    });
  });

  describe("verifyApiKey", () => {
    it("should return true for a valid API key", async () => {
      const key = "valid-key";

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockApiKey);

      const result = await service.verifyApiKey(key);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key },
      });
      expect(result).toBe(true);
    });

    it("should return false if API key does not exist", async () => {
      const key = "non-existent-key";

      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      const result = await service.verifyApiKey(key);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key },
      });
      expect(result).toBe(false);
    });

    it("should return false if API key is inactive", async () => {
      const key = "inactive-key";

      mockPrismaService.apiKey.findUnique.mockResolvedValue({
        ...mockApiKey,
        isActive: false,
      });

      const result = await service.verifyApiKey(key);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key },
      });
      expect(result).toBe(false);
    });

    it("should return false if API key is expired", async () => {
      const key = "expired-key";
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockPrismaService.apiKey.findUnique.mockResolvedValue({
        ...mockApiKey,
        expiresAt: pastDate,
      });

      const result = await service.verifyApiKey(key);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key },
      });
      expect(result).toBe(false);
    });
  });

  describe("getWalletAddressFromApiKey", () => {
    it("should return the wallet address for a valid API key", async () => {
      const key = "valid-key";

      mockPrismaService.apiKey.findUnique.mockResolvedValue({
        walletAddress: "test-wallet",
      });

      const result = await service.getWalletAddressFromApiKey(key);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key },
        select: { walletAddress: true },
      });
      expect(result).toBe("test-wallet");
    });

    it("should return null if API key does not exist", async () => {
      const key = "non-existent-key";

      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      const result = await service.getWalletAddressFromApiKey(key);

      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key },
        select: { walletAddress: true },
      });
      expect(result).toBeNull();
    });
  });
});
