import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PromptsModule } from "./prompts/prompts.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ApiKeysModule } from "./api-keys/api-keys.module";
import { ExampleModule } from "./example/example.module";
import { TagsModule } from "./tags/tags.module";
import { AiAgentsModule } from "./ai-agents/ai-agents.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PromptsModule,
    ApiKeysModule,
    ExampleModule,
    TagsModule,
    AiAgentsModule,
  ],
})
export class AppModule {}
