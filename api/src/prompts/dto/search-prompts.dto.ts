import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SortOption {
  NEWEST = 'newest',
  POPULAR = 'popular',
  TOP_RATED = 'top-rated',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
}

export class SearchPromptsDto {
  @ApiProperty({ required: false, description: 'Search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, description: 'AI agent to filter by' })
  @IsOptional()
  @IsString()
  aiAgent?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Tags to filter by (comma-separated)'
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Minimum rating to filter by (0-10)', 
    minimum: 0, 
    maximum: 10 
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  minRating?: number;

  @ApiProperty({ 
    required: false, 
    enum: SortOption,
    default: SortOption.NEWEST,
    description: 'Sort option'
  })
  @IsOptional()
  @IsEnum(SortOption)
  sort?: SortOption = SortOption.NEWEST;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;
} 