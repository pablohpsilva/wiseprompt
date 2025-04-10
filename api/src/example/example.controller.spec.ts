import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ExampleController', () => {
  let controller: ExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
    }).compile();

    controller = module.get<ExampleController>(ExampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('jwtOnlyEndpoint', () => {
    it('should return user wallet address and auth method', async () => {
      const user = { walletAddress: 'test-wallet' };
      const result = await controller.jwtOnlyEndpoint(user);
      
      expect(result).toEqual({
        message: 'This endpoint requires JWT authentication',
        authenticatedAs: user.walletAddress,
        authMethod: 'JWT'
      });
    });
  });

  describe('apiKeyOnlyEndpoint', () => {
    it('should return user wallet address and auth method', async () => {
      const user = { walletAddress: 'test-wallet' };
      const result = await controller.apiKeyOnlyEndpoint(user);
      
      expect(result).toEqual({
        message: 'This endpoint requires API key authentication',
        authenticatedAs: user.walletAddress,
        authMethod: 'API Key'
      });
    });
  });

  describe('jwtOrApiKeyEndpoint', () => {
    it('should return user wallet address and auth method', async () => {
      const user = { walletAddress: 'test-wallet' };
      const result = await controller.jwtOrApiKeyEndpoint(user);
      
      expect(result).toEqual({
        message: 'This endpoint accepts either JWT or API key authentication',
        authenticatedAs: user.walletAddress,
        authMethod: 'JWT or API Key'
      });
    });
  });
}); 