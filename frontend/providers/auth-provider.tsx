import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import authService, { UserInfo } from "../services/auth-service";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: () => {},
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { openConnectModal } = useConnectModal();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Failed to get user data:", err);
          // Token might be invalid, clear it
          authService.removeToken();
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Wallet authentication flow
  const login = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // If wallet is not connected, prompt connection
      if (!isConnected || !address) {
        openConnectModal?.();
        setIsLoading(false);
        return;
      }

      // Request nonce from the server
      const { nonce, message } = await authService.getNonce(address);

      // Sign the message with wallet
      const signature = await signMessageAsync({ message });

      // Verify signature with backend and get JWT
      await authService.verifySignature(address, signature, nonce);

      // Get user info
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Failed to authenticate with wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    disconnect();
    setUser(null);
  };

  const isAuthenticated = !!user && authService.isAuthenticated();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
