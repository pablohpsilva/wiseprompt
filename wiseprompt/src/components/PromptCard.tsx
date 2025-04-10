import { useAccount } from "wagmi";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Prompt } from "@/types";
import { formatDate } from "@/lib/utils";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { isConnected } = useAccount();

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "BTC") {
      return `${amount} BTC`;
    }
    return `${amount} ${currency}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{prompt.title}</CardTitle>
          <div className="text-sm font-medium">
            {formatCurrency(prompt.price.amount, prompt.price.currency)}
          </div>
        </div>
        <CardDescription>By {prompt.sellerName}</CardDescription>
        <div className="mt-2 flex flex-wrap gap-1">
          {prompt.supportedAgents.map((agent) => (
            <Badge key={agent} variant="outline">
              {agent}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {prompt.description}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {prompt.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="mr-1 mb-1">
                {keyword}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div>Created: {formatDate(prompt.createdAt)}</div>
            <div>Updated: {formatDate(prompt.updatedAt)}</div>
            <div>Last tested: {formatDate(prompt.lastTestedAt)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm">
            {prompt.reviews.length}{" "}
            {prompt.reviews.length === 1 ? "review" : "reviews"}
          </div>
          <Link href={`/prompt/${prompt.id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
