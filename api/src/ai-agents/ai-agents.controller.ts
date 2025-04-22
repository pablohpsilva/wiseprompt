import { Controller, Get } from "@nestjs/common";
import { AiAgentsService } from "./ai-agents.service";
import { AiAgentDto } from "./dto/ai-agent.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("ai-agents")
@Controller("ai-agents")
export class AiAgentsController {
  constructor(private readonly aiAgentsService: AiAgentsService) {}

  @Get()
  @ApiOperation({ summary: "Get all AI agents" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of all available AI agents.",
    type: [AiAgentDto],
  })
  async findAll(): Promise<AiAgentDto[]> {
    return this.aiAgentsService.findAll();
  }
}
