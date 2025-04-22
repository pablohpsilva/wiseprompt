import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Tag } from "@prisma/client";

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }
}
