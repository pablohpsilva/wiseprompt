import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { PromptsService } from "./prompts.service";
import { CreatePromptDto } from "./dto/create-prompt.dto";
import { PurchasePromptDto } from "./dto/purchase-prompt.dto";
import { RatePromptDto } from "./dto/rate-prompt.dto";
import { SearchPromptsDto } from "./dto/search-prompts.dto";
import {
  JwtAuthGuard,
  LooseJwtAuthGuard,
} from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@ApiTags("prompts")
@Controller("prompts")
export class PromptsController {
  constructor(private promptsService: PromptsService) {}

  @Get()
  @ApiOperation({ summary: "Search prompts" })
  @ApiResponse({ status: 200, description: "List of prompts" })
  searchPrompts(@Query() searchDto: SearchPromptsDto) {
    return this.promptsService.searchPrompts(searchDto);
  }

  @Get(":id")
  @UseGuards(LooseJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get prompt details" })
  @ApiParam({ name: "id", description: "Prompt ID" })
  @ApiResponse({ status: 200, description: "Prompt details" })
  @ApiResponse({ status: 404, description: "Prompt not found" })
  getPromptById(
    @Param("id") id: string,
    @CurrentUser() user?: { walletAddress: string }
  ) {
    // If user is authenticated, pass their wallet address
    const walletAddress = user?.walletAddress;
    return this.promptsService.getPromptById(id, walletAddress);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new prompt" })
  @ApiResponse({ status: 201, description: "Prompt created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  createPrompt(
    @Body() createPromptDto: CreatePromptDto,
    @CurrentUser() user: { walletAddress: string }
  ) {
    return this.promptsService.createPrompt(
      createPromptDto,
      user.walletAddress
    );
  }

  @Post(":id/purchase")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Purchase a prompt" })
  @ApiParam({ name: "id", description: "Prompt ID" })
  @ApiResponse({ status: 200, description: "Prompt purchased successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Prompt not found" })
  purchasePrompt(
    @Param("id") id: string,
    @Body() purchaseDto: PurchasePromptDto,
    @CurrentUser() user: { walletAddress: string }
  ) {
    return this.promptsService.purchasePrompt(
      id,
      purchaseDto,
      user.walletAddress
    );
  }

  @Post(":id/rate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Rate a prompt" })
  @ApiParam({ name: "id", description: "Prompt ID" })
  @ApiResponse({ status: 200, description: "Prompt rated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - you must purchase the prompt first",
  })
  @ApiResponse({ status: 404, description: "Prompt not found" })
  ratePrompt(
    @Param("id") id: string,
    @Body() rateDto: RatePromptDto,
    @CurrentUser() user: { walletAddress: string }
  ) {
    return this.promptsService.ratePrompt(id, rateDto, user.walletAddress);
  }
}
