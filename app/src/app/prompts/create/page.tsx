"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Select from "react-select";
import { useAuth } from "../../../contexts/AuthContext";

interface SelectOption {
  value: string;
  label: string;
}

export default function CreatePromptPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    prompt: "",
    testedAiAgents: [] as SelectOption[],
    tags: [] as SelectOption[],
    price: 0,
    currency: "USD",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for AI agents and tags options
  const [aiAgentOptions, setAiAgentOptions] = useState<SelectOption[]>([]);
  const [tagOptions, setTagOptions] = useState<SelectOption[]>([]);
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // Fetch AI Agents and Tags on mount
  useEffect(() => {
    const fetchOptions = async () => {
      setIsFetchingOptions(true);
      setOptionsError(null);
      try {
        const [aiAgentsRes, tagsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ai-agents`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tags`),
        ]);

        // Assuming API returns an array of objects with 'id' and 'name'
        // Adjust 'value' and 'label' mapping if API structure is different
        setAiAgentOptions(
          aiAgentsRes.data.map((agent: { id: string; name: string }) => ({
            value: agent.id, // Or agent.name if you want to send names
            label: agent.name,
          }))
        );
        setTagOptions(
          tagsRes.data.map((tag: { id: string; name: string }) => ({
            value: tag.id, // Or tag.name
            label: tag.name,
          }))
        );
      } catch (err) {
        console.error("Error fetching options:", err);
        setOptionsError(
          "Failed to load AI agents or tags. Please try refreshing the page."
        );
      } finally {
        setIsFetchingOptions(false);
      }
    };

    fetchOptions();
  }, []);

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

  // Handlers for react-select components
  const handleMultiSelectChange = (
    selectedOptions: readonly SelectOption[] | null,
    field: "testedAiAgents" | "tags"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions ? [...selectedOptions] : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Map selected options to values (e.g., IDs or names) before sending
    const testedAiAgentValues = formData.testedAiAgents.map(
      (option) => option.value // Or option.label if sending names
    );
    const tagValues = formData.tags.map(
      (option) => option.value // Or option.label if sending names
    );

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts`,
        {
          ...formData,
          testedAiAgents: testedAiAgentValues, // Send mapped values
          tags: tagValues, // Send mapped values
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
          {optionsError && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative">
              {optionsError}
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
                Short Description
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
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prompt (only <strong>paying</strong> users will see this)
              </label>
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                required
                className="mt-1 input"
                value={formData.prompt}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="testedAiAgents"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tested AI Agents
              </label>
              <Select
                id="testedAiAgents"
                instanceId="testedAiAgents-select"
                isMulti
                name="testedAiAgents"
                options={aiAgentOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={formData.testedAiAgents}
                onChange={(selected) =>
                  handleMultiSelectChange(selected, "testedAiAgents")
                }
                isLoading={isFetchingOptions}
                isDisabled={isFetchingOptions || !!optionsError}
                placeholder="Select AI Agents..."
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tags
              </label>
              <Select
                id="tags"
                instanceId="tags-select"
                isMulti
                name="tags"
                options={tagOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={formData.tags}
                onChange={(selected) =>
                  handleMultiSelectChange(selected, "tags")
                }
                isLoading={isFetchingOptions}
                isDisabled={isFetchingOptions || !!optionsError}
                placeholder="Select Tags..."
              />
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
                className="w-full py-3 px-4 bg-blue-500 hover:bg-primary-700 text-white font-bold rounded-md transition duration-200 disabled:opacity-50 cursor-pointer"
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
