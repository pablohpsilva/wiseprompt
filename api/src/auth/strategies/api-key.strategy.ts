import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    private apiKeysService: ApiKeysService,
    private prisma: PrismaService
  ) {
    super();
  }

  async validate(apiKey: string) {
    // Verify the API key
    const isValid = await this.apiKeysService.verifyApiKey(apiKey);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    // Get the wallet address associated with the API key
    const walletAddress = await this.apiKeysService.getWalletAddressFromApiKey(apiKey);
    
    if (!walletAddress) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    // Update the last used timestamp for the API key
    await this.prisma.apiKey.updateMany({
      where: { key: apiKey },
      data: { lastUsedAt: new Date() },
    });
    
    // Return the user object (wallet address) to be stored in the request
    return { walletAddress };
  }
} 