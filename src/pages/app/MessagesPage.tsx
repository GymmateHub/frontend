import { useState } from "react";
import { MessageSquare, Plus, Mail, Phone, Send, Loader2, X } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import {
  useCampaigns,
  useCreateCampaign,
  useSendCampaign,
  type AudienceType,
  type CampaignStatus,
} from "../../features/newsletters";

type TabType = "email" | "sms" | "whatsapp";

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { key: "sms", label: "SMS", icon: <Phone className="h-4 w-4" /> },
  { key: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-4 w-4" /> },
];

const statusConfig: Record<CampaignStatus, string> = {
  SENT: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  DRAFT: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  SENDING: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  CANCELLED: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  FAILED: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

const audienceOptions: { value: AudienceType; label: string }[] = [
  { value: "ALL_MEMBERS", label: "All members" },
  { value: "ACTIVE_MEMBERS", label: "Active members" },
  { value: "EXPIRED_MEMBERS", label: "Expired members" },
];

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("email");
  const { isOpen, openModal, closeModal } = useModal();

  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const sendCampaign = useSendCampaign();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audienceType, setAudienceType] = useState<AudienceType>("ALL_MEMBERS");

  const resetForm = () => {
    setName("");
    setSubject("");
    setBody("");
    setAudienceType("ALL_MEMBERS");
  };

  const handleCreate = () => {
    if (!name.trim() || !subject.trim() || !body.trim()) return;
    createCampaign.mutate(
      { name, subject, body, audienceType },
      {
        onSuccess: () => {
          resetForm();
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <PageMeta title="Messages | GymMate" description="Send email, SMS, and WhatsApp campaigns" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Messages</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Communicate with your members</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04] w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 capitalize">{activeTab} Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign Name</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent Date</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {activeTab !== "email" ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <MessageSquare className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activeTab.toUpperCase()} campaigns are coming soon</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Use email campaigns in the meantime</p>
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Loader2 className="h-6 w-6 text-brand-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Send className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No email campaigns yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first campaign to engage members</p>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">{campaign.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{campaign.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {campaign.totalRecipients?.toLocaleString() ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusConfig[campaign.status] ?? statusConfig.DRAFT}`}>
                          {campaign.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {campaign.status === "DRAFT" && (
                          <button
                            onClick={() => sendCampaign.mutate(campaign.id)}
                            disabled={sendCampaign.isPending}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Send
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                Create Email Campaign
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compose a message and choose which members should receive it.
              </p>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Campaign Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. July Newsletter"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Audience</label>
              <select
                value={audienceType}
                onChange={(e) => setAudienceType(e.target.value as AudienceType)}
                className={inputClass}
              >
                {audienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Write your message…"
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
              onClick={handleCreate}
              disabled={createCampaign.isPending || !name.trim() || !subject.trim() || !body.trim()}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              {createCampaign.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save as Draft
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
