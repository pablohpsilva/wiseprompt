import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePromptDto } from "./dto/create-prompt.dto";
import { PurchasePromptDto } from "./dto/purchase-prompt.dto";
import { RatePromptDto } from "./dto/rate-prompt.dto";
import { SearchPromptsDto, SortOption } from "./dto/search-prompts.dto";

// Define an interface for the search query to fix TypeScript errors
interface WhereClause {
  OR?: Array<any>;
  testedAiAgents?: any;
  tags?: any;
  ratings?: any;
  [key: string]: any;
}

@Injectable()
export class PromptsService {
  constructor(private prisma: PrismaService) {}

  async getAiAgentsAndTags(promptId: string) {
    const _testedAiAgents = await this.prisma.promptAiAgent.findMany({
      where: { promptId },
      include: {
        aiAgent: true,
      },
    });

    const _tags = await this.prisma.promptTag.findMany({
      where: { promptId },
      include: {
        tag: true,
      },
    });

    return {
      testedAiAgents: _testedAiAgents.map((aiAgent) => ({
        ...aiAgent,
        value: aiAgent.aiAgent.id,
        label: aiAgent.aiAgent.name,
      })),
      tags: _tags.map((tag) => ({
        value: tag.tag.id,
        label: tag.tag.name,
      })),
    };
  }

