import { Module } from "@nestjs/common";
import { AiAgentsService } from "./ai-agents.service";
import { AiAgentsController } from "./ai-agents.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AiAgentsController],
  providers: [AiAgentsService],
})
export class AiAgentsModule {}
