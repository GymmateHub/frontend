import { ShieldAlert } from "lucide-react";
import { useAuth } from "../auth/auth.store";

/**
 * Shown while a platform admin acts inside an organisation. Every request in this mode carries
 * X-Organisation-Id and is written to the backend's security audit log.
 */
export default function ActingOrgBanner() {
  const { user, stopActing } = useAuth();
  if (!user?.actingOrg) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-warning-50 px-4 py-2.5 text-sm text-warning-800 dark:bg-warning-500/10 dark:text-warning-300 md:px-6">
      <span className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4" />
        Acting as <strong>{user.actingOrg.name}</strong>. Changes apply to this organisation and are audited.
      </span>
      <button onClick={stopActing} className="font-medium underline hover:no-underline">
        Exit organisation
      </button>
    </div>
  );
}
