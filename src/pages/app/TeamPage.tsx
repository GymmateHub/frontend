import { useState } from "react";
import { Loader2, Mail, RotateCw, UserPlus, Users, X } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../auth/auth.store";
import { hasPermission, PERMISSIONS } from "../../auth/permissions";
import { useActiveGym } from "../../features/gyms/useActiveGym";
import {
  useInviteMember,
  useInvites,
  useResendInvite,
  useRevokeInvite,
  useSetMemberActive,
  useTeam,
} from "../../features/team/team.hooks";
import { INVITABLE_ROLES, type InvitableRole } from "../../features/team/team.api";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

/** What each invitable role can do (mirrors backend RolePermissions). */
const ROLE_DESCRIPTIONS: Record<InvitableRole, string> = {
  MANAGER: "Runs the gyms: members, plans, classes, sales, inventory, settings and analytics. No billing or team management.",
  STAFF: "Front desk: members, leads, point of sale, inventory, door access and bookings.",
  TRAINER: "Classes and schedules, bookings, and members' health and workouts.",
};

const roleLabel = (role: string) =>
  ({ GYM_OWNER: "Owner", ADMIN: "Admin", MANAGER: "Manager", STAFF: "Staff", TRAINER: "Trainer" } as Record<string, string>)[role] ?? role;

const roleBadge: Record<string, string> = {
  GYM_OWNER: "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  ADMIN: "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  MANAGER: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  STAFF: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  TRAINER: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
};

const emptyForm = { email: "", firstName: "", lastName: "", role: "STAFF" as InvitableRole };

export default function TeamPage() {
  const { user } = useAuth();
  const { gymId } = useActiveGym();
  const canInvite = hasPermission(user, PERMISSIONS.STAFF_INVITE);
  const canManage = hasPermission(user, PERMISSIONS.STAFF_MANAGE);

  const { data: team = [], isLoading } = useTeam();
  const { data: invites = [] } = useInvites(gymId, canInvite);
  const pendingInvites = invites.filter((i) => i.status === "PENDING");

  const inviteMember = useInviteMember(gymId);
  const resendInvite = useResendInvite(gymId);
  const revokeInvite = useRevokeInvite(gymId);
  const setActive = useSetMemberActive();

  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState(emptyForm);

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    inviteMember.mutate(
      {
        email: form.email.trim(),
        role: form.role,
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
      },
      {
        onSuccess: () => {
          setForm(emptyForm);
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <PageMeta title="Team | GymMate" description="Managers, staff and trainers of your organisation" />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Team</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Managers, staff and trainers work across all gyms of your organisation.
            </p>
          </div>
          {canInvite && (
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              <UserPlus className="h-4 w-4" />
              Invite Team Member
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <Users className="h-5 w-5 text-gray-500" />
            <h2 className="font-medium text-gray-800 dark:text-white/90">Team members</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  {canManage && <th className="px-6 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-400" />
                    </td>
                  </tr>
                ) : (
                  team.map((m) => {
                    const isOwnerOrSelf = m.role === "GYM_OWNER" || m.id === user?.userId;
                    return (
                      <tr key={m.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                          {m.firstName} {m.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{m.email}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge[m.role] ?? ""}`}>
                            {roleLabel(m.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {m.active ? "Active" : "Deactivated"}
                        </td>
                        {canManage && (
                          <td className="px-6 py-4 text-right">
                            {!isOwnerOrSelf && (
                              <button
                                onClick={() => setActive.mutate({ id: m.id, active: !m.active })}
                                className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                              >
                                {m.active ? "Deactivate" : "Reactivate"}
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {canInvite && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <Mail className="h-5 w-5 text-gray-500" />
              <h2 className="font-medium text-gray-800 dark:text-white/90">Pending invites</h2>
            </div>
            {pendingInvites.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No pending invites.</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {pendingInvites.map((invite) => (
                  <li key={invite.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{invite.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {roleLabel(invite.role)} · expires {new Date(invite.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => resendInvite.mutate(invite.id)}
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300"
                      >
                        <RotateCw className="h-4 w-4" /> Resend
                      </button>
                      <button
                        onClick={() => revokeInvite.mutate(invite.id)}
                        className="inline-flex items-center gap-1 text-sm text-error-600 hover:text-error-700"
                      >
                        <X className="h-4 w-4" /> Revoke
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-lg">
        <form onSubmit={submitInvite} className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Invite a team member</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">First Name</label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name</label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Role *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as InvitableRole })}
              className={inputClass}
            >
              {INVITABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {roleLabel(r)}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{ROLE_DESCRIPTIONS[form.role]}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMember.isPending || !gymId}
              className="flex-1 rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {inviteMember.isPending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
