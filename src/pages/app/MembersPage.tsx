import { useState } from "react";
import { Users, Search, Plus, MoreHorizontal, UserCheck, UserX, XCircle } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useMembers, useActivateMember, useSuspendMember, useCancelMember, useCreateMember } from "../../features/members/members.hooks";
import type { MemberCreateRequest } from "../../features/members/members.api";
import { Modal } from "../../components/ui/modal";

const statusColor: Record<string, string> = {
  active: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  suspended: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  cancelled: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

function AddMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMember = useCreateMember();
  const [form, setForm] = useState<MemberCreateRequest>({ email: "", firstName: "", lastName: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMember.mutateAsync(form);
      onClose();
      setForm({ email: "", firstName: "", lastName: "", phone: "" });
    } catch {
      // error handled in hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">Add New Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">First Name *</label>
            <input type="text" required value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name *</label>
            <input type="text" required value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="Last name"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email *</label>
          <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="member@email.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="+234 000 0000"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={createMember.isPending} className="flex-1 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-sm font-medium text-white transition-colors disabled:opacity-60">
            {createMember.isPending ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { data: members = [], isLoading } = useMembers();
  const activate = useActivateMember();
  const suspend = useSuspendMember();
  const cancel = useCancelMember();

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q);
  });

  const handleActivate = (id: string) => { activate.mutate(id); setActiveMenu(null); };
  const handleSuspend = (id: string) => { suspend.mutate(id); setActiveMenu(null); };
  const handleCancel = (id: string) => { cancel.mutate(id); setActiveMenu(null); };

  return (
    <>
      <PageMeta title="Members | GymMate" description="Manage your gym members" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Members</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{members.length} total members</p>
          </div>
          <button onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Membership #</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 rounded bg-gray-100 dark:bg-gray-800 w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">{search ? "No members match your search" : "No members yet"}</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-semibold text-sm flex-shrink-0">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{member.firstName} {member.lastName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{member.phone || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">{member.membershipNumber || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[member.status?.toLowerCase()] ?? statusColor.inactive}`}>
                          {member.status?.toLowerCase() || "inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {activeMenu === member.id && (
                            <div className="absolute right-0 top-8 z-10 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                              <button onClick={() => handleActivate(member.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                <UserCheck className="h-4 w-4 text-success-500" /> Activate
                              </button>
                              <button onClick={() => handleSuspend(member.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                <UserX className="h-4 w-4 text-warning-500" /> Suspend
                              </button>
                              <button onClick={() => handleCancel(member.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10">
                                <XCircle className="h-4 w-4" /> Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddMemberModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </>
  );
}
