import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import authService from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_KEY = process.env.API_KEY; // Server-side only, not exposed to client

class ApiClient {
  private instance: AxiosInstance;
  private serverSide: boolean;

  constructor() {
    this.serverSide = typeof window === "undefined";

    this.instance = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add auth token or API key to requests
    this.instance.interceptors.request.use(
      (config) => {
        // Server-side requests use API key
        if (this.serverSide && API_KEY) {
          config.headers["X-API-Key"] = API_KEY;
          return config;
        }

        // Client-side requests use JWT token
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle token expiration
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !this.serverSide) {
          // Clear token if it's expired or invalid (client-side only)
          authService.logout();
          // Redirect to login or handle as needed
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance(config);
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Create a server-side request with API key (to be used only in getServerSideProps or similar)
  static createServerSideRequest() {
    if (typeof window !== "undefined") {
      throw new Error("This method should only be used on the server side");
    }

    return new ApiClient();
  }
}

// Create a singleton instance
const apiClient = new ApiClient();
export default apiClient;
