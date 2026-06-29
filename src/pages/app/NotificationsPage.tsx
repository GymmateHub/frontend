import { useState } from "react";
import { Bell, Info, AlertCircle, CheckCircle, Users } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

type FilterType = "all" | "unread" | "system" | "member";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "system", label: "System" },
  { key: "member", label: "Member" },
];

// Sample notifications - replace with API data when available
const sampleNotifications = [
  {
    id: "1",
    type: "member",
    icon: <Users className="h-5 w-5 text-brand-500" />,
    iconBg: "bg-brand-100 dark:bg-brand-500/20",
    title: "New member registered",
    body: "John Doe has signed up for the Professional plan.",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "system",
    icon: <CheckCircle className="h-5 w-5 text-success-500" />,
    iconBg: "bg-success-100 dark:bg-success-500/20",
    title: "Payment processed",
    body: "Monthly subscription payment of $99 was successfully processed.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "system",
    icon: <AlertCircle className="h-5 w-5 text-warning-500" />,
    iconBg: "bg-warning-100 dark:bg-warning-500/20",
    title: "Equipment maintenance due",
    body: "Treadmill #3 is scheduled for maintenance tomorrow.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "member",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    title: "Class cancelled",
    body: "Yoga class at 6:00 PM has been cancelled. 12 members notified.",
    time: "Yesterday",
    read: true,
  },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [notifications, setNotifications] = useState(sampleNotifications);

  const filtered = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "system") return n.type === "system";
    if (activeFilter === "member") return n.type === "member";
    return true;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageMeta title="Notifications | GymMate" description="View your notifications and alerts" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Notifications</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04] w-fit">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No notifications</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${
                    !notif.read ? "bg-brand-50/40 dark:bg-brand-500/[0.04]" : ""
                  }`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${notif.iconBg}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!notif.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{notif.time}</span>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
