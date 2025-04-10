import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface NonceResponse {
  nonce: string;
  expiresAt: string;
  message: string;
}

export interface VerifyResponse {
  token: string;
}

export interface UserInfo {
  walletAddress: string;
}

class AuthService {
  private tokenKey = "wiseprompt_auth_token";

  // Get stored JWT token
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Set JWT token in storage
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Remove JWT token from storage
  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Generate headers with auth token if available
  getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  }

  // Request a nonce for the provided wallet address
  async getNonce(walletAddress: string): Promise<NonceResponse> {
    const response = await axios.post(`${API_URL}/auth/nonce`, {
      walletAddress,
    });
    return response.data;
  }

  // Verify a signature and get a JWT token
  async verifySignature(
    address: string,
    signature: string,
    nonce: string
  ): Promise<string> {
    const response = await axios.post<VerifyResponse>(
      `${API_URL}/auth/verify`,
      {
        address,
        signature,
        nonce,
      }
    );

    const { token } = response.data;
    this.setToken(token);
    return token;
  }

  // Get current user info using the stored JWT
  async getCurrentUser(): Promise<UserInfo> {
    const response = await axios.get(
      `${API_URL}/auth/me`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Logout - remove the token
  logout() {
    this.removeToken();
  }

  // Create an axios instance with authorization header
  createAuthenticatedRequest() {
    const instance = axios.create({
      baseURL: API_URL,
    });

    instance.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;
