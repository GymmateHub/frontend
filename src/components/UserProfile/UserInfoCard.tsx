import { useMyProfile } from "../../features/users/users.hooks";
import { useAuth } from "../../auth/auth.store";

const roleLabel = (role?: string) =>
  (role ?? "")
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function UserInfoCard() {
  const { user: authUser } = useAuth();
  const { data: profile, isLoading, isError, refetch } = useMyProfile();

  // Fall back to what we know from sign-in while (or if) the full profile can't load, so the
  // page never shows blanks for details the user already gave us.
  const shown = profile ?? authUser;

  const fields = [
    { label: "First Name", value: shown?.firstName },
    { label: "Last Name", value: shown?.lastName },
    { label: "Email Address", value: shown?.email },
    { label: "Phone", value: profile?.phone || "—" },
    { label: "Role", value: roleLabel(shown?.role) },
    { label: "Status", value: profile?.status?.toLowerCase() },
    {
      label: "Member Since",
      value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString()
        : "—",
    },
    {
      label: "Last Login",
      value: profile?.lastLoginAt
        ? new Date(profile.lastLoginAt).toLocaleString()
        : "—",
    },
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 mb-5">
        Personal Information
      </h4>

      {isLoading && !authUser ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <>
        {isError && (
          <p role="alert" className="mb-4 text-sm text-warning-700 dark:text-warning-400">
            Couldn't load your full profile.{" "}
            <button type="button" onClick={() => refetch()} className="font-medium underline">
              Try again
            </button>
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {f.label}
              </p>
              <p className="text-sm font-medium capitalize text-gray-800 dark:text-white/90">
                {f.value || "—"}
              </p>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
