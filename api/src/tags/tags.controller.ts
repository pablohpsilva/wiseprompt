import { Controller, Get } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { TagDto } from "./dto/tag.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("tags")
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: "Get all tags" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of all available tags.",
    type: [TagDto],
  })
  async findAll(): Promise<TagDto[]> {
    return this.tagsService.findAll();
  }
}
