import { ApiProperty } from "@nestjs/swagger";

export class TagDto {
  @ApiProperty({ example: 1, description: "The unique identifier of the tag" })
  id: number;

  @ApiProperty({ example: "AI", description: "The name of the tag" })
  name: string;
}
