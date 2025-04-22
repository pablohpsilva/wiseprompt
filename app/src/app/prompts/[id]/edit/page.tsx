"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import { useAuth } from "@/contexts/AuthContext";
import { LabelValue } from "@/lib/types";

interface Prompt {
  id: string;
  name: string;
  description: string;
  goal: string;
  testedAiAgents: LabelValue<string, number>[];
  promptVersion: string;
  content: string;
  price: number;
  currency: string;
  walletAddress: string;
  createdAt: string;
  lastTestedDate: string | null;
  tags: LabelValue<string, number>[];
  isPurchased?: boolean;
  isAuthor?: boolean;
  author: string;
}

interface FormData {
  name: string;
  description: string;
  goal: string;
  testedAiAgents: number[];
  prompt: string;
  price: number;
  currency: string;
  tags: number[];
  lastTestedDate: string | null;
}

export default function EditPromptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialPromptText, setInitialPromptText] = useState<string | null>(
    null
  );
  const [initialPromptVersion, setInitialPromptVersion] =
    useState<string>("1.0");
  const [promptData, setPromptData] = useState<FormData>({
    name: "",
    description: "",
    goal: "",
    testedAiAgents: [],
    prompt: "",
    price: 0,
    currency: "ETH",
    tags: [],
    lastTestedDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [aiAgentOptions, setAiAgentOptions] = useState<
    LabelValue<string, number>[]
  >([]);
  const [tagOptions, setTagOptions] = useState<LabelValue<string, number>[]>(
    []
  );
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      if (isAuthenticated === null) return;

      setIsLoading(true);
      setIsFetchingOptions(true);
      setError(null);
      setOptionsError(null);

      try {
        const [promptRes, aiAgentsRes, tagsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`, {
            headers: user?.token
              ? { Authorization: `Bearer ${user.token}` }
              : {},
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ai-agents`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tags`),
        ]);

        const fetchedAiAgentOptions = aiAgentsRes.data.map(
          (agent: { id: number; name: string }) => ({
            value: agent.id,
            label: agent.name,
          })
        );
        const fetchedTagOptions = tagsRes.data.map(
          (tag: { id: number; name: string }) => ({
            value: tag.id,
            label: tag.name,
          })
        );
        setAiAgentOptions(fetchedAiAgentOptions);
        setTagOptions(fetchedTagOptions);
        setIsFetchingOptions(false);

        const prompt: Prompt = promptRes.data;

        if (
          !user ||
          user.walletAddress.toLowerCase() !== prompt.author.toLowerCase()
        ) {
          setError("You are not authorized to edit this prompt.");
          setIsLoading(false);
          return;
        }

        setInitialPromptText(prompt.content || "");
        setInitialPromptVersion(prompt.promptVersion || "1.0");

        setPromptData({
          name: prompt.name,
          description: prompt.description,
          goal: prompt.goal,
          testedAiAgents: prompt.testedAiAgents,
          prompt: prompt.content || "",
          price: prompt.price,
          currency: prompt.currency,
          tags: prompt.tags,
          lastTestedDate: prompt.lastTestedDate,
        });
      } catch (err: any) {
        console.error("Error fetching data for editing:", err);
        if (err.config?.url?.includes("/prompts/")) {
          setError(
            "Failed to load prompt details for editing. Please try again later."
          );
        } else {
          setOptionsError(
            "Failed to load AI agents or tags. Selection might be unavailable."
          );
          setIsFetchingOptions(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPromptData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleMultiSelectChange = (
    selectedOptions: readonly SelectOption[] | null,
    field: "testedAiAgents" | "tags"
  ) => {
    setPromptData((prev) => ({
      ...prev,
      [field]: selectedOptions ? [...selectedOptions] : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !id) return;

    setIsSubmitting(true);
    setError(null);

    let nextVersion = initialPromptVersion;
    if (initialPromptText !== null && promptData.prompt !== initialPromptText) {
      const currentVersionParts = nextVersion.split(".");
      if (
        currentVersionParts.length === 2 &&
        !isNaN(parseFloat(currentVersionParts[0])) &&
        !isNaN(parseFloat(currentVersionParts[1]))
      ) {
        let major = parseInt(currentVersionParts[0], 10);
        let minor = parseInt(currentVersionParts[1], 10);
        minor += 1;
        nextVersion = `${major}.${minor}`;
      } else {
        const versionSuffixMatch = nextVersion.match(/-v(\d+)$/);
        if (versionSuffixMatch) {
          const newVersionNum = parseInt(versionSuffixMatch[1], 10) + 1;
          nextVersion = nextVersion.replace(/-v\d+$/, `-v${newVersionNum}`);
        } else {
          nextVersion = `${nextVersion}-v2`;
        }
      }
    }

    const testedAiAgentIds = promptData.testedAiAgents.map(
      (option) => option.value
    );
    const tagIds = promptData.tags.map((option) => option.value);

    const dataToSubmit = {
      name: promptData.name,
      description: promptData.description,
      goal: promptData.goal,
      prompt: promptData.prompt,
      price: promptData.price,
      currency: promptData.currency,
      lastTestedDate: promptData.lastTestedDate
        ? new Date(promptData.lastTestedDate).toISOString()
        : null,
      promptVersion: nextVersion,
      testedAiAgents: testedAiAgentIds,
      tags: tagIds,
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      router.push(`/prompts/${id}`);
    } catch (err) {
      console.error("Error updating prompt:", err);
      setError("Failed to update prompt. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center">Loading prompt editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
        <Link
          href={`/prompts/${id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Prompt Details
        </Link>
      </div>
    );
  }

  console.log("promptData", promptData);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Edit Prompt</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}
        {optionsError && (
          <div
            className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {optionsError}
          </div>
        )}
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
            value={promptData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
            value={promptData.description}
            onChange={handleInputChange}
            rows={3}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
            value={promptData.goal}
            onChange={handleInputChange}
            rows={3}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Prompt Text
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={promptData.prompt}
            onChange={handleInputChange}
            rows={10}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              value={promptData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
              value={promptData.currency}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="ETH">ETH</option>
              <option value="USD">USD</option>
              <option value="USDC">USDC</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="lastTestedDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Last Tested Date
            </label>
            <input
              type="date"
              id="lastTestedDate"
              name="lastTestedDate"
              value={
                promptData.lastTestedDate
                  ? new Date(promptData.lastTestedDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tags
            </label>
            <Select
              id="tags"
              instanceId="tags-edit-select"
              isMulti
              name="tags"
              options={tagOptions}
              className="basic-multi-select mt-1"
              classNamePrefix="select"
              value={promptData.tags}
              onChange={(selected) => handleMultiSelectChange(selected, "tags")}
              isLoading={isFetchingOptions}
              isDisabled={isFetchingOptions || !!optionsError || isSubmitting}
              placeholder="Select Tags..."
            />
          </div>

          <div>
            <label
              htmlFor="testedAiAgents"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tested AI Agents
            </label>
            <Select
              id="testedAiAgents"
              instanceId="aiAgents-edit-select"
              isMulti
              name="testedAiAgents"
              options={aiAgentOptions}
              className="basic-multi-select mt-1"
              classNamePrefix="select"
              value={promptData.testedAiAgents}
              onChange={(selected) =>
                handleMultiSelectChange(selected, "testedAiAgents")
              }
              isLoading={isFetchingOptions}
              isDisabled={isFetchingOptions || !!optionsError || isSubmitting}
              placeholder="Select AI Agents..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href={`/prompts/${id}`}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
