import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useAuth } from "../hooks/useAuth";

export function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { isAuthenticated, login, logout, isLoading, error } = useAuth();

  // Auto-login when wallet connects
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isLoading) {
      login();
    }
  }, [isConnected, address, isAuthenticated, isLoading]);

  // Custom Connect button that integrates with our auth
  return (
    <div className="connect-wallet">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} className="btn btn-danger">
                      Wrong network
                    </button>
                  );
                }

                if (isAuthenticated) {
                  return (
                    <div className="flex flex-col md:flex-row gap-3">
                      <button
                        onClick={openAccountModal}
                        className="btn btn-secondary"
                      >
                        {account.displayName}
                      </button>
                      <button onClick={logout} className="btn btn-outline">
                        Sign Out
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    onClick={login}
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Sign In"}
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
