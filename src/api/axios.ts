/**
 * GymMate API Client Configuration
 * Centralized axios instance with interceptors for authentication,
 * error handling, and multi-tenancy support
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// API Configuration - Use VITE_API_URL for consistency across the app
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.gymmatehub.com/api";
const API_TIMEOUT = 30000; // 30 seconds

// Token storage keys
const ACCESS_TOKEN_KEY = "gymmate_access_token";
const REFRESH_TOKEN_KEY = "gymmate_refresh_token";
const CURRENT_GYM_KEY = "gymmate_current_gym";

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Paginated response wrapper
 */
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * API Error structure
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

/**
 * Token storage utilities
 */
export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string): void =>
    localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: (): void => localStorage.removeItem(ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),

  getCurrentGym: (): string | null => localStorage.getItem(CURRENT_GYM_KEY),
  setCurrentGym: (gymId: string): void =>
    localStorage.setItem(CURRENT_GYM_KEY, gymId),
  removeCurrentGym: (): void => localStorage.removeItem(CURRENT_GYM_KEY),

  clearAll: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_GYM_KEY);
  },
};

/**
 * Create the axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor - Add auth token and gym context
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization header
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add gym context header for multi-tenancy
    const gymId = tokenStorage.getCurrentGym();
    if (gymId) {
      config.headers["X-Gym-Id"] = gymId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors and token refresh
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// A 401 from these endpoints means the credentials/token in the request body
// were rejected — NOT that the session expired. They must never trigger the
// token-refresh flow or a redirect to /login (which reloads the page and
// destroys any error message the form is trying to show).
const AUTH_401_EXEMPT_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/register",
  "/auth/password-reset",
];

const isAuth401Exempt = (url?: string): boolean =>
  !!url && AUTH_401_EXEMPT_PATHS.some((path) => url.includes(path));

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuth401Exempt(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearAll();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;
        tokenStorage.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken);
        }

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        tokenStorage.clearAll();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data.message);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data.message);
    }

    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      console.error("Validation error:", error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to extract error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Helper function to extract validation errors
 */
export const getValidationErrors = (
  error: unknown
): Record<string, string[]> | null => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.errors || null;
  }
  return null;
};

export default apiClient;
