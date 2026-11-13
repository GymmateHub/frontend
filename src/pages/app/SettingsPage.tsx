import { Link } from "react-router";
import { Building2, FileCode2, ArrowRight } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useActiveGym } from "../../features/gyms/useActiveGym";
import GymProfileCard from "../../components/settings/GymProfileCard";
import BusinessHoursCard from "../../components/settings/BusinessHoursCard";
import NotificationPreferencesCard from "../../components/settings/NotificationPreferencesCard";
import SecurityCard from "../../components/settings/SecurityCard";
import { cardClass, secondaryButtonClass } from "../../components/settings/styles";

export default function SettingsPage() {
  const { gym, isLoading } = useActiveGym();

  return (
    <>
      <PageMeta title="Settings | GymMateHub" description="Gym settings and configuration" />

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

        <section className={cardClass} aria-labelledby="message-templates-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
                <FileCode2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h2 id="message-templates-heading" className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Message Templates
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Configure transactional Email subjects/bodies and Notification messages from one central hub.
                </p>
              </div>
            </div>
            <Link
              to="/message-templates"
              className={`${secondaryButtonClass} inline-flex items-center gap-2 shrink-0`}
            >
              Manage Templates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <SecurityCard />
      </div>
    </>
  );
}
