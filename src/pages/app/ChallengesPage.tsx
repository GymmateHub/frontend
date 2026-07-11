import { Trophy, Plus } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

// NOTE: there is no challenges API in the backend yet. This page shows an
// honest empty state until the module exists — no sample data.
export default function ChallengesPage() {
  return (
    <>
      <PageMeta title="Challenges | GymMate" description="Manage fitness challenges and competitions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Challenges</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Engage members with fitness challenges</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Create Challenge
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
          <Trophy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-base font-medium text-gray-600 dark:text-gray-300">No challenges yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first fitness challenge to engage members</p>
        </div>
      </div>
    </>
  );
}
