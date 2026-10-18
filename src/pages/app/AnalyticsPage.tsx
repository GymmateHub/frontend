import { Users, TrendingUp, DollarSign, BarChart2, Calendar, Activity } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useAllGymsAnalytics } from "../../features/analytics/analytics.hooks";
import { useCurrency } from "../../utils/currency";

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAllGymsAnalytics();
  const { format } = useCurrency();

  const fmt = (n: number | undefined, isCurrency = false) => {
    if (n === undefined || n === null) return "—";
    if (isCurrency) return format(n);
    return n.toLocaleString();
  };

  return (
    <>
      <PageMeta title="Analytics | GymMate" description="Business analytics and insights" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Business performance overview and key metrics</p>
          </div>
        </div>

        {/* KPI Cards */}
        {isError && !isLoading ? (
          <div role="alert" className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            Couldn't load analytics.{" "}
            <button type="button" onClick={() => refetch()} className="font-medium underline">Try again</button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard
              icon={<Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
              label="Total Members"
              value={fmt(data?.totalMembers)}
              sub={`${fmt(data?.activeMembers)} active`}
              color="bg-brand-100 dark:bg-brand-500/20"
            />
            <KpiCard
              icon={<DollarSign className="h-5 w-5 text-success-600 dark:text-success-400" />}
              label="Total Revenue"
              value={fmt(data?.totalRevenue, true)}
              sub={`${fmt(data?.monthlyRevenue, true)} this month`}
              color="bg-success-100 dark:bg-success-500/20"
            />
            <KpiCard
              icon={<Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              label="Classes This Month"
              value={fmt(data?.classesThisMonth)}
              color="bg-blue-100 dark:bg-blue-500/20"
            />
            <KpiCard
              icon={<Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
              label="Average Attendance"
              value={data?.averageAttendance !== undefined ? `${data.averageAttendance.toFixed(1)}%` : "—"}
              color="bg-purple-100 dark:bg-purple-500/20"
            />
            <KpiCard
              icon={<TrendingUp className="h-5 w-5 text-warning-600 dark:text-warning-400" />}
              label="Member Retention Rate"
              value={data?.memberRetentionRate !== undefined ? `${data.memberRetentionRate.toFixed(1)}%` : "—"}
              color="bg-warning-100 dark:bg-warning-500/20"
            />
            <KpiCard
              icon={<BarChart2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
              label="Growth Rate"
              value={data?.growthRate !== undefined ? `${data.growthRate >= 0 ? "+" : ""}${data.growthRate.toFixed(1)}%` : "—"}
              color="bg-orange-100 dark:bg-orange-500/20"
            />
          </div>
        )}
      </div>
    </>
  );
}
