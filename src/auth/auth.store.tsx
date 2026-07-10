/**
 * Auth Store
 * Combined authentication utilities and React Context for auth state management
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
import apiClient from "@/api/axios";
import { AUTH } from "@/api/endpoints";
import type {
  StoredUser,
  LoginRequest,
  LoginResponse,
  AuthContextType,
  GymSwitchResponse,
} from "./auth.types";

// Storage Keys
const TOKEN_KEY = "gymmate_access_token";
const REFRESH_TOKEN_KEY = "gymmate_refresh_token";
const USER_KEY = "gymmate_user";

/**
 * Auth Storage Utilities
 */
export const authStorage = {
  // Access Token
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),

  // Refresh Token
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),

  // User
  getUser: (): StoredUser | null => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      // Corrupt data in localStorage â€” clear it and return null
      authStorage.clearDataByKey(USER_KEY);
      return null;
    }
  },
  setUser: (user: StoredUser): void =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: (): void => localStorage.removeItem(USER_KEY),

  // Check if authenticated
  isAuthenticated: (): boolean => !!authStorage.getToken(),

  // Clear all auth data
  clearAuth: (): void => {
    authStorage.removeToken();
    authStorage.removeRefreshToken();
    authStorage.removeUser();
  },

  // clear user
  clearUser: (): void => {
    authStorage.removeUser();
  },

  // clear data by key
  clearDataByKey: (key: string): void => {
    localStorage.removeItem(key);
  },

  // Get authorization header
  getAuthHeader: (): string => {
    const token = authStorage.getToken();
    return token ? `Bearer ${token}` : "";
  },
};

// For backward compatibility
export const authUtils = authStorage;

/**
 * Auth API Functions
 */
export const authAPI = {
  login: async (
    data: LoginRequest
  ): Promise<{ success: boolean; message: string; data: LoginResponse }> => {
    const response = await apiClient.post(AUTH.LOGIN, data);
    return response.data;
  },

  logout: async (
    token: string
  ): Promise<{ success: boolean; message: string; data: void }> => {
    const response = await apiClient.post(
      AUTH.LOGOUT,
      {},
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  },

  switchGym: async (
    gymId: string
  ): Promise<{ success: boolean; message: string; data: GymSwitchResponse }> => {
    const response = await apiClient.post(AUTH.SWITCH_GYM(gymId));
    return response.data;
  },

  getCurrentGym: async (): Promise<{
    success: boolean;
    message: string;
    data: GymSwitchResponse;
  }> => {
    const response = await apiClient.get(AUTH.CURRENT_GYM);
    return response.data;
  },
};

/**
 * Helper to get error message from axios error
 */
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    return axiosError.response?.data?.message || axiosError.message || "An error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Registration Functions
 */
export const registerGymOwner = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<{ userId: string; message: string }> => {
  try {
    const response = await apiClient.post(AUTH.REGISTER_OWNER, {
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    return {
      userId: response.data.data.id,
      message: response.data.message,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Registration failed");
  }
};

export const registerMember = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<void> => {
  try {
    await apiClient.post(AUTH.REGISTER_MEMBER, {
      email,
      password,
      firstName,
      lastName,
      phone,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Registration failed");
  }
};

export const verifyOtp = async (userId: string, otp: string): Promise<void> => {
  try {
    await apiClient.post(AUTH.VERIFY_OTP, {
      userId,
      otp,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error) || "OTP verification failed");
  }
};

export const resendOtp = async (userId: string): Promise<void> => {
  try {
    await apiClient.post(AUTH.RESEND_OTP, {
      userId,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to resend OTP");
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await apiClient.post(AUTH.PASSWORD_RESET_REQUEST, { email });
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to request password reset");
  }
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    await apiClient.post(AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      newPassword,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to reset password");
  }
};

// Backward compatibility - defaults to gym owner registration
export const register = registerGymOwner;

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = () => {
      const storedUser = authStorage.getUser();
      const token = authStorage.getToken();

      if (storedUser && token) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);

      if (response.success && response.data) {
        const {
          accessToken,
          refreshToken,
          userId,
          email,
          firstName,
          lastName,
          role,
          organisationId,
          gymId,
          emailVerified,
        } = response.data;

        // Check if email is verified
        if (!emailVerified) {
          // Redirect to verify email page with user data
          navigate("/verify-email", {
            state: {
              email,
              userId,
              firstName,
              lastName,
            },
            replace: true,
          });
          return;
        }

        // Email is verified, proceed with normal login
        if (!accessToken || !refreshToken) {
          throw new Error("Invalid login response");
        }

        // Store tokens
        authStorage.setToken(accessToken);
        authStorage.setRefreshToken(refreshToken);

        // Store user info
        const userData: StoredUser = {
          userId,
          email,
          firstName,
          lastName,
          role,
          organisationId: organisationId || "",
          gymId: gymId || "",
        };
        authStorage.setUser(userData);
        setUser(userData);

        // Navigate to dashboard
        navigate("/");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const token = authStorage.getToken();

      if (token) {
        // Call logout API
        await authAPI.logout(`Bearer ${token}`);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local auth data
      authStorage.clearAuth();
      setUser(null);
      setIsLoading(false);

      // Navigate to login
      navigate("/login");
    }
  };

  const refreshUserData = () => {
    const storedUser = authStorage.getUser();
    setUser(storedUser);
  };

  const switchGym = async (gymId: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.switchGym(gymId);

      if (response.success && response.data) {
        const {
          accessToken,
          refreshToken,
          gymId: newGymId,
          organisationId,
        } = response.data;

        // Update tokens
        authStorage.setToken(accessToken);
        authStorage.setRefreshToken(refreshToken);

        // Update user with new gym context
        const currentUser = authStorage.getUser();
        if (currentUser) {
          const updatedUser: StoredUser = {
            ...currentUser,
            gymId: newGymId,
            organisationId: organisationId,
          };
          authStorage.setUser(updatedUser);
          setUser(updatedUser);
        }
      } else {
        throw new Error(response.message || "Failed to switch gym");
      }
    } catch (error) {
      console.error("Gym switch error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authStorage.isAuthenticated(),
    isLoading,
    login,
    logout,
    refreshUserData,
    switchGym,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
