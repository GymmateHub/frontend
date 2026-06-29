import { useState } from "react";
import { MessageSquare, Plus, Mail, Phone, Send } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

type TabType = "email" | "sms" | "whatsapp";

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { key: "sms", label: "SMS", icon: <Phone className="h-4 w-4" /> },
  { key: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-4 w-4" /> },
];

const statusConfig: Record<string, string> = {
  sent: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  draft: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  failed: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

// Placeholder campaigns — empty to show empty state, populate when API is ready
const campaigns: any[] = [];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("email");

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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
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
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Send className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No {activeTab} campaigns yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first campaign to engage members</p>
                    </td>
                  </tr>
                ) : (
                  campaigns
                    .filter((c) => c.type === activeTab)
                    .map((campaign) => {
                      const status = statusConfig[campaign.status] ?? statusConfig.draft;
                      return (
                        <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">{campaign.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">{campaign.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{campaign.recipients?.toLocaleString() ?? "—"}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${status}`}>{campaign.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : "—"}
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
    </>
  );
}
