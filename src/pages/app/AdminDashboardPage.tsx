import { useNavigate } from "react-router";
import {
  Building2,
  Dumbbell,
  Users,
  Crown,
  Contact,
  ArrowRight,
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../auth/auth.store";
import {
  usePlatformOverview,
  OrganisationSummary,
} from "../../features/admin/admin.hooks";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: typeof Users;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}

const planColor: Record<string, string> = {
  enterprise:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  professional:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  starter: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

const statusColor: Record<string, string> = {
  active:
    "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  trial:
    "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  cancelled:
    "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: overview, isLoading } = usePlatformOverview();

  const fmt = (n?: number) => (isLoading ? "..." : (n ?? 0).toLocaleString());

  const stats = [
    {
      title: "Organisations",
      value: fmt(overview?.totalOrganisations),
      icon: Building2,
      color: "bg-brand-500",
    },
    {
      title: "Gyms",
      value: fmt(overview?.totalGyms),
      icon: Dumbbell,
      color: "bg-success-500",
    },
    {
      title: "Total Users",
      value: fmt(overview?.totalUsers),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Gym Owners",
      value: fmt(overview?.totalOwners),
      icon: Crown,
      color: "bg-warning-500",
    },
    {
      title: "Members",
      value: fmt(overview?.totalMembers),
      icon: Contact,
      color: "bg-purple-500",
    },
  ];

  return (
    <>
      <PageMeta
        title="Platform Overview | GymMate"
        description="GymMateHub platform administration overview"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Platform Overview
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName}! Here&apos;s how GymMateHub is
              doing across all tenants.
            </p>
          </div>
          <button
            onClick={() => navigate("/tenant-management")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            Manage Tenants
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* Recent organisations */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Recent Organisations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
                  <th className="px-6 py-3 text-xs font-medium uppercase text-gray-400">
                    Organisation
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase text-gray-400">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase text-gray-400">
                    Gyms
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase text-gray-400">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase text-gray-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : !overview?.recentOrganisations?.length ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No organisations yet
                    </td>
                  </tr>
                ) : (
                  overview.recentOrganisations.map((org: OrganisationSummary) => (
                    <tr
                      key={org.id}
                      className="border-b border-gray-100 last:border-0 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {org.name}
                        </p>
                        <p className="text-xs text-gray-400">{org.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {org.contactEmail || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {org.gymCount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            planColor[org.subscriptionPlan ?? ""] ??
                            planColor.starter
                          }`}
                        >
                          {org.subscriptionPlan ?? "starter"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            statusColor[org.subscriptionStatus ?? ""] ??
                            statusColor.trial
                          }`}
                        >
                          {org.subscriptionStatus ?? "trial"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
