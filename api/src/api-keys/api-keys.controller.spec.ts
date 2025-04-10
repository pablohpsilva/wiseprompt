import { Test, TestingModule } from "@nestjs/testing";
import { ApiKeysController } from "./api-keys.controller";
import { ApiKeysService } from "./api-keys.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("ApiKeysController", () => {
  let controller: ApiKeysController;
  let mockApiKeysService: any;

  beforeEach(async () => {
    // Create mock service methods
    mockApiKeysService = {
      createApiKey: vi.fn(),
      getApiKeys: vi.fn(),
      revokeApiKey: vi.fn(),
    };

    // Create the controller manually with the mocked service
    controller = new ApiKeysController(mockApiKeysService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createApiKey", () => {
    it("should call service.createApiKey with correct parameters", async () => {
      const createApiKeyDto: CreateApiKeyDto = {
        name: "Test Key",
        expiresInDays: 30,
      };

      const user = { walletAddress: "test-wallet" };
      const expectedResult = {
        id: "test-id",
        name: "Test Key",
        key: "test-key",
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      mockApiKeysService.createApiKey.mockResolvedValue(expectedResult);

      const result = await controller.createApiKey(createApiKeyDto, user);

      expect(mockApiKeysService.createApiKey).toHaveBeenCalledWith(
        user.walletAddress,
        createApiKeyDto
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe("getApiKeys", () => {
    it("should call service.getApiKeys with correct wallet address", async () => {
      const user = { walletAddress: "test-wallet" };
      const expectedResult = [
        {
          id: "test-id",
          name: "Test Key",
          key: "masked-key",
          isActive: true,
          expiresAt: new Date(),
          lastUsedAt: null,
          createdAt: new Date(),
        },
      ];

      mockApiKeysService.getApiKeys.mockResolvedValue(expectedResult);

      const result = await controller.getApiKeys(user);

      expect(mockApiKeysService.getApiKeys).toHaveBeenCalledWith(
        user.walletAddress
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe("revokeApiKey", () => {
    it("should call service.revokeApiKey with correct parameters", async () => {
      const id = "test-id";
      const user = { walletAddress: "test-wallet" };
      const expectedResult = { success: true };

      mockApiKeysService.revokeApiKey.mockResolvedValue(expectedResult);

      const result = await controller.revokeApiKey(id, user);

      expect(mockApiKeysService.revokeApiKey).toHaveBeenCalledWith(
        user.walletAddress,
        id
      );
      expect(result).toBe(expectedResult);
    });
  });
});
