import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ConnectWallet } from "../components/ConnectWallet";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirect = (router.query.redirect as string) || "/";
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <>
      <Head>
        <title>Sign In - WisePrompt</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to WisePrompt
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connect your wallet to access your account
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <ConnectWallet />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By connecting your wallet, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
