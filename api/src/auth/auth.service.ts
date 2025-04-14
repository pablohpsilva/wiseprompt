import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { generateNonce, SiweMessage } from "siwe";
import { randomBytes } from "crypto";
import { VerifySignatureDto } from "./dto/verify-signature.dto";
import { PrismaService } from "../prisma/prisma.service";
import {
  createSiweMessage,
  getSiweMessageString,
} from "./utils/siwe-message.util";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  async generateNonce(
    walletAddress?: string
  ): Promise<{ nonce: string; expiresAt: Date; message?: string }> {
    try {
      // const nonce = randomBytes(32).toString("hex");
      const nonce = generateNonce();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Expires in 5 minutes

      if (walletAddress) {
        // If wallet address provided, store nonce in database
        await this.prisma.authNonce.upsert({
          // where: { walletAddress: walletAddress.toLowerCase() },
          where: { walletAddress },
          update: {
            nonce,
            expiresAt,
          },
          create: {
            // walletAddress: walletAddress.toLowerCase(),
            walletAddress,
            nonce,
            expiresAt,
          },
        });

        // Generate SIWE message
        const message = getSiweMessageString(
          walletAddress,
          nonce,
          this.configService
        );
        return { nonce, expiresAt, message };
      }

      return { nonce, expiresAt };
    } catch (error) {
      console.error("Error generating nonce:", error);
      throw error;
    }
  }

  async verifySignature(
    verifySignatureDto: VerifySignatureDto
  ): Promise<{ token: string }> {
    const {
      signature,
      address: walletAddress,
      nonce,
      message: _message,
    } = verifySignatureDto;

    // Check if nonce exists and is valid
    const storedNonce = await this.prisma.authNonce.findUnique({
      where: { walletAddress },
    });

    if (
      !storedNonce ||
      storedNonce.nonce !== nonce ||
      storedNonce.expiresAt < new Date()
    ) {
      throw new UnauthorizedException("Invalid or expired nonce");
    }

    try {
      let SIWEObject = new SiweMessage(_message);
      const { data: message } = await SIWEObject.verify({ signature, nonce });

      console.log("message", message);

      // Generate JWT token with wallet address as subject
      const token = this.jwtService.sign({
        sub: walletAddress,
      });

      // Remove used nonce
      await this.prisma.authNonce.delete({
        where: { walletAddress },
      });

      return { token };
    } catch (error) {
      console.error("Signature verification error:", error);
      throw new UnauthorizedException("Failed to verify signature");
    }
  }
}
