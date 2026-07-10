import { useState } from "react";
import { UserPlus, Plus, Users, Mail, Phone, MoreHorizontal, Loader2, X } from "lucide-react";
import { useAuth } from "../../auth/auth.store";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useUpdateLeadStatus,
  useConvertLead,
  useDeleteLead,
} from "../../features/leads/leads.hooks";
import type { LeadResponse } from "../../features/leads/leads.api";

const statusConfig: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  CONTACTED: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  QUALIFIED: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  TRIAL: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
  CONVERTED: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  LOST: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

const leadSources = ["Walk-in", "Website", "Referral", "Social Media", "Phone", "Other"];

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", source: "", notes: "" };

export default function LeadsPage() {
  const { user } = useAuth();
  const gymId = user?.gymId ?? "";
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: leads = [], isLoading } = useLeads(gymId);

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const updateStatus = useUpdateLeadStatus();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();

  const { isOpen, openModal, closeModal } = useModal();
  const [editingLead, setEditingLead] = useState<LeadResponse | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreateModal = () => {
    setEditingLead(null);
    setForm(emptyForm);
    openModal();
  };

  const openEditModal = (lead: LeadResponse) => {
    setEditingLead(lead);
    setForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      source: lead.source ?? "",
      notes: lead.notes ?? "",
    });
    setActiveMenu(null);
    openModal();
  };

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      source: form.source || undefined,
      notes: form.notes.trim() || undefined,
    };
    const onSuccess = () => {
      setForm(emptyForm);
      setEditingLead(null);
      closeModal();
    };
    if (editingLead) {
      updateLead.mutate({ id: editingLead.id, data: payload }, { onSuccess });
    } else {
      createLead.mutate(payload, { onSuccess });
    }
  };

  const isSaving = createLead.isPending || updateLead.isPending;

  const filtered = leads.filter((l) =>
    `${l.firstName} ${l.lastName} ${l.email ?? ""} ${l.phone ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const countByStatus = (status: string) =>
    leads.filter((l) => (l.status ?? "").toUpperCase() === status).length;

  return (
    <>
      <PageMeta title="Leads | GymMate" description="Manage your gym leads and prospects" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{leads.length} total leads</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Leads" value={leads.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />} label="New" value={countByStatus("NEW")} color="bg-blue-100 dark:bg-blue-500/20" />
          <StatCard icon={<Mail className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Contacted" value={countByStatus("CONTACTED")} color="bg-warning-100 dark:bg-warning-500/20" />
          <StatCard icon={<Phone className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Converted" value={countByStatus("CONVERTED")} color="bg-success-100 dark:bg-success-500/20" />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-gray-100 dark:bg-gray-800 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <UserPlus className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">{search ? "No leads match your search" : "No leads yet"}</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => {
                    const statusColor = statusConfig[lead.status?.toUpperCase()] ?? "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400";
                    const isConverted = lead.status?.toUpperCase() === "CONVERTED";
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{lead.firstName} {lead.lastName}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.email || "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.phone || "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">{lead.source?.toLowerCase() || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>
                            {lead.status?.toLowerCase() || "new"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {activeMenu === lead.id && (
                              <div className="absolute right-0 top-8 z-10 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                                <button
                                  onClick={() => openEditModal(lead)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                >
                                  Edit
                                </button>
                                {!isConverted && lead.status?.toUpperCase() === "NEW" && (
                                  <button
                                    onClick={() => { updateStatus.mutate({ id: lead.id, status: "CONTACTED" }); setActiveMenu(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                  >
                                    Mark Contacted
                                  </button>
                                )}
                                {!isConverted && (
                                  <button
                                    onClick={() => { convertLead.mutate(lead.id); setActiveMenu(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-success-600 hover:bg-success-50 dark:hover:bg-success-500/10"
                                  >
                                    Convert
                                  </button>
                                )}
                                {!isConverted && lead.status?.toUpperCase() !== "LOST" && (
                                  <button
                                    onClick={() => { updateStatus.mutate({ id: lead.id, status: "LOST" }); setActiveMenu(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                  >
                                    Mark Lost
                                  </button>
                                )}
                                <button
                                  onClick={() => { deleteLead.mutate(lead.id); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Lead Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                {editingLead ? "Edit Lead" : "Add Lead"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {editingLead ? "Update this prospect's details." : "Capture a new prospect for your gym."}
              </p>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">First Name *</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name *</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputClass}>
                <option value="">Select a source…</option>
                {leadSources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || !form.firstName.trim() || !form.lastName.trim()}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingLead ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
