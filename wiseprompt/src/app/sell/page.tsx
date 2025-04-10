"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AIAgent } from "@/types";

export default function SellPromptPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    price: "",
    currency: "USDC",
    keywords: "",
    outputExample1: "",
    outputExample2: "",
  });

  const [selectedAgents, setSelectedAgents] = useState<AIAgent[]>([]);

  const agentOptions: AIAgent[] = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Llama",
    "Mistral",
    "Other",
  ];

  const currencyOptions = ["USDC", "USDT", "DAI", "BTC"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAgent = (agent: AIAgent) => {
    setSelectedAgents((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would send the data to the backend
    alert("Prompt listed successfully!");

    // Navigate back to home page
    router.push("/");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to sell prompts.
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
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => router.push("/")}
        >
          ← Back to Browse
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sell Your Prompt
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Share your expertise and earn by selling high-quality AI prompts
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supported AI Agents *
                </label>
                <div className="flex flex-wrap gap-2">
                  {agentOptions.map((agent) => (
                    <button
                      key={agent}
                      type="button"
                      onClick={() => toggleAgent(agent)}
                      className={`rounded-md px-3 py-1 text-sm ${
                        selectedAgents.includes(agent)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {agent}
                    </button>
                  ))}
                </div>
                {selectedAgents.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    Please select at least one AI agent
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Keywords * (comma separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. SEO, Content Creation, Blog Writing"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Prompt Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  This is the actual prompt that users will purchase
                </p>
              </div>

              <div>
                <label
                  htmlFor="outputExample1"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Output Example 1 *
                </label>
                <textarea
                  id="outputExample1"
                  name="outputExample1"
                  rows={4}
                  value={formData.outputExample1}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="outputExample2"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Output Example 2
                </label>
                <textarea
                  id="outputExample2"
                  name="outputExample2"
                  rows={4}
                  value={formData.outputExample2}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Price *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Currency *
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  disabled={selectedAgents.length === 0}
                >
                  List Prompt for Sale
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
