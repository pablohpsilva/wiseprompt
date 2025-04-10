import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional } from 'class-validator';

export class NonceRequestDto {
  @ApiProperty({
    description: 'Ethereum wallet address (optional)',
    example: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    required: false,
  })
  @IsEthereumAddress()
  @IsOptional()
  walletAddress?: string;
} 