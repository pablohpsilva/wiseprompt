import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a new API key for a wallet address
   */
  async createApiKey(walletAddress: string, createApiKeyDto: CreateApiKeyDto) {
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Generate a random API key
    const key = this.generateApiKey();
    
    // Create expiration date if provided
    let expiresAt = null;
    if (createApiKeyDto.expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + createApiKeyDto.expiresInDays);
    }
    
    // Create the API key
    const apiKey = await this.prisma.apiKey.create({
      data: {
        key,
        name: createApiKeyDto.name,
        walletAddress: normalizedWalletAddress,
        expiresAt,
      },
    });
    
    return {
      id: apiKey.id,
      name: apiKey.name,
      key,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
    };
  }

  /**
   * Get all API keys for a wallet address
   */
  async getApiKeys(walletAddress: string) {
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    const apiKeys = await this.prisma.apiKey.findMany({
      where: {
        walletAddress: normalizedWalletAddress,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      // Don't return the actual key for security
      key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`,
      isActive: key.isActive,
      expiresAt: key.expiresAt,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
    }));
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(walletAddress: string, id: string) {
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Check if the API key exists
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    });
    
    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }
    
    // Check if the API key belongs to the user
    if (apiKey.walletAddress !== normalizedWalletAddress) {
      throw new ForbiddenException('You are not authorized to revoke this API key');
    }
    
    // Deactivate the API key
    await this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
    
    return { success: true };
  }

  /**
   * Verify if an API key is valid
   */
  async verifyApiKey(key: string): Promise<boolean> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key },
    });
    
    if (!apiKey) {
      return false;
    }
    
    if (!apiKey.isActive) {
      return false;
    }
    
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return false;
    }
    
    return true;
  }

  /**
   * Get wallet address associated with an API key
   */
  async getWalletAddressFromApiKey(key: string): Promise<string | null> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key },
      select: { walletAddress: true },
    });
    
    return apiKey?.walletAddress || null;
  }
  
  /**
   * Generate a random API key
   */
  private generateApiKey(): string {
    // Generate a random 32-byte hexadecimal string
    return randomBytes(32).toString('hex');
  }
} 