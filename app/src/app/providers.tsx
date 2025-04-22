"use client";

import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "../components/Layout";
import { http } from "viem";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNET_PROJECT_ID ?? "hello-man"; // In production, use environment variable

console.log(
  "process.env.NEXT_PUBLIC_NODE_ENV",
  process.env.NEXT_PUBLIC_NODE_ENV
);

const chains =
  process.env.NEXT_PUBLIC_NODE_ENV !== "production"
    ? [sepolia]
    : [mainnet, polygon, optimism, arbitrum];

const config = createConfig({
  appName: "WisePrompt",
  projectId: walletConnectProjectId,
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>
            <Layout>
              {children}
              <Toaster position="bottom-right" />
            </Layout>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
