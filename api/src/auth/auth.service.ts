import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SiweMessage } from 'siwe';
import { randomBytes } from 'crypto';
import { VerifySignatureDto } from './dto/verify-signature.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createSiweMessage, getSiweMessageString } from './utils/siwe-message.util';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async generateNonce(walletAddress?: string): Promise<{ nonce: string, expiresAt: Date, message?: string }> {
    const nonce = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Expires in 5 minutes
    
    if (walletAddress) {
      // If wallet address provided, store nonce in database
      await this.prisma.authNonce.upsert({
        where: { walletAddress: walletAddress.toLowerCase() },
        update: { 
          nonce,
          expiresAt 
        },
        create: {
          walletAddress: walletAddress.toLowerCase(),
          nonce,
          expiresAt
        }
      });
      
      // Generate SIWE message
      const message = getSiweMessageString(walletAddress, nonce, this.configService);
      return { nonce, expiresAt, message };
    }
    
    return { nonce, expiresAt };
  }

  async verifySignature(verifySignatureDto: VerifySignatureDto): Promise<{ token: string }> {
    const { signature, address, nonce } = verifySignatureDto;
    const normalizedAddress = address.toLowerCase();
    
    // Check if nonce exists and is valid
    const storedNonce = await this.prisma.authNonce.findUnique({
      where: { walletAddress: normalizedAddress }
    });
    
    if (!storedNonce || storedNonce.nonce !== nonce || storedNonce.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired nonce');
    }
    
    try {
      // Create SIWE message and verify signature
      const message = createSiweMessage(normalizedAddress, nonce, this.configService);
      const messageToVerify = message.prepareMessage();
      
      // Verify the signature
      const siweResponse = await new SiweMessage(messageToVerify).verify({
        signature,
        domain: this.configService.get('DOMAIN') || 'wiseprompt.io',
        nonce,
      });
      
      if (!siweResponse.success) {
        throw new UnauthorizedException('Invalid signature');
      }
      
      // Generate JWT token with wallet address as subject
      const token = this.jwtService.sign({
        sub: normalizedAddress,
      });
      
      // Remove used nonce
      await this.prisma.authNonce.delete({
        where: { walletAddress: normalizedAddress }
      });
      
      return { token };
    } catch (error) {
      console.error('Signature verification error:', error);
      throw new UnauthorizedException('Failed to verify signature');
    }
  }
} 