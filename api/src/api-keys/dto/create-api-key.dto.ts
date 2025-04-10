import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Name of the API key (for reference)',
    example: 'Production Server',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Expiration in days (optional, set to 0 for no expiration)',
    example: 90,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  expiresInDays?: number;
} 