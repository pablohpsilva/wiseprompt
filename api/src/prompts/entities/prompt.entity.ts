export class Prompt {
  id: string;
  walletAddress: string;
  name: string;
  goal: string;
  description: string;
  testedAiAgents: string[];
  promptVersion: string;
  createdAt: Date;
  updatedAt: Date;
  lastTestedDate: Date | null;
  price: number;
  currency: string;
  tags: PromptTag[];
  purchases: Purchase[];
  ratings: Rating[];
}

export class PromptTag {
  promptId: string;
  tag: string;
  prompt?: Prompt;
}

export class Purchase {
  id: string;
  walletAddress: string;
  promptId: string;
  transactionHash: string | null;
  price: number;
  currency: string;
  purchaseDate: Date;
  prompt?: Prompt;
}

export class Rating {
  id: string;
  walletAddress: string;
  promptId: string;
  ratingScore: number;
  ratingDescription: string | null;
  createdAt: Date;
  prompt?: Prompt;
}

export class Preference {
  walletAddress: string;
  themePreference: string;
  notificationSettings: Record<string, any>;
}
