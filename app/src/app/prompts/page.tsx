"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

interface Prompt {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  walletAddress: string;
  createdAt: string;
  tags: { tag: string }[];
}

interface PromptResponse {
  results: Prompt[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptResponse>({
    results: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/prompts`
        );
        console.log("response.data", response.data);
        setPrompts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching prompts:", err);
        setError("Failed to load prompts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse AI Prompts</h1>
        {isAuthenticated && (
          <Link href="/prompts/create" className="btn btn-primary">
            Create Prompt
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg">Loading prompts...</p>
        </div>
      ) : error ? (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      ) : prompts.results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No prompts available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.results.map((prompt) => (
            <div
              key={prompt.id}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{prompt.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag.tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    >
                      {tag.tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">
                    {prompt.price} {prompt.currency}
                  </span>
                  <Link
                    href={`/prompts/${prompt.id}`}
                    className="btn btn-secondary text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