  async searchPrompts(searchDto: SearchPromptsDto) {
    const {
      q,
      // aiAgent,
      // tags,
      minRating,
      sort = SortOption.NEWEST,
      page = 1,
      limit = 10,
    } = searchDto;

    // Build the base query with proper typing
    const where: WhereClause = {};

    // Apply search query
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { goal: { contains: q, mode: "insensitive" } },
      ];
    }

    // // Filter by AI agent
    // if (aiAgent) {
    //   where.testedAiAgents = { has: aiAgent };
    // }

    // // Filter by tags
    // if (tags) {
    //   const tagArray = tags.split(",").map((tag) => tag.trim());
    //   where.tags = {
    //     some: {
    //       tag: {
    //         in: tagArray,
    //       },
    //     },
    //   };
    // }

    // Filter by minimum rating
    if (minRating !== undefined) {
      where.ratings = {
        some: {
          ratingScore: {
            gte: minRating,
          },
        },
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build the order by condition
    let orderBy = {};
    switch (sort) {
      case SortOption.NEWEST:
        orderBy = { createdAt: "desc" };
        break;
      case SortOption.POPULAR:
        // This requires a more complex query with aggregation
        // We'll use a workaround by including purchase count in the results
        orderBy = { createdAt: "desc" }; // Default ordering, we'll sort manually later
        break;
      case SortOption.TOP_RATED:
        // Similar to popular, requires aggregation
        orderBy = { createdAt: "desc" }; // Default ordering, we'll sort manually later
        break;
      case SortOption.PRICE_LOW:
        orderBy = { price: "asc" };
        break;
      case SortOption.PRICE_HIGH:
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Execute the query
    const [prompts, total] = await Promise.all([
      this.prisma.prompt.findMany({
        where,
        include: {
          ratings: {
            select: {
              ratingScore: true,
            },
          },
          purchases: {
            select: {
              id: true,
            },
          },
          currency: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.prompt.count({ where }),
    ]);

    // Format the response and handle manual sorting if needed
    let results = prompts.map((prompt) => {
      // Calculate average rating
      const ratings = prompt.ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.ratingScore, 0) / ratings.length
          : null;

      // Get purchase count
      const purchaseCount = prompt.purchases?.length || 0;

      return {
        id: prompt.id,
        name: prompt.name,
        goal: prompt.goal,
        description: prompt.description,
        // testedAiAgents: prompt.testedAiAgents,
        // tags: prompt.tags.map((tag) => tag.tag),
        rating: avgRating,
        ratingCount: ratings.length,
        purchaseCount,
        price: prompt.price.toNumber(),
        currency: prompt.currency.code,
        createdAt: prompt.createdAt,
        author: prompt.walletAddress,
      };
    });

    // Apply manual sorting for cases that require aggregation
    if (sort === SortOption.POPULAR) {
      results = results.sort((a, b) => b.purchaseCount - a.purchaseCount);
    } else if (sort === SortOption.TOP_RATED) {
      results = results.sort((a, b) => {
        // Handle null ratings
        const ratingA = a.rating ?? 0;
        const ratingB = b.rating ?? 0;
        return ratingB - ratingA;
      });
    }

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPromptById(id: string, walletAddress?: string) {
    const prompt = await this.prisma.prompt.findUnique({
      where: { id },
      include: {
        // tags: true,
        ratings: {
          select: {
            id: true,
            ratingScore: true,
            walletAddress: true,
          },
        },
        purchases: {
          where: walletAddress
            ? { walletAddress: walletAddress.toLowerCase() }
            : undefined,
          take: 1,
        },
        currency: true,
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }

    // Check if the current user has purchased this prompt or is the author
    const isPurchased = prompt.purchases.length > 0;
    const isAuthor =
      walletAddress &&
      prompt.walletAddress.toLowerCase() === walletAddress.toLowerCase();

    // Determine if we should include the full prompt content
    const shouldIncludeContent = isAuthor || isPurchased;

    // Calculate average rating
    const ratings = prompt.ratings || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.ratingScore, 0) / ratings.length
        : null;

    // Check if user has already rated this prompt
    const hasRated =
      walletAddress &&
      ratings.some(
        (r) => r.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      );

    const { testedAiAgents, tags } = await this.getAiAgentsAndTags(prompt.id);

    // Format the response
    return {
      id: prompt.id,
      name: prompt.name,
      goal: prompt.goal,
      description: prompt.description,
      // Only include the full content if the user is the author or has purchased
      prompt: shouldIncludeContent
        ? prompt.content
        : `${prompt.content?.substring(0, 50)}...`,
      testedAiAgents,
      tags,
      rating: avgRating,
      ratingCount: ratings.length,
      price: prompt.price.toNumber(),
      currency: prompt.currency.code,
      promptVersion: prompt.promptVersion,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
      isPurchased,
      isAuthor,
      hasRated,
      author: prompt.walletAddress,
    };
  }

  async purchasePrompt(
    id: string,
    purchaseDto: PurchasePromptDto,
    walletAddress: string
  ) {
    const normalizedWalletAddress = walletAddress.toLowerCase();

    // Check if the prompt exists
    const prompt = await this.prisma.prompt.findUnique({
      where: { id },
      select: {
        id: true,
        walletAddress: true,
        price: true,
        currencyId: true,
        name: true,
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }

    // Check if the user is trying to purchase their own prompt
    if (prompt.walletAddress.toLowerCase() === normalizedWalletAddress) {
      throw new BadRequestException("You cannot purchase your own prompt");
    }

    // Check if the user has already purchased this prompt
    const existingPurchase = await this.prisma.purchase.findFirst({
      where: {
        promptId: id,
        walletAddress: normalizedWalletAddress,
      },
    });

    if (existingPurchase) {
      throw new BadRequestException("You have already purchased this prompt");
    }

    // Create the purchase record
    const purchase = await this.prisma.purchase.create({
      data: {
        promptId: id,
        walletAddress: normalizedWalletAddress,
        transactionHash: purchaseDto.transactionHash,
        price: prompt.price,
        currencyId: prompt.currencyId,
      },
      include: {
        currency: true,
      },
    });

    return {
      id: purchase.id,
      promptId: purchase.promptId,
      purchaseDate: purchase.purchaseDate,
      price: purchase.price.toNumber(),
      currency: purchase.currency.code,
      prompt: {
        name: prompt.name,
      },
    };
  }

  async ratePrompt(id: string, rateDto: RatePromptDto, walletAddress: string) {
    const normalizedWalletAddress = walletAddress.toLowerCase();

    // Check if the prompt exists
    const prompt = await this.prisma.prompt.findUnique({
      where: { id },
      select: {
        id: true,
        walletAddress: true,
        name: true,
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }

    // Check if the user is trying to rate their own prompt
    if (prompt.walletAddress.toLowerCase() === normalizedWalletAddress) {
      throw new BadRequestException("You cannot rate your own prompt");
    }

    // Check if the user has purchased this prompt
    const purchase = await this.prisma.purchase.findFirst({
      where: {
        promptId: id,
        walletAddress: normalizedWalletAddress,
      },
    });

    if (!purchase) {
      throw new ForbiddenException(
        "You must purchase this prompt before rating it"
      );
    }

    // Upsert the rating (create or update)
    const rating = await this.prisma.rating.upsert({
      where: {
        promptId_walletAddress: {
          promptId: id,
          walletAddress: normalizedWalletAddress,
        },
      },
      update: {
        ratingScore: rateDto.ratingScore,
        ratingDescription: rateDto.ratingDescription,
      },
      create: {
        promptId: id,
        walletAddress: normalizedWalletAddress,
        ratingScore: rateDto.ratingScore,
        ratingDescription: rateDto.ratingDescription,
      },
    });

    return {
      id: rating.id,
      promptId: rating.promptId,
      ratingScore: rating.ratingScore,
      ratingDescription: rating.ratingDescription,
      createdAt: rating.createdAt,
      prompt: {
        name: prompt.name,
      },
    };
  }

  async createPrompt(createPromptDto: CreatePromptDto, walletAddress: string) {
    const { tags, testedAiAgents, currency, ...promptData } = createPromptDto;
    const normalizedWalletAddress = walletAddress.toLowerCase();

    // Create the prompt with tags in a transaction
    const prompt = await this.prisma.$transaction(async (prisma) => {
      // Create the prompt
      const newPrompt = await prisma.prompt.create({
        data: {
          ...promptData,
          walletAddress: normalizedWalletAddress,
          // Add any default values needed
          promptVersion: promptData.promptVersion || "1",
          currencyId: Number(currency),
        },
      });

      // Create tags if any
      if (tags && tags.length > 0) {
        const tagCreatePromises = tags.map((tag) =>
          prisma.promptTag.create({
            data: {
              promptId: newPrompt.id,
              tagId: Number(tag),
            },
          })
        );

        await Promise.all(tagCreatePromises);
      }

      // Create AI agents if any
      if (testedAiAgents && testedAiAgents.length > 0) {
        const agentCreatePromises = testedAiAgents.map((agent) =>
          prisma.promptAiAgent.create({
            data: {
              promptId: newPrompt.id,
              aiAgentId: Number(agent),
            },
          })
        );

        await Promise.all(agentCreatePromises);
      }

      // Return the created prompt with tags
      return await prisma.prompt.findUnique({
        where: { id: newPrompt.id },
        include: {
          currency: true,
        },
      });
    });

    const { testedAiAgents: _testedAiAgents, tags: _tags } =
      await this.getAiAgentsAndTags(prompt.id);

    return {
      id: prompt.id,
      name: prompt.name,
      goal: prompt.goal,
      description: prompt.description,
      promptVersion: prompt.promptVersion,
      testedAiAgents: _testedAiAgents,
      tags: _tags,
      price: prompt.price.toNumber(),
      currency: prompt.currency.code,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
      author: prompt.walletAddress,
    };
  }
}
