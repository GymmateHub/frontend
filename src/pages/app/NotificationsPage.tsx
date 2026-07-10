import { useState } from "react";
import { Bell, Info, AlertCircle, CheckCircle, Users, Loader2 } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type NotificationResponse,
} from "../../features/notifications";

type FilterType = "all" | "unread" | "high" | "member";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "high", label: "High Priority" },
  { key: "member", label: "Member" },
];

const isMemberNotification = (n: NotificationResponse) =>
  (n.eventType ?? "").toUpperCase().includes("MEMBER") ||
  (n.relatedEntityType ?? "").toUpperCase().includes("MEMBER");

const notificationVisual = (n: NotificationResponse) => {
  if (isMemberNotification(n)) {
    return {
      icon: <Users className="h-5 w-5 text-brand-500" />,
      iconBg: "bg-brand-100 dark:bg-brand-500/20",
    };
  }
  if (n.priority === "HIGH" || n.priority === "URGENT") {
    return {
      icon: <AlertCircle className="h-5 w-5 text-warning-500" />,
      iconBg: "bg-warning-100 dark:bg-warning-500/20",
    };
  }
  if ((n.eventType ?? "").toUpperCase().includes("PAYMENT")) {
    return {
      icon: <CheckCircle className="h-5 w-5 text-success-500" />,
      iconBg: "bg-success-100 dark:bg-success-500/20",
    };
  }
  return {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
  };
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { data: page, isLoading, isError } = useNotifications(0, 50);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = page?.content ?? [];

  const filtered = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "high") return n.priority === "HIGH" || n.priority === "URGENT";
    if (activeFilter === "member") return isMemberNotification(n);
    return true;
  });

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
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50"
            >
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-12 w-12 text-error-300 dark:text-error-600 mb-4" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Couldn't load notifications</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Please try again later</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No notifications</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((notif) => {
                const visual = notificationVisual(notif);
                return (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && markRead.mutate(notif.id)}
                    className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${
                      !notif.read ? "bg-brand-50/40 dark:bg-brand-500/[0.04] cursor-pointer" : ""
                    }`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${visual.iconBg}`}>
                      {visual.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notif.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
