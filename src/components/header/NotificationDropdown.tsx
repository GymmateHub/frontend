import { useState } from "react";
import { Link } from "react-router";
import { Bell } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
} from "../../features/notifications/notifications.hooks";
import type { NotificationResponse } from "../../features/notifications/notifications.api";

const priorityDot: Record<string, string> = {
  URGENT: "bg-error-500",
  HIGH: "bg-warning-500",
  NORMAL: "bg-brand-500",
  LOW: "bg-gray-400",
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: unreadPage, isLoading } = useUnreadNotifications(0, 8);
  const markRead = useMarkNotificationRead();

  const notifications: NotificationResponse[] = unreadPage?.content ?? [];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleItemClick = (notification: NotificationResponse) => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }
    closeDropdown();
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <Bell className="h-5 w-5" />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex max-h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                {unreadCount} new
              </span>
            )}
          </h5>
        </div>
        <ul className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <li className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </li>
          ) : notifications.length === 0 ? (
            <li className="flex flex-col items-center py-10 text-center">
              <Bell className="mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You&apos;re all caught up
              </p>
            </li>
          ) : (
            notifications.map((n) => (
              <li key={n.id}>
                <DropdownItem
                  onItemClick={() => handleItemClick(n)}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span
                    className={`mt-1.5 block h-2.5 w-2.5 shrink-0 rounded-full ${
                      priorityDot[n.priority] ?? priorityDot.NORMAL
                    }`}
                  />
                  <span className="block">
                    <span className="mb-1 block text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {n.title}
                    </span>
                    <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {n.message}
                    </span>
                    <span className="text-theme-xs text-gray-400 dark:text-gray-500">
                      {timeAgo(n.createdAt)}
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>
        <Link
          to="/notifications"
          onClick={closeDropdown}
          className="mt-3 block rounded-lg border border-gray-300 bg-white p-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
