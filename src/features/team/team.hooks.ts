import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { teamAPI, type InviteRequest } from "./team.api";

export const teamKeys = {
  users: () => ["team", "users"] as const,
  invites: (gymId: string) => ["team", "invites", gymId] as const,
};

/** Everyone in the organisation except members (the team: owner, managers, staff, trainers). */
export const useTeam = () =>
  useQuery({
    queryKey: teamKeys.users(),
    queryFn: async () => (await teamAPI.getUsers()).data.filter((u) => u.role !== "MEMBER"),
  });

export const useInvites = (gymId: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: teamKeys.invites(gymId ?? ""),
    queryFn: async () => (await teamAPI.getInvites(gymId!)).data,
    enabled: enabled && !!gymId,
  });

export const useInviteMember = (gymId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: InviteRequest) => (await teamAPI.invite(gymId!, data)).data,
    onSuccess: (invite) => {
      qc.invalidateQueries({ queryKey: teamKeys.invites(gymId ?? "") });
      toast.success(`Invite sent to ${invite.email}`);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useResendInvite = (gymId: string | undefined) =>
  useMutation({
    mutationFn: async (inviteId: string) => teamAPI.resend(gymId!, inviteId),
    onSuccess: () => toast.success("Invite resent"),
    onError: (e) => toast.error(getErrorMessage(e)),
  });

export const useRevokeInvite = (gymId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inviteId: string) => teamAPI.revoke(gymId!, inviteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: teamKeys.invites(gymId ?? "") });
      toast.success("Invite revoked");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};

export const useSetMemberActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) =>
      active ? teamAPI.activate(id) : teamAPI.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.users() }),
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};
