import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);
    
    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }
    
    const isValid = await this.validateApiKey(apiKey);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    // Update the last used timestamp
    await this.updateLastUsed(apiKey);
    
    return true;
  }
  
  private extractApiKeyFromHeader(request: Request): string | undefined {
    const apiKey = request.header('X-API-Key');
    
    if (apiKey) {
      return apiKey;
    }
    
    // Also check for Authorization header with format: "ApiKey YOUR_KEY"
    const authHeader = request.header('Authorization');
    if (authHeader && authHeader.startsWith('ApiKey ')) {
      return authHeader.substring(7); // Remove 'ApiKey ' prefix
    }
    
    return undefined;
  }
  
  private async validateApiKey(key: string): Promise<boolean> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key },
    });
    
    if (!apiKey) {
      return false;
    }
    
    // Check if the API key is active
    if (!apiKey.isActive) {
      return false;
    }
    
    // Check if the API key is expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return false;
    }
    
    return true;
  }
  
  private async updateLastUsed(key: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { key },
      data: { lastUsedAt: new Date() },
    });
  }
} 