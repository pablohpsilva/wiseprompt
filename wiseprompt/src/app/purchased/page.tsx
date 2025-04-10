"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { PromptCard } from "@/components/PromptCard";
import { Button } from "@/components/ui/Button";
import { mockUsers, getUserPurchasedPrompts } from "@/mocks/data";

export default function PurchasedPromptsPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Fake user id - in a real app this would come from authentication
  const userId = mockUsers[0].id;
  const purchasedPrompts = getUserPurchasedPrompts(userId);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to view your purchased prompts.
          </p>
          <Button onClick={() => router.push("/")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Purchased Prompts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and use the prompts you've purchased
          </p>
        </div>

        {purchasedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {purchasedPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold mb-2">
              You haven't purchased any prompts yet.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore our marketplace to find high-quality AI prompts.
            </p>
            <Button onClick={() => router.push("/")}>Browse Prompts</Button>
          </div>
        )}
      </div>
    </div>
  );
}
