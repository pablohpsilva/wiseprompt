import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../guards/api-key-auth.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Decorator for requiring API key authentication
 */
export function ApiKeyAuth() {
  return applyDecorators(
    UseGuards(ApiKeyAuthGuard),
    ApiBearerAuth('apiKey'),
    ApiUnauthorizedResponse({ description: 'Invalid API key' }),
  );
} 