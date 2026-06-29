import { useState } from "react";
import { Users, TrendingUp, DollarSign, BarChart2, Calendar, Activity } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useAllGymsAnalytics } from "../../features/analytics/analytics.hooks";

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

function fmt(n: number | undefined, currency = false) {
  if (n === undefined || n === null) return "â€”";
  if (currency) return `$${n.toLocaleString()}`;
  return n.toLocaleString();
}

export default function AnalyticsPage() {
  const { data, isLoading } = useAllGymsAnalytics();
  const [_gymId] = useState("");

  return (
    <>
      <PageMeta title="Analytics | GymMate" description="Business analytics and insights" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Business performance overview</p>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard icon={<Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />} label="Total Members" value={fmt(data?.totalMembers)} color="bg-brand-100 dark:bg-brand-500/20" />
            <KpiCard icon={<Activity className="h-5 w-5 text-success-600 dark:text-success-400" />} label="Active Members" value={fmt(data?.activeMembers)} color="bg-success-100 dark:bg-success-500/20" />
            <KpiCard icon={<DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />} label="Monthly Revenue" value={fmt(data?.monthlyRevenue, true)} sub={data?.growthRate !== undefined ? `${data.growthRate >= 0 ? "+" : ""}${data.growthRate.toFixed(1)}% vs last month` : undefined} color="bg-blue-100 dark:bg-blue-500/20" />
            <KpiCard icon={<TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />} label="Total Revenue" value={fmt(data?.totalRevenue, true)} color="bg-purple-100 dark:bg-purple-500/20" />
            <KpiCard icon={<Calendar className="h-5 w-5 text-warning-600 dark:text-warning-400" />} label="Classes This Month" value={fmt(data?.classesThisMonth)} color="bg-warning-100 dark:bg-warning-500/20" />
            <KpiCard icon={<BarChart2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />} label="Avg Attendance" value={data?.averageAttendance !== undefined ? `${data.averageAttendance.toFixed(1)}%` : "â€”"} color="bg-orange-100 dark:bg-orange-500/20" />
          </div>
        )}

        {/* Chart Placeholder */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Revenue Chart</h2>
          <div className="flex items-center justify-center h-48 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <BarChart2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">Revenue chart coming soon</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Classes */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Top Classes</h2>
            {data?.topClasses && data.topClasses.length > 0 ? (
              <div className="space-y-3">
                {data.topClasses.map((cls: any, idx: number) => (
                  <div key={cls.id ?? idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold">{idx + 1}</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{cls.name}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cls.attendanceCount ?? cls.count ?? "â€”"} members</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No class data available</p>
            )}
          </div>

          {/* Members by Plan */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Members by Plan</h2>
            {data?.membersByPlan && Object.keys(data.membersByPlan).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.membersByPlan).map(([plan, count]: [string, any]) => (
                  <div key={plan} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">{plan}</p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{count} members</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No plan data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

