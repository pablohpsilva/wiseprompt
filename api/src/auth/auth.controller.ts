import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { NonceRequestDto } from './dto/nonce-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('nonce')
  @ApiOperation({ summary: 'Get a nonce for signing' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a nonce to be used in the signing process',
    schema: {
      type: 'object',
      properties: {
        nonce: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  getNonce(@Body() nonceRequestDto: NonceRequestDto) {
    return this.authService.generateNonce(nonceRequestDto.walletAddress);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a signature and issue a JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a JWT token if signature is valid',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  verifySignature(@Body() verifySignatureDto: VerifySignatureDto) {
    return this.authService.verifySignature(verifySignatureDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user info' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns information about the authenticated user',
    schema: {
      type: 'object',
      properties: {
        walletAddress: { type: 'string' }
      }
    }
  })
  getMe(@Req() req) {
    return { walletAddress: req.user.walletAddress };
  }
} 