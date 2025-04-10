"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PromptCard } from "@/components/PromptCard";
import { mockPrompts } from "@/mocks/data";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const filteredPrompts = mockPrompts.filter((prompt) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Filter by selected agents
    const matchesAgents =
      selectedAgents.length === 0 ||
      prompt.supportedAgents.some((agent) => selectedAgents.includes(agent));

    return matchesSearch && matchesAgents;
  });

  const handleAgentToggle = (agent: string) => {
    setSelectedAgents((prevAgents) =>
      prevAgents.includes(agent)
        ? prevAgents.filter((a) => a !== agent)
        : [...prevAgents, agent]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Browse AI Prompts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find the perfect prompt for your AI assistant
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-2/3">
              <input
                type="text"
                placeholder="Search prompts..."
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 md:w-1/3">
              {["ChatGPT", "Claude", "Gemini", "Llama", "Mistral"].map(
                (agent) => (
                  <button
                    key={agent}
                    onClick={() => handleAgentToggle(agent)}
                    className={`rounded-md px-3 py-1 text-sm ${
                      selectedAgents.includes(agent)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {agent}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}

          {filteredPrompts.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No prompts found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
