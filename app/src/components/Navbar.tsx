import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    if (!isConnected) {
      return toast.error("Please connect your wallet first");
    }

    try {
      await login();
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to sign in with your wallet");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                WisePrompt
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <Link
                href="/prompts"
                className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Browse Prompts
              </Link>
              {isAuthenticated && (
                <Link
                  href="/prompts/create"
                  className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Create Prompt
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectButton showBalance={false} />

            {isConnected && !isAuthenticated && (
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign In
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-600 dark:text-primary-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
