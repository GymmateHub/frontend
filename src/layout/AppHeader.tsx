import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { Modal } from "../components/ui/modal";
import { 
  LayoutDashboard, Users, Dumbbell, Calendar, Package, 
  ShoppingCart, Trophy, FileText, CreditCard, Settings, Building2, 
  BarChart2, Search, ArrowRight, UserCheck
} from "lucide-react";

interface CommandItem {
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Navigation" | "Quick Action";
}

const COMMAND_ITEMS: CommandItem[] = [
  { title: "Dashboard", description: "Overview of your gym metrics", path: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
  { title: "Members", description: "View and manage gym members", path: "/members", icon: Users, category: "Navigation" },
  { title: "Leads", description: "Track prospective gym members", path: "/leads", icon: UserCheck, category: "Navigation" },
  { title: "Membership Plans", description: "Configure pricing and packages", path: "/membership-plans", icon: CreditCard, category: "Navigation" },
  { title: "Classes", description: "Schedule and manage fitness classes", path: "/classes", icon: Calendar, category: "Navigation" },
  { title: "Calendar", description: "View daily and weekly schedules", path: "/calendar", icon: Calendar, category: "Navigation" },
  { title: "Point of Sale (POS)", description: "Process sales and payments", path: "/pos", icon: ShoppingCart, category: "Navigation" },
  { title: "Inventory", description: "Manage retail products and stock", path: "/inventory", icon: Package, category: "Navigation" },
  { title: "Equipment", description: "Track gym machines and maintenance", path: "/equipment", icon: Dumbbell, category: "Navigation" },
  { title: "Challenges", description: "Fitness competitions and leaderboard", path: "/challenges", icon: Trophy, category: "Navigation" },
  { title: "Analytics", description: "View performance graphs and metrics", path: "/analytics", icon: BarChart2, category: "Navigation" },
  { title: "Reports", description: "Export CSV reports and audits", path: "/reports", icon: FileText, category: "Navigation" },
  { title: "Gym Management", description: "Manage gym branch locations", path: "/gyms", icon: Building2, category: "Navigation" },
  { title: "Billing & Subscription", description: "Platform invoices and plan tier", path: "/billing", icon: CreditCard, category: "Navigation" },
  { title: "Settings", description: "Gym settings and security", path: "/settings", icon: Settings, category: "Navigation" },
];

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();
    const searchModalInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const filteredCommands = COMMAND_ITEMS.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandOpen) {
      setTimeout(() => searchModalInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isCommandOpen]);

  const handleSelectCommand = (path: string) => {
    setIsCommandOpen(false);
    navigate(path);
  };

  const handleCommandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelectCommand(filteredCommands[selectedIndex].path);
    } else if (e.key === "Escape") {
      setIsCommandOpen(false);
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <Link to="/" className="lg:hidden">
            <img className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" />
            <img className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <Search className="h-5 w-5" onClick={() => setIsCommandOpen(true)} />
          </button>

          <div className="hidden lg:block">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCommandOpen(true)}
                className="dark:bg-dark-900 flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-400 shadow-theme-xs hover:border-brand-300 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/40 dark:hover:border-brand-700 xl:w-[430px]"
              >
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <Search className="h-4 w-4 text-gray-400" />
                </span>
                <span>Search or type a command...</span>
                <span className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs font-semibold text-gray-500 dark:border-gray-800 dark:bg-white/[0.05] dark:text-gray-400">
                  <span>⌘</span>
                  <span>K</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>

      {/* Command Palette Modal */}
      <Modal isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl">
          <div className="relative flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
            <input
              ref={searchModalInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleCommandKeyDown}
              placeholder="Type a command or search pages..."
              className="w-full bg-transparent text-base text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={() => setIsCommandOpen(false)}
              className="px-2 py-1 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ESC
            </button>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-gray-50 dark:divide-gray-800/50">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No matching results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelectCommand(item.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                          : "hover:bg-gray-50 dark:hover:bg-white/[0.02] text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <ArrowRight className={`h-4 w-4 opacity-0 transition-opacity ${isSelected ? "opacity-100" : ""}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>Navigation Shortcut</span>
            <div className="flex items-center gap-2">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to close</span>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default AppHeader;
