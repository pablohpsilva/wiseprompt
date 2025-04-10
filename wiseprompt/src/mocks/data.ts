import { Prompt, User } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Alice",
    purchasedPrompts: ["1", "2"],
  },
  {
    id: "2",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Bob",
    purchasedPrompts: ["3"],
  },
  {
    id: "3",
    address: "0x7890abcdef1234567890abcdef1234567890abcd",
    purchasedPrompts: [],
  },
];

// Mock prompts
export const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Advanced SEO Content Generator",
    supportedAgents: ["ChatGPT", "Claude"],
    keywords: ["SEO", "Content Creation", "Blog Writing"],
    description:
      "Generate SEO-optimized content with proper keyword density and structure.",
    outputExamples: [
      "Example of generated SEO-optimized blog post...",
      "Example of generated meta description and title tags...",
    ],
    content:
      "You are an expert SEO content writer. Your task is to create content that is optimized for search engines while being engaging for readers. [DETAILED PROMPT INSTRUCTIONS HERE]",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-11-20"),
    lastTestedAt: new Date("2023-12-01"),
    price: {
      amount: 15,
      currency: "USDC",
    },
    sellerId: "1",
    sellerName: "Alice",
    reviews: [
      {
        id: uuidv4(),
        userId: "2",
        userName: "Bob",
        description: "Amazing prompt, got me ranking #1 on Google!",
        rating: 9,
        createdAt: new Date("2023-12-05"),
      },
    ],
  },
  {
    id: "2",
    title: "Product Description Generator",
    supportedAgents: ["ChatGPT", "Gemini", "Claude"],
    keywords: ["E-commerce", "Product Descriptions", "Sales Copy"],
    description:
      "Create compelling product descriptions that convert viewers to buyers.",
    outputExamples: [
      "Example of luxury product description...",
      "Example of technical product specification...",
    ],
    content:
      "You are a skilled e-commerce copywriter specializing in product descriptions. [DETAILED PROMPT INSTRUCTIONS HERE]",
    createdAt: new Date("2023-09-10"),
    updatedAt: new Date("2023-10-25"),
    lastTestedAt: new Date("2023-11-15"),
    price: {
      amount: 10,
      currency: "USDT",
    },
    sellerId: "2",
    sellerName: "Bob",
    reviews: [
      {
        id: uuidv4(),
        userId: "1",
        userName: "Alice",
        description: "Boosted my conversion rate by 30%!",
        rating: 10,
        createdAt: new Date("2023-11-20"),
      },
    ],
  },
  {
    id: "3",
    title: "Code Review & Refactoring Assistant",
    supportedAgents: ["ChatGPT", "Claude"],
    keywords: ["Programming", "Code Review", "Refactoring"],
    description: "Get AI-powered code reviews and suggestions for refactoring.",
    outputExamples: [
      "Example of code review feedback...",
      "Example of refactored code with explanation...",
    ],
    content:
      "You are a senior software engineer conducting code reviews. [DETAILED PROMPT INSTRUCTIONS HERE]",
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-12-10"),
    lastTestedAt: new Date("2023-12-15"),
    price: {
      amount: 25,
      currency: "DAI",
    },
    sellerId: "1",
    sellerName: "Alice",
    reviews: [],
  },
  {
    id: "4",
    title: "AI Story Generator",
    supportedAgents: ["ChatGPT", "Claude", "Gemini", "Llama"],
    keywords: ["Creative Writing", "Storytelling", "Fiction"],
    description: "Generate engaging short stories in various genres.",
    outputExamples: [
      "Example of sci-fi short story...",
      "Example of fantasy adventure story...",
    ],
    content:
      "You are a creative fiction writer with expertise in multiple genres. [DETAILED PROMPT INSTRUCTIONS HERE]",
    createdAt: new Date("2023-08-20"),
    updatedAt: new Date("2023-09-15"),
    lastTestedAt: new Date("2023-10-01"),
    price: {
      amount: 0.0005,
      currency: "BTC",
    },
    sellerId: "2",
    sellerName: "Bob",
    reviews: [],
  },
];

// Function to get a user's purchased prompts
export const getUserPurchasedPrompts = (userId: string): Prompt[] => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return [];

  return mockPrompts.filter((prompt) =>
    user.purchasedPrompts.includes(prompt.id)
  );
};

// Function to check if a user has purchased a prompt
export const hasUserPurchasedPrompt = (
  userId: string,
  promptId: string
): boolean => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return false;

  return user.purchasedPrompts.includes(promptId);
};
