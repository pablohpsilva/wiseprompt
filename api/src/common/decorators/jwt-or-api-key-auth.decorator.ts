import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtOrApiKeyAuthGuard } from '../guards/jwt-or-api-key-auth.guard';

/**
 * Decorator for requiring either JWT or API key authentication
 */
export function JwtOrApiKeyAuth() {
  return applyDecorators(
    UseGuards(JwtOrApiKeyAuthGuard),
    ApiBearerAuth('JWT or API Key'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}