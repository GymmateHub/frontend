/**
 * Auth Types
 * Type definitions for authentication-related entities
 */

// Enums
// Mirrors backend com.gymmate.shared.constants.UserRole
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  TRAINER = "TRAINER",
  STAFF = "STAFF",
  MEMBER = "MEMBER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
}

// Stored User (for local storage)
export interface StoredUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organisationId: string;
  gymId: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organisationId: string | null;
  gymId: string | null;
  emailVerified: boolean;
}

// Registration
export interface UserRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  role: UserRole;
}

export interface MemberRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
}

export interface GymAdminRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
}

export interface RegistrationResponse {
  userId: string;
  message: string;
  expiresIn: number;
  retryAfter?: number;
}

// OTP Verification
export interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

export interface VerificationTokenResponse {
  verificationToken: string;
  message: string;
  expiresIn: number;
}

export interface ResendOtpRequest {
  userId: string;
}

// Token
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  tenantId?: string;
}

// Password Reset
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// Gym Switch
export interface GymSwitchResponse {
  gymId: string;
  gymName: string;
  organisationId: string;
  accessToken: string;
  refreshToken: string;
  message: string;
}

// User Response
export interface UserResponse {
  id: string;
  organisationId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  fullName: string;
}

// Auth Context Type
export interface AuthContextType {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => void;
  switchGym: (gymId: string) => Promise<void>;
}
