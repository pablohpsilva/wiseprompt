export type AIAgent =
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "Llama"
  | "Mistral"
  | "Other";

export type Keyword = string;

export type PromptReview = {
  id: string;
  userId: string;
  userName: string;
  description: string;
  rating: number; // 0-10
  createdAt: Date;
};

export type Prompt = {
  id: string;
  title: string;
  supportedAgents: AIAgent[];
  keywords: Keyword[];
  description: string;
  outputExamples: string[];
  content: string; // The actual prompt content
  createdAt: Date;
  updatedAt: Date;
  lastTestedAt: Date;
  price: {
    amount: number;
    currency: "USDC" | "USDT" | "DAI" | "BTC"; // BTC for Lightning Network
  };
  sellerId: string;
  sellerName: string;
  reviews: PromptReview[];
};

export type User = {
  id: string;
  address: string; // Wallet address
  name?: string;
  purchasedPrompts: string[]; // Array of prompt IDs
};
