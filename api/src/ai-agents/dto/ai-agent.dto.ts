import { ApiProperty } from "@nestjs/swagger";

export class AiAgentDto {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the AI agent",
  })
  id: number;

  @ApiProperty({ example: "ChatGPT", description: "The name of the AI agent" })
  name: string;
}
