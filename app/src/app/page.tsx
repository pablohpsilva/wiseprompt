"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useAccount } from "wagmi";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          <span className="block">AI Prompts Marketplace</span>
          <span className="block text-primary-600 dark:text-primary-400">
            Powered by Web3
          </span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 dark:text-gray-300">
          Search, buy, and rate AI prompts using your wallet. Sign-in with
          Ethereum and start your AI journey today.
        </p>
        <div className="mt-10 flex justify-center">
          {!isConnected ? (
            <Link href="/prompts" className="btn btn-primary">
              Browse Prompts
            </Link>
          ) : !isAuthenticated ? (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/prompts" className="btn btn-primary">
                Browse Prompts
              </Link>
              <span className="btn btn-secondary">
                Connect your wallet to get started
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/prompts" className="btn btn-primary">
                Browse Prompts
              </Link>
              <Link href="/prompts/create" className="btn btn-secondary">
                Create Prompt
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-gray-800 py-12 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to find AI prompts
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              WisePrompt makes it easy to discover, purchase, and contribute to
              the AI prompt ecosystem.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Find the perfect prompt
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Search and filter prompts by AI agent, rating, and tags to
                    find exactly what you need.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Web3 Payments
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Purchase prompts directly with stablecoins using your Web3
                    wallet. No credit cards needed.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Wallet Authentication
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    Sign in with Ethereum (EIP-4361) for a seamless and secure
                    authentication experience.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Rate & Review
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    After purchasing a prompt, rate and review it to help others
                    find quality content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 dark:bg-primary-800 rounded-xl overflow-hidden shadow-xl">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-primary-200">
              Start browsing prompts today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/prompts"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Browse Prompts
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href={isAuthenticated ? "/prompts/create" : "/"}
                className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                  isAuthenticated
                    ? "text-white bg-primary-600 hover:bg-primary-500"
                    : "text-primary-200 bg-primary-800 cursor-not-allowed"
                }`}
              >
                {isAuthenticated ? "Create Prompt" : "Connect Wallet to Create"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
