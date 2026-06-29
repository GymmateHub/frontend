import { Trophy, Plus, Users, Calendar } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

// Sample data for demonstration
const sampleChallenges = [
  {
    id: "1",
    title: "30-Day Weight Loss Challenge",
    description: "Complete 30 days of consistent workouts and healthy eating to win prizes.",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    participants: 24,
    maxParticipants: 50,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Summer Shred 2026",
    description: "8-week transformation challenge with weekly check-ins and nutrition coaching.",
    startDate: "2026-06-01",
    endDate: "2026-07-26",
    participants: 38,
    maxParticipants: 40,
    status: "active",
  },
];

const statusConfig: Record<string, string> = {
  active: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  ended: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

export default function ChallengesPage() {
  const showSample = true; // flip to false when API is wired

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

        {showSample ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {sampleChallenges.map((challenge) => {
              const progress = Math.round((challenge.participants / challenge.maxParticipants) * 100);
              return (
                <div key={challenge.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 dark:bg-warning-500/20">
                      <Trophy className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusConfig[challenge.status] ?? statusConfig.ended}`}>
                      {challenge.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-1">{challenge.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{challenge.description}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(challenge.startDate).toLocaleDateString()} — {new Date(challenge.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {challenge.participants} / {challenge.maxParticipants} participants
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      <span>Enrollment</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <Trophy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No challenges yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first fitness challenge to engage members</p>
          </div>
        )}
      </div>
    </>
  );
}
