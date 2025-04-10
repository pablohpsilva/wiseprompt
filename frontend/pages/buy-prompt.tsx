import { useState } from "react";
import Head from "next/head";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ConnectWallet } from "../components/ConnectWallet";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../services/api-client";

interface PurchasePromptDto {
  transactionHash?: string;
}

export default function BuyPromptPage() {
  const { user } = useAuth();
  const [promptId, setPromptId] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promptId) {
      setError("Prompt ID is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Make authenticated API call to purchase prompt
      const data: PurchasePromptDto = {};
      if (transactionHash) {
        data.transactionHash = transactionHash;
      }

      await apiClient.post(`/prompts/${promptId}/purchase`, data);

      setSuccess("Prompt purchased successfully!");
      // Reset form
      setPromptId("");
      setTransactionHash("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to purchase prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Buy Prompt - WisePrompt</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Buy Prompt</h1>
          <ConnectWallet />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="mb-4">
            <p>
              Wallet Address:{" "}
              <span className="font-medium">{user?.walletAddress}</span>
            </p>
          </div>

          <form onSubmit={handlePurchase} className="space-y-6">
            <div>
              <label
                htmlFor="promptId"
                className="block text-sm font-medium text-gray-700"
              >
                Prompt ID
              </label>
              <input
                type="text"
                id="promptId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={promptId}
                onChange={(e) => setPromptId(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="transactionHash"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Hash (optional)
              </label>
              <input
                type="text"
                id="transactionHash"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            {success && <div className="text-green-600 text-sm">{success}</div>}

            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Buy Prompt"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
