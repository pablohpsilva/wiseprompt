const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const aiAgents = [
  "GPT-4",
  "GPT-4o",
  "GPT-4 Turbo",
  "GPT-4 Vision",
  "GPT-4 32k",
  "GPT-3.5 Turbo",
  "GPT-3.5 Turbo 16k",
  "GPT-3",
  "GPT-3 Davinci",
  "GPT-3 Curie",
  "GPT-3 Babbage",
  "GPT-3 Ada",
  "GPT-2",
  "GPT-1",
  "GPT-3.5",
  "Claude 3 Opus",
  "Claude 3 Sonnet",
  "Claude 3 Haiku",
  "Claude 2",
  "Gemini Pro",
  "Gemini Ultra",
  "Gemini 1.5 Pro",
  "Llama 2",
  "Llama 3",
  "Mistral 7B",
  "Mistral Large",
  "Mixtral 8x7B",
  "Falcon",
  "PaLM",
  "DALL-E 3",
  "Midjourney",
  "Stable Diffusion",
  "Bard",
  "Bing Chat",
  "Copilot",
  "Perplexity AI",
  "Cohere Command",
  "Phi-2",
  "Phi-3",
  "Vicuna",
  "Alpaca",
  "Grok-1",
  "Grok-1.5",
  "Grok-1.5 Pro",
  "Grok-1.5 Vision",
  "Grok-2",
  "Yi",
  "Qwen",
  "ERNIE Bot",
  "ChatGLM",
  "Baichuan",
  "Jurassic-2",
  "Bloom",
  "Anthropic Claude Instant",
  "Meta Llama 3",
  "Inflection Pi",
  "Reka",
  "Whisper",
  "Sora",
  "Devin",
  "Claude Opus",
  "Claude Haiku",
];

const promptTags = [
  "Text Generation",
  "Image Generation",
  "Code Generation",
  "Translation",
  "Summarization",
  "Question Answering",
  "Conversation",
  "Roleplay",
  "Creative Writing",
  "Technical Writing",
  "Email Writing",
  "Content Creation",
  "Brainstorming",
  "Problem Solving",
  "Programming",
  "Marketing",
  "Education",
  "Healthcare",
  "Finance",
  "Legal",
  "Science",
  "Engineering",
  "Art",
  "Music",
  "Literature",
  "Business",
  "Academic",
  "Research",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Chain of Thought",
  "Step by Step",
  "Few-Shot",
  "Zero-Shot",
  "System Prompt",
  "Multi-turn",
  "Productivity",
  "Learning",
  "Entertainment",
  "Analysis",
  "Decision Making",
  "Automation",
  "Creativity",
  "Jailbreak",
  "Experimental",
  "Multimodal",
  "Voice",
  "Vision",
  "E-commerce",
  "Social Media",
  "Customer Service",
  "Data Analysis",
  "Game Development",
  "Web Development",
  "Mobile Development",
  "DevOps",
  "Cybersecurity",
  "AI Development",
  "Blog",
  "Social Post",
  "Documentation",
  "Tutorial",
  "Script",
  "Story",
  "Essay",
  "Report",
  "Presentation",
  "Resume",
  "Cover Letter",
];

const networkChains = [
  { id: 1, name: "Ethereum", symbol: "ETH", chainId: 1 },
  { id: 2, name: "Bitcoin", symbol: "BTC", chainId: 0 },
  { id: 3, name: "Bitcoin Lightning Network", symbol: "BTC-SATS", chainId: -1 },
];

const currencies = [
  {
    id: 1,
    code: "USD",
    name: "United States Dollar",
    symbol: "USD",
    type: "FIAT",
  },
  { id: 2, code: "USDC", name: "USD Coin", symbol: "USDC", type: "CRYPTO" },
  { id: 3, code: "USDT", name: "Tether", symbol: "USDT", type: "CRYPTO" },
  { id: 4, code: "ETH", name: "Ethereum", symbol: "ETH", type: "CRYPTO" },
  { id: 5, code: "BTC", name: "Bitcoin", symbol: "BTC", type: "CRYPTO" },
  {
    id: 6,
    code: "BTC-SATS",
    name: "Bitcoin Satoshi - Lightning network",
    symbol: "SATS",
    type: "CRYPTO",
  },
];

const currencyNetworkChains = [
  { currencyId: 2, networkChainId: 1 },
  { currencyId: 3, networkChainId: 1 },
  { currencyId: 4, networkChainId: 1 },
  { currencyId: 5, networkChainId: 2 },
  { currencyId: 6, networkChainId: 3 },
];

async function main() {
  console.log("Starting seed...");

  // Create AI Agents if they don't exist
  console.log("Seeding AI Agents...");
  for (const agentName of aiAgents) {
    const existingAgent = await prisma.aiAgent.findUnique({
      where: { name: agentName },
    });

    if (!existingAgent) {
      await prisma.aiAgent.create({
        data: { name: agentName },
      });
      console.log(`Created AI Agent: ${agentName}`);
    } else {
      console.log(`AI Agent already exists: ${agentName}`);
    }
  }

  // Create Tags if they don't exist
  console.log("Seeding Tags...");
  for (const tagName of promptTags) {
    const existingTag = await prisma.tag.findUnique({
      where: { name: tagName },
    });

    if (!existingTag) {
      await prisma.tag.create({
        data: { name: tagName },
      });
      console.log(`Created Tag: ${tagName}`);
    } else {
      console.log(`Tag already exists: ${tagName}`);
    }
  }

  // Create Network Chains if they don't exist
  console.log("Seeding Network Chains...");
  for (const networkChain of networkChains) {
    const existingNetworkChain = await prisma.networkChain.findUnique({
      where: { name: networkChain.name },
    });

    if (!existingNetworkChain) {
      await prisma.networkChain.create({
        data: networkChain,
      });
      console.log(`Created Network Chain: ${networkChain.name}`);
    } else {
      console.log(`Network Chain already exists: ${networkChain.name}`);
    }
  }

  // Create Currencies if they don't exist
  console.log("Seeding Currencies...");
  for (const currency of currencies) {
    const existingCurrency = await prisma.currency.findFirst({
      where: { name: currency.name },
    });

    if (!existingCurrency) {
      await prisma.currency.create({
        data: currency,
      });
      console.log(`Created Currency: ${currency.name}`);
    } else {
      console.log(`Currency already exists: ${currency.name}`);
    }
  }

  // Create Currency Network Chains if they don't exist
  console.log("Seeding Currency Network Chains...");
  for (const currencyNetworkChain of currencyNetworkChains) {
    const existingCurrencyNetworkChain =
      await prisma.currencyNetworkChain.findFirst({
        where: {
          currencyId: currencyNetworkChain.currencyId,
          networkChainId: currencyNetworkChain.networkChainId,
        },
      });

    if (!existingCurrencyNetworkChain) {
      await prisma.currencyNetworkChain.create({
        data: currencyNetworkChain,
      });
      console.log(
        `Created Currency Network Chain: ${currencyNetworkChain.currencyId} - ${currencyNetworkChain.networkChainId}`
      );
    } else {
      console.log(
        `Currency Network Chain already exists: ${currencyNetworkChain.currencyId} - ${currencyNetworkChain.networkChainId}`
      );
    }
  }
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
