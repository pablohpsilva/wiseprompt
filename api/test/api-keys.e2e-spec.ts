import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('API Keys (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  let testApiKey: string;
  let apiKeyId: string;
  
  const TEST_WALLET_ADDRESS = '0x' + randomBytes(20).toString('hex').toLowerCase();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    
    // Create a JWT token for testing
    authToken = jwtService.sign({ 
      sub: TEST_WALLET_ADDRESS 
    }, {
      issuer: 'wiseprompt.io',
    });
    
    // Clean up any existing data for the test wallet
    await prismaService.apiKey.deleteMany({
      where: { walletAddress: TEST_WALLET_ADDRESS }
    });
  });

  afterAll(async () => {
    // Clean up
    await prismaService.apiKey.deleteMany({
      where: { walletAddress: TEST_WALLET_ADDRESS }
    });
    
    await app.close();
  });

  describe('/api/api-keys (POST)', () => {
    it('should create a new API key', async () => {
      const createApiKeyDto = {
        name: 'Test API Key',
        expiresInDays: 30
      };
      
      const response = await request(app.getHttpServer())
        .post('/api/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createApiKeyDto)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', createApiKeyDto.name);
      expect(response.body).toHaveProperty('key');
      expect(response.body).toHaveProperty('expiresAt');
      expect(response.body).toHaveProperty('createdAt');
      
      // Save for later tests
      testApiKey = response.body.key;
      apiKeyId = response.body.id;
    });
    
    it('should require authentication', async () => {
      const createApiKeyDto = {
        name: 'Test API Key',
        expiresInDays: 30
      };
      
      await request(app.getHttpServer())
        .post('/api/api-keys')
        .send(createApiKeyDto)
        .expect(401);
    });
    
    it('should validate the request body', async () => {
      const invalidDto = {
        // Missing name
        expiresInDays: 30
      };
      
      await request(app.getHttpServer())
        .post('/api/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/api/api-keys (GET)', () => {
    it('should return all API keys for the authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      // Key should be masked
      expect(response.body[0].key).toContain('...');
    });
    
    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/api-keys')
        .expect(401);
    });
  });

  describe('/api/example/api-key-only (GET)', () => {
    it('should allow access with valid API key', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/example/api-key-only')
        .set('X-API-Key', testApiKey)
        .expect(200);
        
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('authenticatedAs', TEST_WALLET_ADDRESS);
      expect(response.body).toHaveProperty('authMethod', 'API Key');
    });
    
    it('should allow access with API key in Authorization header', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/example/api-key-only')
        .set('Authorization', `ApiKey ${testApiKey}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('authenticatedAs', TEST_WALLET_ADDRESS);
    });
    
    it('should reject invalid API key', async () => {
      await request(app.getHttpServer())
        .get('/api/example/api-key-only')
        .set('X-API-Key', 'invalid-key')
        .expect(401);
    });
  });

  describe('/api/example/jwt-or-api-key (GET)', () => {
    it('should allow access with JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/example/jwt-or-api-key')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('authenticatedAs', TEST_WALLET_ADDRESS);
    });
    
    it('should allow access with API key', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/example/jwt-or-api-key')
        .set('X-API-Key', testApiKey)
        .expect(200);
        
      expect(response.body).toHaveProperty('authenticatedAs', TEST_WALLET_ADDRESS);
    });
    
    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/example/jwt-or-api-key')
        .expect(401);
    });
  });

  describe('/api/api-keys/:id (DELETE)', () => {
    it('should revoke an API key', async () => {
      await request(app.getHttpServer())
        .delete(`/api/api-keys/${apiKeyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      // Verify the key is revoked
      const apiKey = await prismaService.apiKey.findUnique({
        where: { id: apiKeyId }
      });
      
      expect(apiKey.isActive).toBe(false);
      
      // Attempt to use the revoked key
      await request(app.getHttpServer())
        .get('/api/example/api-key-only')
        .set('X-API-Key', testApiKey)
        .expect(401);
    });
    
    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/api-keys/${apiKeyId}`)
        .expect(401);
    });
    
    it('should return 404 for non-existent API key', async () => {
      await request(app.getHttpServer())
        .delete('/api/api-keys/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
}); 