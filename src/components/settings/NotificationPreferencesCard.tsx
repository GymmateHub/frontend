import { useState } from "react";
import { Bell, Save } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from "../../utils/notificationPrefs";
import { cardClass, primaryButtonClass } from "./styles";

function Toggle({ id, label, description, checked, onChange }: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p id={`${id}-label`} className="text-sm font-medium text-gray-800 dark:text-white/90">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

/** Render as `<NotificationPreferencesCard key={gymId} gymId={gymId} />`. */
export default function NotificationPreferencesCard({ gymId }: { gymId: string }) {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => loadNotificationPrefs(gymId));

  const set = (patch: Partial<NotificationPrefs>) => setPrefs((current) => ({ ...current, ...patch }));

  const handleSave = () => {
    if (saveNotificationPrefs(gymId, prefs)) {
      toast({ title: "Notification preferences saved", description: "Saved on this device." });
    } else {
      toast({
        title: "Couldn't save preferences",
        description: "Your browser blocked local storage. Check your privacy settings and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className={cardClass} aria-labelledby="notif-heading">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/20">
          <Bell className="h-5 w-5 text-warning-600 dark:text-warning-400" />
        </div>
        <div>
          <h2 id="notif-heading" className="text-base font-semibold text-gray-800 dark:text-white/90">Notification Preferences</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Stored in this browser only until account-level preferences are available.</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <Toggle id="notif-new-member" label="New member registrations" description="Get notified when a new member signs up" checked={prefs.newMember} onChange={(v) => set({ newMember: v })} />
        <Toggle id="notif-payment" label="Payment confirmations" description="Get notified when a payment is processed" checked={prefs.payment} onChange={(v) => set({ payment: v })} />
        <Toggle id="notif-maintenance" label="Equipment maintenance alerts" description="Get notified when equipment needs maintenance" checked={prefs.maintenance} onChange={(v) => set({ maintenance: v })} />
        <Toggle id="notif-class" label="Class changes" description="Get notified when classes are added or cancelled" checked={prefs.classChanges} onChange={(v) => set({ classChanges: v })} />
      </div>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={handleSave} className={primaryButtonClass}>
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </section>
  );
}
