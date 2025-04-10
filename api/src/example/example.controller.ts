import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';
import { ApiKeyAuth } from '../common/decorators/api-key-auth.decorator';
import { JwtOrApiKeyAuth } from '../common/decorators/jwt-or-api-key-auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('example')
@Controller('example')
export class ExampleController {
  
  @Get('jwt-only')
  @JwtAuth()
  @ApiOperation({ summary: 'Protected endpoint - JWT authentication only' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user info' })
  async jwtOnlyEndpoint(@CurrentUser() user: { walletAddress: string }) {
    return {
      message: 'This endpoint requires JWT authentication',
      authenticatedAs: user.walletAddress,
      authMethod: 'JWT'
    };
  }

  @Get('api-key-only')
  @ApiKeyAuth()
  @ApiOperation({ summary: 'Protected endpoint - API key authentication only' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user info' })
  async apiKeyOnlyEndpoint(@CurrentUser() user: { walletAddress: string }) {
    return {
      message: 'This endpoint requires API key authentication',
      authenticatedAs: user.walletAddress,
      authMethod: 'API Key'
    };
  }

  @Get('jwt-or-api-key')
  @JwtOrApiKeyAuth()
  @ApiOperation({ summary: 'Protected endpoint - JWT or API key authentication' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user info' })
  async jwtOrApiKeyEndpoint(@CurrentUser() user: { walletAddress: string }) {
    return {
      message: 'This endpoint accepts either JWT or API key authentication',
      authenticatedAs: user.walletAddress,
      authMethod: 'JWT or API Key'
    };
  }
} 