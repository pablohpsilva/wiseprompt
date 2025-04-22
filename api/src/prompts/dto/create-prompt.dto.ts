import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
  ArrayMinSize,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreatePromptDto {
  @ApiProperty({
    description: "Name of the prompt",
    example: "Effective Email Writing Assistant",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Goal of the prompt",
    example: "Help users write professional and effective emails",
  })
  @IsString()
  @IsNotEmpty()
  goal: string;

  @ApiProperty({
    description: "Detailed description of the prompt",
    example:
      "This prompt helps you craft professional emails with the right tone and structure...",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description:
      "Prompt. The actual prompt. This is only available for the user who created it or users who have purchased it.",
    example:
      "This prompt helps you craft professional emails with the right tone and structure...",
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description:
      "AI agents this prompt has been tested with. It depends on the AiAgent table. Use AiAgent columnd ID (NUMBER)",
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  testedAiAgents: number[];

  @ApiProperty({
    description: "Version of the prompt",
    example: "1.0.0",
    required: false,
  })
  @IsString()
  @IsOptional()
  promptVersion?: string;

  @ApiProperty({
    description: "Price of the prompt",
    example: 5.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: "Currency for the price",
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  currency: Number;

  @ApiProperty({
    description:
      "Tags for the prompt. It depends on the Tag table. Use Tag column ID (NUMBER)",
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  tags: number[];
}
