/**
 * Team API — the organisation's managers, staff and trainers, and their invites.
 * Maps to backend UserController (/api/users), InviteController (/api/gyms/{gymId}/invites)
 * and the public invite endpoints of AuthController (/api/auth/invite/*).
 */

import apiClient from "@/api/axios";
import type { ApiResponse } from "@/api/axios";
import { AUTH, INVITES, USERS } from "@/api/endpoints";
import type { LoginResponse } from "@/auth/auth.types";

/** Roles a Gym Owner can invite (backend RolePermissions.INVITABLE_ROLES). */
export type InvitableRole = "MANAGER" | "STAFF" | "TRAINER";
export const INVITABLE_ROLES: InvitableRole[] = ["MANAGER", "STAFF", "TRAINER"];

export interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  active: boolean;
  lastLoginAt: string | null;
}

export interface Invite {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface InviteRequest {
  email: string;
  role: InvitableRole;
  firstName?: string;
  lastName?: string;
}

export interface ValidatedInvite {
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  gymName: string | null;
  invitedBy: string | null;
  expiresAt: string;
  expired: boolean;
}

export interface AcceptInviteRequest {
  inviteToken: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const teamAPI = {
  getUsers: async (): Promise<ApiResponse<TeamMember[]>> => (await apiClient.get(USERS.BASE)).data,
  activate: async (id: string): Promise<ApiResponse<TeamMember>> => (await apiClient.patch(USERS.ACTIVATE(id))).data,
  deactivate: async (id: string): Promise<ApiResponse<TeamMember>> => (await apiClient.patch(USERS.DEACTIVATE(id))).data,

  getInvites: async (gymId: string): Promise<ApiResponse<Invite[]>> => (await apiClient.get(INVITES.BASE(gymId))).data,
  invite: async (gymId: string, data: InviteRequest): Promise<ApiResponse<Invite>> =>
    (await apiClient.post(INVITES.BASE(gymId), data)).data,
  resend: async (gymId: string, inviteId: string): Promise<ApiResponse<Invite>> =>
    (await apiClient.post(INVITES.RESEND(gymId, inviteId))).data,
  revoke: async (gymId: string, inviteId: string): Promise<ApiResponse<void>> =>
    (await apiClient.delete(INVITES.BY_ID(gymId, inviteId))).data,

  validateInvite: async (token: string): Promise<ApiResponse<ValidatedInvite>> =>
    (await apiClient.get(AUTH.INVITE_VALIDATE, { params: { token } })).data,
  acceptInvite: async (data: AcceptInviteRequest): Promise<ApiResponse<LoginResponse>> =>
    (await apiClient.post(AUTH.INVITE_ACCEPT, data)).data,
};
