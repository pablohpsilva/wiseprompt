import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiAgent } from "@prisma/client";

@Injectable()
export class AiAgentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<AiAgent[]> {
    return this.prisma.aiAgent.findMany();
  }
}
