"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

interface Tag {
  tag: string;
}

interface Rating {
  id: string;
  walletAddress: string;
  ratingScore: number;
  ratingDescription: string | null;
}

interface Prompt {
  id: string;
  name: string;
  description: string;
  goal: string;
  testedAiAgents: string[];
  promptVersion: string;
  price: number;
  currency: string;
  walletAddress: string;
  createdAt: string;
  lastTestedDate: string | null;
  tags: Tag[];
  ratings: Rating[];
  isPurchased?: boolean;
  isAuthor?: boolean;
}

export default function PromptDetailPage() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchPromptDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`,
          {
            headers: user?.token
              ? {
                  Authorization: `Bearer ${user.token}`,
                }
              : {},
          }
        );
        setPrompt(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching prompt details:", err);
        setError("Failed to load prompt details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromptDetails();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!prompt) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts/${prompt.id}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Refresh prompt data after purchase
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`,
        {
          headers: user?.token
            ? {
                Authorization: `Bearer ${user.token}`,
              }
            : {},
        }
      );
      setPrompt(response.data);
    } catch (err) {
      console.error("Error purchasing prompt:", err);
      setError("Failed to purchase this prompt. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-lg">Loading prompt details...</p>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error || "Prompt not found"}</span>
        </div>
        <div className="mt-4">
          <Link
            href="/prompts"
            className="text-primary-600 hover:text-primary-800"
          >
            &larr; Back to prompts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href="/prompts"
          className="text-primary-600 hover:text-primary-800"
        >
          &larr; Back to prompts
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{prompt.name}</h1>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {prompt.price} {prompt.currency}
            </div>
          </div>

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

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {prompt.description}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Goal</h2>
            <p className="text-gray-700 dark:text-gray-300">{prompt.goal}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tested AI Agents</h2>
            <div className="flex flex-wrap gap-2">
              {prompt.testedAiAgents.map((agent) => (
                <span
                  key={agent}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Version:</p>
                <p className="font-medium">{prompt.promptVersion}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Tested:</p>
                <p className="font-medium">
                  {prompt.lastTestedDate
                    ? new Date(prompt.lastTestedDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created:</p>
                <p className="font-medium">
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Author:</p>
                <p className="font-medium truncate">{prompt.walletAddress}</p>
              </div>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              <p>Please connect your wallet to purchase this prompt.</p>
            </div>
          ) : prompt.isAuthor ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p>You are the author of this prompt.</p>
            </div>
          ) : prompt.isPurchased ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p>You have purchased this prompt.</p>
            </div>
          ) : (
            <button
              onClick={handlePurchase}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-md transition duration-200"
            >
              Purchase Prompt
            </button>
          )}
        </div>
      </div>

      {/* Ratings Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
        {prompt.ratings.length > 0 ? (
          <div className="space-y-4">
            {prompt.ratings.map((rating) => (
              <div
                key={rating.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating.ratingScore
                            ? "text-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                    by {rating.walletAddress.substring(0, 6)}...
                    {rating.walletAddress.substring(
                      rating.walletAddress.length - 4
                    )}
                  </span>
                </div>
                {rating.ratingDescription && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {rating.ratingDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <p className="text-gray-500">No ratings yet for this prompt.</p>
          </div>
        )}
      </div>
    </div>
  );
}
