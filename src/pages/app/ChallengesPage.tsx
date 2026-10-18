import { useState } from "react";
import { Trophy, Plus, Calendar, Target, Award, X, Info } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useToast } from "../../hooks/use-toast";
import { useActiveGym } from "../../features/gyms/useActiveGym";
import {
  loadChallenges,
  saveChallenges,
  validateChallengeDates,
  type Challenge,
} from "../../utils/challengesStore";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

const today = () => new Date().toISOString().split("T")[0];
const inThirtyDays = () => new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

const blankForm = () => ({
  title: "",
  description: "",
  category: "Consistency",
  target: "",
  startDate: today(),
  endDate: inThirtyDays(),
  points: "250",
});

export default function ChallengesPage() {
  const { gymId, isLoading: gymLoading } = useActiveGym();
  // Keyed remount re-reads storage when the active gym resolves or changes.
  return gymLoading ? null : <ChallengesView key={gymId} gymId={gymId} />;
}

function ChallengesView({ gymId }: { gymId: string }) {
  const [challenges, setChallenges] = useState<Challenge[]>(() => loadChallenges(gymId));
  const { isOpen, openModal, closeModal } = useModal();
  const { toast } = useToast();

  const [form, setForm] = useState(blankForm);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.target.trim()) return;

    const dateProblem = validateChallengeDates(form.startDate, form.endDate);
    if (dateProblem) {
      setFormError(dateProblem);
      return;
    }

    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      target: form.target.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      points: Math.max(0, parseInt(form.points) || 0),
    };

    const next = [newChallenge, ...challenges];
    if (!saveChallenges(gymId, next)) {
      setFormError("Your browser blocked local storage, so the challenge couldn't be saved.");
      return;
    }
    setChallenges(next);
    toast({
      title: "Challenge saved",
      description: `${newChallenge.title} was saved on this device.`,
    });
    setForm(blankForm());
    setFormError(null);
    closeModal();
  };

  const handleClose = () => {
    setFormError(null);
    closeModal();
  };

  return (
    <>
      <PageMeta title="Challenges | GymMate" description="Manage fitness challenges and competitions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Challenges</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Engage members with competitive fitness challenges and reward milestones
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Challenge
          </button>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Challenges are saved on this device only for now. They aren't shared with members or other browsers yet.</p>
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <Trophy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No challenges yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first fitness challenge to engage members</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 hover:shadow-sm transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{c.title}</h3>
                        <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">{c.category}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {c.points} pts
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{c.description}</p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span>Target: <strong className="text-gray-700 dark:text-gray-300">{c.target}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {c.startDate} to {c.endDate}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {c.endDate < today() ? "Ended" : c.startDate > today() ? "Upcoming" : "Running"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Challenge Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[550px] p-6 lg:p-8">
        <form onSubmit={handleCreate} className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                Create Fitness Challenge
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Set goals, timelines, and rewards for gym members.
              </p>
            </div>
            <button type="button" onClick={handleClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="challenge-title" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Challenge Title *</label>
              <input
                id="challenge-title"
                type="text"
                required
                value={form.title}
                placeholder="e.g. 30-Day Summer Shred"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
              <textarea
                rows={3}
                value={form.description}
                placeholder="Explain the rules, targets, and how winners are selected"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                >
                  <option value="Consistency">Consistency</option>
                  <option value="Endurance">Endurance</option>
                  <option value="Strength">Strength</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Classes">Class Attendance</option>
                </select>
              </div>
              <div>
                <label htmlFor="challenge-target" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Target Goal *</label>
                <input
                  id="challenge-target"
                  type="text"
                  required
                  value={form.target}
                  placeholder="e.g. 20 Workouts"
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="challenge-start" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Start Date</label>
                <input
                  id="challenge-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="challenge-end" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">End Date</label>
                <input
                  id="challenge-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Reward Points</label>
              <input
                type="number"
                min="0"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {formError && (
            <p role="alert" className="mt-4 text-sm text-error-600 dark:text-error-400">{formError}</p>
          )}

          <div className="flex items-center gap-3 mt-6 sm:justify-end">
            <button
              onClick={handleClose}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto shadow-sm"
            >
              Create Challenge
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
