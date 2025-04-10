import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-500"
          >
            WisePrompt
          </Link>
          <div className="ml-10 hidden space-x-6 lg:flex">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
            >
              Browse
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/purchased"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                >
                  My Purchases
                </Link>
                <Link
                  href="/sell"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                >
                  Sell Prompt
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
