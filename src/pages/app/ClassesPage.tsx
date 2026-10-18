import { getErrorMessage } from "../../api/axios";
import { useState } from "react";
import { Calendar, Plus, Users, Clock, BookOpen, TrendingUp, X, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/auth.store";
import { hasPermission, PERMISSIONS } from "../../auth/permissions";
import { useMyGyms } from "../../features/gyms/gyms.hooks";
import type { GymResponse } from "../../features/gyms/gyms.api";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useClasses, useClassStats, useCreateClass, useClassCategories } from "../../features/classes/classes.hooks";

const categoryColor: Record<string, string> = {
  yoga: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  cardio: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  strength: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  pilates: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400",
  cycling: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  default: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400",
};

interface GymClassItem {
  id: string;
  name: string;
  category?: { name?: string };
  categoryName?: string;
  description?: string;
  capacity?: number;
  defaultCapacity?: number;
  durationMinutes?: number;
  defaultDuration?: number;
}

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

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
  const { data: gyms = [] } = useMyGyms();
  const activeGymId = user?.gymId || (gyms[0] as GymResponse)?.id || "";
  const [selectedGymId, setSelectedGymId] = useState<string>(activeGymId);
  const effectiveGymId = selectedGymId || activeGymId;

  const { data: classes = [], isLoading } = useClasses(effectiveGymId);
  const { data: categories = [] } = useClassCategories(effectiveGymId);
  const { data: stats } = useClassStats();
  const createClass = useCreateClass();
  const { isOpen, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    capacity: "20",
    durationMinutes: "60",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreate = async () => {
    setErrorMsg(null);
    if (!form.name.trim()) {
      setErrorMsg("Class name is required.");
      return;
    }
    if (!effectiveGymId) {
      setErrorMsg("Please select an active gym location.");
      return;
    }

    try {
      await createClass.mutateAsync({
        gymId: effectiveGymId,
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        categoryId: form.categoryId || categories[0]?.id || "general",
        defaultCapacity: parseInt(form.capacity) || 20,
        defaultDuration: parseInt(form.durationMinutes) || 60,
        durationMinutes: parseInt(form.durationMinutes) || 60,
        capacity: parseInt(form.capacity) || 20,
      });
      setForm({ name: "", description: "", categoryId: "", capacity: "20", durationMinutes: "60" });
      closeModal();
    } catch (err) {
      setErrorMsg(getErrorMessage(err) || "Failed to create class");
    }
  };

  return (
    <>
      <PageMeta title="Classes | GymMate" description="Manage your gym classes and schedules" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Classes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{classes.length} total classes</p>
          </div>
          <div className="flex items-center gap-3">
            {gyms.length > 1 && (
              <select
                value={effectiveGymId}
                onChange={(e) => setSelectedGymId(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-800 dark:text-white focus:outline-none"
              >
                {(gyms as GymResponse[]).map((g: GymResponse) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
{hasPermission(user, PERMISSIONS.CLASSES_MANAGE) && (
            <button
              onClick={() => {
                setErrorMsg(null);
                openModal();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Class
            </button>)}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<BookOpen className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Classes" value={stats?.totalClasses ?? classes.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />} label="Today's Sessions" value={0} color="bg-blue-100 dark:bg-blue-500/20" />
          <StatCard icon={<Users className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Total Enrolled" value={0} color="bg-success-100 dark:bg-success-500/20" />
          <StatCard icon={<TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Avg Attendance" value={stats ? `${stats.averageAttendance.toFixed(0)}%` : "—"} color="bg-warning-100 dark:bg-warning-500/20" />
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
            {classes.map((cls: GymClassItem) => {
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
                      {cls.capacity ?? cls.defaultCapacity ?? "—"} capacity
                    </span>
                    {(cls.durationMinutes || cls.defaultDuration) && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {cls.durationMinutes ?? cls.defaultDuration}m
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[550px] p-6 lg:p-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                Add New Class
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Register a new fitness class offering for your schedule.
              </p>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Class Name *</label>
              <input
                type="text"
                value={form.name}
                placeholder="e.g. HIIT Power Hour, Yoga Flow"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
              <input
                type="text"
                value={form.description}
                placeholder="Brief summary of the class format and targets"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Capacity (Persons)</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={createClass.isPending || !form.name.trim()}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto shadow-sm"
            >
              {createClass.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Class
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
