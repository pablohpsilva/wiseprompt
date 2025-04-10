import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RatePromptDto {
  @ApiProperty({
    description: 'Rating score from 0 to 10',
    example: 8,
    minimum: 0,
    maximum: 10,
  })
  @IsInt()
  @Min(0)
  @Max(10)
  ratingScore: number;

  @ApiProperty({
    description: 'Optional description of the rating',
    example: 'This prompt is excellent and saved me hours of work!',
    required: false,
  })
  @IsString()
  @IsOptional()
  ratingDescription?: string;
} 