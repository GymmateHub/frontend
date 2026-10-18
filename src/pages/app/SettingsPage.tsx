import { Link } from "react-router";
import { Building2 } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useActiveGym } from "../../features/gyms/useActiveGym";
import GymProfileCard from "../../components/settings/GymProfileCard";
import BusinessHoursCard from "../../components/settings/BusinessHoursCard";
import NotificationPreferencesCard from "../../components/settings/NotificationPreferencesCard";
import SecurityCard from "../../components/settings/SecurityCard";
import { cardClass } from "../../components/settings/styles";

export default function SettingsPage() {
  const { gym, isLoading } = useActiveGym();

  return (
    <>
      <PageMeta title="Settings | GymMate" description="Gym settings and configuration" />

      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your gym profile, hours, and preferences</p>
        </div>

        {isLoading ? (
          <div className={`${cardClass} animate-pulse space-y-3`} aria-busy="true">
            <div className="h-5 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-10 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-10 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        ) : gym ? (
          <>
            <GymProfileCard key={`profile-${gym.id}`} gym={gym} />
            <BusinessHoursCard key={`hours-${gym.id}`} gym={gym} />
            <NotificationPreferencesCard key={`notif-${gym.id}`} gymId={gym.id} />
          </>
        ) : (
          <div className={`${cardClass} text-center py-12`}>
            <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">No gym found for your account</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add a gym before editing its profile or business hours.
            </p>
            <Link to="/gym-management" className="mt-4 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
              Go to Gym Management
            </Link>
          </div>
        )}

        <SecurityCard />
      </div>
    </>
  );
}
