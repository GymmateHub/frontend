import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  Users, Calendar, DollarSign, Activity, TrendingUp, AlertTriangle, 
  UserPlus, Zap, Target, Building2, Package, ShoppingCart,
  CreditCard, X
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useMembers, useMemberStats } from "../../features/members/members.hooks";
import { useAuth } from "../../auth/auth.store";
import { useCurrency } from "../../utils/currency";
import { Modal } from "../../components/ui/modal";

function StatCard({ title, value, change, icon: Icon, color }: { title: string; value: string; change: string; icon: typeof Users; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-1">{value}</p>
      <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <TrendingUp className="h-3 w-3 text-success-500" />
        {change} from last month
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { format } = useCurrency();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const { data: memberStats, isLoading: statsLoading } = useMemberStats();
  const { data: members = [], isLoading: membersLoading } = useMembers();

  const recentMembers = members.slice(0, 5);

  const stats = [
    { title: "Total Members", value: statsLoading ? "..." : (memberStats?.totalMembers?.toLocaleString() ?? "0"), change: memberStats?.totalMembersChange ?? "+0%", icon: Users, color: "bg-brand-500" },
    { title: "Monthly Revenue", value: statsLoading ? "..." : format(memberStats?.monthlyRevenue ?? 0), change: memberStats?.revenueChange ?? "+0%", icon: DollarSign, color: "bg-success-500" },
    { title: "Active Today", value: statsLoading ? "..." : (memberStats?.activeMembers?.toLocaleString() ?? "0"), change: memberStats?.activeMembersChange ?? "+0%", icon: Activity, color: "bg-purple-500" },
    { title: "Classes This Week", value: "0", change: "+0%", icon: Calendar, color: "bg-orange-500" },
  ];

  const statusColor: Record<string, string> = {
    active: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
    suspended: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
    cancelled: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
    inactive: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  };

  const quickActionItems = [
    { title: "Add New Member", description: "Register a new gym member", icon: UserPlus, color: "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400", path: "/members" },
    { title: "Schedule a Class", description: "Create or book a class session", icon: Calendar, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400", path: "/classes" },
    { title: "Record Point of Sale", description: "Ring up retail or drink purchases", icon: ShoppingCart, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400", path: "/pos" },
    { title: "Add Retail Inventory", description: "Update retail stock and products", icon: Package, color: "bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400", path: "/inventory" },
    { title: "Add Gym Equipment", description: "Register equipment for tracking", icon: Building2, color: "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400", path: "/equipment" },
    { title: "Add Membership Plan", description: "Create custom pricing tiers", icon: CreditCard, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400", path: "/membership-plans" },
  ];

  return (
    <>
      <PageMeta title="Dashboard | GymMate" description="GymMate gym management dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName || "Admin"}! Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/members")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </button>
            <button
              onClick={() => setIsQuickActionsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Zap className="h-4 w-4" />
              Quick Actions
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Members */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Members</h2>
              </div>
              <button onClick={() => navigate("/members")} className="text-sm text-brand-500 hover:text-brand-600">View all</button>
            </div>

            {membersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="space-y-1">
                        <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
                      </div>
                    </div>
                    <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : recentMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No members yet</p>
                <button onClick={() => navigate("/members")} className="mt-3 text-sm text-brand-500 hover:text-brand-600 font-medium">Add your first member</button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-semibold text-sm">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[member.status?.toLowerCase()] ?? statusColor.inactive}`}>
                      {member.status?.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Quick Links</h2>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Manage Classes", icon: Calendar, path: "/classes" },
                  { label: "Equipment", icon: Building2, path: "/equipment" },
                  { label: "Point of Sale", icon: ShoppingCart, path: "/pos" },
                  { label: "Analytics", icon: TrendingUp, path: "/analytics" },
                  { label: "Notifications", icon: AlertTriangle, path: "/notifications" },
                ].map((item) => (
                  <button key={item.path} onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors group"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 group-hover:text-brand-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-brand-500">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Alerts</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertTriangle className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No active alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Ready to boost your gym&apos;s performance?</h3>
              <p className="text-brand-100 mt-1">Use insights to increase member retention and optimize operations.</p>
            </div>
            <button onClick={() => navigate("/analytics")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors shrink-0"
            >
              <Target className="h-4 w-4" />
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Modal */}
      <Modal isOpen={isQuickActionsOpen} onClose={() => setIsQuickActionsOpen(false)} className="max-w-xl w-full p-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Quick Actions</h3>
                <p className="text-xs text-gray-400">Fast shortcuts to common operational tasks</p>
              </div>
            </div>
            <button onClick={() => setIsQuickActionsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
            {quickActionItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    navigate(item.path);
                  }}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/30 hover:bg-gray-50 dark:hover:bg-white/[0.02] text-left transition-all group"
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
