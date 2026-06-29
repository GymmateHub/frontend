import { useState } from "react";
import { Building2, Clock, Bell, Shield, Save } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

const inputClass =
  "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <label className="relative flex-shrink-0 cursor-pointer">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`}>
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
        </div>
      </label>
    </div>
  );
}

const businessHours = [
  { day: "Monday", open: "06:00", close: "22:00", active: true },
  { day: "Tuesday", open: "06:00", close: "22:00", active: true },
  { day: "Wednesday", open: "06:00", close: "22:00", active: true },
  { day: "Thursday", open: "06:00", close: "22:00", active: true },
  { day: "Friday", open: "06:00", close: "21:00", active: true },
  { day: "Saturday", open: "08:00", close: "18:00", active: true },
  { day: "Sunday", open: "09:00", close: "16:00", active: false },
];

export default function SettingsPage() {
  const [gymName, setGymName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [notifNewMember, setNotifNewMember] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifMaintenance, setNotifMaintenance] = useState(false);
  const [notifClass, setNotifClass] = useState(true);

  return (
    <>
      <PageMeta title="Settings | GymMate" description="Configure your gym settings" />

      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your gym profile and preferences</p>
        </div>

        {/* Gym Profile */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
              <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Gym Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Gym Name</label>
              <input type="text" value={gymName} onChange={(e) => setGymName(e.target.value)} className={inputClass} placeholder="My Awesome Gym" />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="123 Main Street, City" />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+234 000 0000" />
            </div>
            <div>
              <label className={labelClass}>Logo</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                </div>
                <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Upload Logo
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
              <Save className="h-4 w-4" />
              Save Profile
            </button>
          </div>
        </div>

        {/* Business Hours */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Business Hours</h2>
          </div>
          <div className="space-y-2">
            {businessHours.map((h) => (
              <div key={h.day} className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">{h.day}</span>
                <input type="time" defaultValue={h.open} disabled={!h.active}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-800 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                <span className="text-gray-400 text-sm">—</span>
                <input type="time" defaultValue={h.close} disabled={!h.active}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-800 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                <span className={`ml-auto text-xs font-medium ${h.active ? "text-success-600 dark:text-success-400" : "text-gray-400"}`}>
                  {h.active ? "Open" : "Closed"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
              <Save className="h-4 w-4" />
              Save Hours
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/20">
              <Bell className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Notification Preferences</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <Toggle label="New member registrations" description="Get notified when a new member signs up" checked={notifNewMember} onChange={setNotifNewMember} />
            <Toggle label="Payment confirmations" description="Get notified when a payment is processed" checked={notifPayment} onChange={setNotifPayment} />
            <Toggle label="Equipment maintenance alerts" description="Get notified when equipment needs maintenance" checked={notifMaintenance} onChange={setNotifMaintenance} />
            <Toggle label="Class changes" description="Get notified when classes are added or cancelled" checked={notifClass} onChange={setNotifClass} />
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/20">
              <Shield className="h-5 w-5 text-error-600 dark:text-error-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Security</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">Password</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last changed 30 days ago</p>
              </div>
              <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">Two-factor authentication</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
