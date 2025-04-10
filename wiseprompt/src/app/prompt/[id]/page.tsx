"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockPrompts, hasUserPurchasedPrompt, mockUsers } from "@/mocks/data";
import {
  formatDate,
  formatCurrency,
  calculateAverageRating,
} from "@/lib/utils";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [purchased, setPurchased] = useState(false);

  const promptId = params.id as string;
  const prompt = mockPrompts.find((p) => p.id === promptId);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Prompt not found</h1>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  // Fake user id - in a real app this would come from authentication
  const userId = mockUsers[0].id;

  const userHasPurchased =
    purchased || hasUserPurchasedPrompt(userId, promptId);

  const averageRating = calculateAverageRating(
    prompt.reviews.map((review) => review.rating)
  );

  const handlePurchase = () => {
    // In a real app, this would handle the payment process
    setPurchased(true);
    alert("Prompt purchased successfully!");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the review to the backend
    alert("Review submitted successfully!");
    setReviewText("");
  };

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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {prompt.title}
                </h1>
                <div className="text-xl font-semibold">
                  {formatCurrency(prompt.price.amount, prompt.price.currency)}
                </div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                By {prompt.sellerName}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {prompt.supportedAgents.map((agent) => (
                  <Badge key={agent} variant="outline">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {prompt.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {prompt.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {userHasPurchased && (
              <div className="mb-8">
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Prompt Content
                </h2>
                <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                  <pre className="whitespace-pre-wrap text-sm">
                    {prompt.content}
                  </pre>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Output Examples
              </h2>
              <div className="space-y-4">
                {prompt.outputExamples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
                  >
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Prompt Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created
                    </div>
                    <div>{formatDate(prompt.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last Updated
                    </div>
                    <div>{formatDate(prompt.updatedAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last Tested
                    </div>
                    <div>{formatDate(prompt.lastTestedAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rating
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        /10
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({prompt.reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  {!userHasPurchased && (
                    <div className="pt-4">
                      <Button
                        fullWidth
                        onClick={handlePurchase}
                        disabled={!isConnected}
                      >
                        {isConnected
                          ? `Purchase for ${formatCurrency(
                              prompt.price.amount,
                              prompt.price.currency
                            )}`
                          : "Connect Wallet to Purchase"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {userHasPurchased && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Leave a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label
                        htmlFor="rating"
                        className="mb-1 block text-sm font-medium"
                      >
                        Rating (0-10)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="mt-1 text-center text-lg font-bold">
                        {rating}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="review"
                        className="mb-1 block text-sm font-medium"
                      >
                        Review
                      </label>
                      <textarea
                        id="review"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                      ></textarea>
                    </div>
                    <Button type="submit" fullWidth>
                      Submit Review
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {prompt.reviews.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prompt.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">
                            {review.userName}
                          </span>
                          <span className="text-sm font-bold">
                            {review.rating}/10
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {review.description}
                        </p>
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
