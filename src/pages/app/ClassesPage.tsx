import { Calendar, Plus, Users, Clock, BookOpen, TrendingUp } from "lucide-react";
import { useAuth } from "../../auth/auth.store";
import PageMeta from "../../components/common/PageMeta";
import { useClasses, useClassStats } from "../../features/classes/classes.hooks";

const categoryColor: Record<string, string> = {
  yoga: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  cardio: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  strength: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  pilates: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400",
  cycling: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  default: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400",
};

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const { user } = useAuth();
  const gymId = user?.gymId ?? "";
  const { data: classes = [], isLoading } = useClasses(gymId);
  const { data: stats } = useClassStats();

  return (
    <>
      <PageMeta title="Classes | GymMate" description="Manage your gym classes and schedules" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Classes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{classes.length} total classes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Add Class
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<BookOpen className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Classes" value={stats?.totalClasses ?? classes.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />} label="Today's Sessions" value={0} color="bg-blue-100 dark:bg-blue-500/20" />
          <StatCard icon={<Users className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Total Enrolled" value={0} color="bg-success-100 dark:bg-success-500/20" />
          <StatCard icon={<TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Avg Attendance" value={stats ? `${stats.averageAttendance.toFixed(0)}%` : "â€”"} color="bg-warning-100 dark:bg-warning-500/20" />
        </div>

        {/* Class Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-3">
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No classes yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first class to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {classes.map((cls: { id: string; name: string; category?: { name?: string }; description?: string }) => {
              const catKey = cls.category?.name?.toLowerCase() ?? "default";
              const catColor = categoryColor[catKey] ?? categoryColor.default;
              return (
                <div key={cls.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 leading-tight">{cls.name}</h3>
                    {cls.category && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${catColor}`}>{cls.category.name}</span>
                    )}
                  </div>
                  {cls.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{cls.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {cls.capacity ?? "â€”"} capacity
                    </span>
                    {cls.durationMinutes && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {cls.durationMinutes}m
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}


