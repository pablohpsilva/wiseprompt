"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

export default function CreatePromptPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    testedAiAgents: [""],
    tags: [""],
    price: 0,
    currency: "USD",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <p className="font-bold">Authentication required</p>
          <p className="block sm:inline">
            Please connect your wallet to create a prompt.
          </p>
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAiAgentChange = (index: number, value: string) => {
    const newTestedAiAgents = [...formData.testedAiAgents];
    newTestedAiAgents[index] = value;
    setFormData((prev) => ({
      ...prev,
      testedAiAgents: newTestedAiAgents,
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const addAiAgent = () => {
    setFormData((prev) => ({
      ...prev,
      testedAiAgents: [...prev.testedAiAgents, ""],
    }));
  };

  const removeAiAgent = (index: number) => {
    const newTestedAiAgents = [...formData.testedAiAgents];
    newTestedAiAgents.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      testedAiAgents: newTestedAiAgents,
    }));
  };

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Filter out empty values
    const filteredTestedAiAgents = formData.testedAiAgents.filter(
      (agent) => agent.trim() !== ""
    );
    const filteredTags = formData.tags.filter((tag) => tag.trim() !== "");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts`,
        {
          ...formData,
          testedAiAgents: filteredTestedAiAgents,
          tags: filteredTags,
          price: Number(formData.price),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Redirect to the new prompt page
      router.push(`/prompts/${response.data.id}`);
    } catch (err) {
      console.error("Error creating prompt:", err);
      setError(
        "Failed to create prompt. Please check your inputs and try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Prompt</h1>
        <Link
          href="/prompts"
          className="text-primary-600 hover:text-primary-800"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prompt Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className="mt-1 input"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="goal"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Goal
              </label>
              <textarea
                id="goal"
                name="goal"
                rows={3}
                required
                className="mt-1 input"
                value={formData.goal}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tested AI Agents
              </label>
              {formData.testedAiAgents.map((agent, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={agent}
                    onChange={(e) => handleAiAgentChange(index, e.target.value)}
                    className="input mr-2"
                    placeholder="e.g., GPT-4, Claude, etc."
                  />
                  <button
                    type="button"
                    onClick={() => removeAiAgent(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.testedAiAgents.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAiAgent}
                className="text-primary-600 hover:text-primary-800"
              >
                + Add AI Agent
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="input mr-2"
                    placeholder="e.g., creative, coding, etc."
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.tags.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-primary-600 hover:text-primary-800"
              >
                + Add Tag
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 input"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  required
                  className="mt-1 input"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-md transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Prompt"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
