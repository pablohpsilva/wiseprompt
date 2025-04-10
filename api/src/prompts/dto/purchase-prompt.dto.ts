import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchasePromptDto {
  @ApiProperty({
    description: 'Transaction hash of the payment',
    example: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  })
  @IsString()
  @IsNotEmpty()
  @Length(66)
  transactionHash: string;
} 