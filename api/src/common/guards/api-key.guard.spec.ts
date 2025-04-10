import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ApiKeyGuard } from "./api-key.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("ApiKeyGuard", () => {
  let guard: ApiKeyGuard;
  let mockPrismaService: any;

  const mockValidApiKey = {
    id: "test-id",
    key: "valid-key",
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

    mockPrismaService = {
      apiKey: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    guard = new ApiKeyGuard(mockPrismaService);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  describe("canActivate", () => {
    it("should return true for valid API key in X-API-Key header", async () => {
      const apiKey = "valid-key";
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            header: vi.fn((name) => (name === "X-API-Key" ? apiKey : null)),
          }),
        }),
      } as ExecutionContext;

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockValidApiKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockValidApiKey);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key: apiKey },
      });
      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { key: apiKey },
        data: { lastUsedAt: expect.any(Date) },
      });
    });

    it("should return true for valid API key in Authorization header", async () => {
      const apiKey = "valid-key";
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            header: vi.fn((name) => {
              if (name === "X-API-Key") return null;
              if (name === "Authorization") return `ApiKey ${apiKey}`;
              return null;
            }),
          }),
        }),
      } as ExecutionContext;

      mockPrismaService.apiKey.findUnique.mockResolvedValue(mockValidApiKey);
      mockPrismaService.apiKey.update.mockResolvedValue(mockValidApiKey);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key: apiKey },
      });
      expect(mockPrismaService.apiKey.update).toHaveBeenCalledWith({
        where: { key: apiKey },
        data: { lastUsedAt: expect.any(Date) },
      });
    });

    it("should throw UnauthorizedException for missing API key", async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            header: vi.fn(() => null),
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockPrismaService.apiKey.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.apiKey.update).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException for invalid API key", async () => {
      const apiKey = "invalid-key";
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            header: vi.fn((name) => (name === "X-API-Key" ? apiKey : null)),
          }),
        }),
      } as ExecutionContext;

      mockPrismaService.apiKey.findUnique.mockResolvedValue(null);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key: apiKey },
      });
      expect(mockPrismaService.apiKey.update).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException for inactive API key", async () => {
      const apiKey = "inactive-key";
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            header: vi.fn((name) => (name === "X-API-Key" ? apiKey : null)),
          }),
        }),
      } as ExecutionContext;

      mockPrismaService.apiKey.findUnique.mockResolvedValue({
        ...mockValidApiKey,
        isActive: false,
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key: apiKey },
      });
      expect(mockPrismaService.apiKey.update).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException for expired API key", async () => {
      const apiKey = "expired-key";
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            header: vi.fn((name) => (name === "X-API-Key" ? apiKey : null)),
          }),
        }),
      } as ExecutionContext;

      mockPrismaService.apiKey.findUnique.mockResolvedValue({
        ...mockValidApiKey,
        expiresAt: pastDate,
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockPrismaService.apiKey.findUnique).toHaveBeenCalledWith({
        where: { key: apiKey },
      });
      expect(mockPrismaService.apiKey.update).not.toHaveBeenCalled();
    });
  });
});
