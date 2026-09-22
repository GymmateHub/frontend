import { useState } from "react";
import { Clock, Loader2, Save } from "lucide-react";
import type { GymResponse } from "../../features/gyms/gyms.api";
import { useUpdateGymBusinessSettings } from "../../features/gyms/gyms.hooks";
import { useToast } from "../../hooks/use-toast";
import {
  DAYS,
  DAY_LABELS,
  parseBusinessHours,
  serializeBusinessHours,
  validateBusinessHours,
  type BusinessHours,
  type Day,
  type DayHours,
} from "../../utils/businessHours";
import { cardClass, primaryButtonClass } from "./styles";

const timeInputClass =
  "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-800 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

/** Render as `<BusinessHoursCard key={gym.id} gym={gym} />` so state re-seeds when the gym changes. */
export default function BusinessHoursCard({ gym }: { gym: GymResponse }) {
  const updateSettings = useUpdateGymBusinessSettings();
  const { toast } = useToast();
  const [hours, setHours] = useState<BusinessHours>(() => parseBusinessHours(gym.businessHours));

  const change = (day: Day, patch: Partial<DayHours>) =>
    setHours((current) => ({ ...current, [day]: { ...current[day], ...patch } }));

  const handleSave = async () => {
    const problem = validateBusinessHours(hours);
    if (problem) {
      toast({ title: "Check business hours", description: problem, variant: "destructive" });
      return;
    }
    try {
      await updateSettings.mutateAsync({
        id: gym.id,
        data: { businessHours: serializeBusinessHours(hours) },
      });
    } catch {
      // error toast is shown by the hook
    }
  };

  return (
    <section className={cardClass} aria-labelledby="business-hours-heading">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 id="business-hours-heading" className="text-base font-semibold text-gray-800 dark:text-white/90">
          Business Hours
        </h2>
      </div>

      <div className="space-y-2">
        {DAYS.map((day) => {
          const h = hours[day];
          return (
            <div key={day} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{DAY_LABELS[day]}</span>
              <input
                type="time"
                aria-label={`${DAY_LABELS[day]} opening time`}
                value={h.open}
                disabled={!h.active}
                onChange={(e) => change(day, { open: e.target.value })}
                className={timeInputClass}
              />
              <span className="text-gray-400 text-sm">—</span>
              <input
                type="time"
                aria-label={`${DAY_LABELS[day]} closing time`}
                value={h.close}
                disabled={!h.active}
                onChange={(e) => change(day, { close: e.target.value })}
                className={timeInputClass}
              />
              <label className="ml-auto flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={h.active}
                  onChange={(e) => change(day, { active: e.target.checked })}
                  aria-label={`${DAY_LABELS[day]} open`}
                />
                <span className={h.active ? "text-success-600 dark:text-success-400" : "text-gray-400"}>
                  {h.active ? "Open" : "Closed"}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={handleSave} disabled={updateSettings.isPending} className={primaryButtonClass}>
          {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Hours
        </button>
      </div>
    </section>
  );
}
