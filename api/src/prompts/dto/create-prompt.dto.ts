import { IsString, IsNotEmpty, IsNumber, Min, IsArray, IsOptional, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePromptDto {
  @ApiProperty({
    description: 'Name of the prompt',
    example: 'Effective Email Writing Assistant',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Goal of the prompt',
    example: 'Help users write professional and effective emails',
  })
  @IsString()
  @IsNotEmpty()
  goal: string;

  @ApiProperty({
    description: 'Detailed description of the prompt',
    example: 'This prompt helps you craft professional emails with the right tone and structure...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'AI agents this prompt has been tested with',
    example: ['GPT-4', 'Claude', 'Gemini'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  testedAiAgents: string[];

  @ApiProperty({
    description: 'Version of the prompt',
    example: '1.0.0',
    required: false,
  })
  @IsString()
  @IsOptional()
  promptVersion?: string;

  @ApiProperty({
    description: 'Price of the prompt',
    example: 5.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Currency for the price',
    example: 'USDC',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Tags for the prompt',
    example: ['productivity', 'business', 'email'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
} 