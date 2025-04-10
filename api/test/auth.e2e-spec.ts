import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  
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
    
    // Clean up any existing data for the test wallet
    await prismaService.authNonce.deleteMany({
      where: { walletAddress: TEST_WALLET_ADDRESS }
    });
  });

  afterAll(async () => {
    // Clean up
    await prismaService.authNonce.deleteMany({
      where: { walletAddress: TEST_WALLET_ADDRESS }
    });
    
    await app.close();
  });
  
  // Since we cannot actually sign messages with a wallet in the test environment,
  // we'll test the JWT authentication flow which is used after a successful wallet signature verification
  
  describe('JWT Authentication', () => {
    let authToken: string;
    
    beforeEach(() => {
      // Create a JWT token for testing
      authToken = jwtService.sign({ 
        sub: TEST_WALLET_ADDRESS 
      }, {
        issuer: 'wiseprompt.io',
      });
    });
    
    it('should allow access to protected endpoints with valid JWT', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/example/jwt-only')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('authenticatedAs', TEST_WALLET_ADDRESS);
      expect(response.body).toHaveProperty('authMethod', 'JWT');
    });
    
    it('should reject access to protected endpoints with invalid JWT', async () => {
      const invalidToken = authToken + 'invalid';
      
      await request(app.getHttpServer())
        .get('/api/example/jwt-only')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });
    
    it('should reject access to protected endpoints without JWT', async () => {
      await request(app.getHttpServer())
        .get('/api/example/jwt-only')
        .expect(401);
    });
    
    it('should not accept API key for JWT-only endpoints', async () => {
      // Create an API key for testing
      const createApiKeyResponse = await request(app.getHttpServer())
        .post('/api/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test API Key',
          expiresInDays: 30
        })
        .expect(201);
      
      const apiKey = createApiKeyResponse.body.key;
      
      // Try to use the API key for a JWT-only endpoint
      await request(app.getHttpServer())
        .get('/api/example/jwt-only')
        .set('X-API-Key', apiKey)
        .expect(401);
      
      // Clean up
      await prismaService.apiKey.deleteMany({
        where: { walletAddress: TEST_WALLET_ADDRESS }
      });
    });
  });
}); 