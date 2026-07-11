import { useMyProfile } from "../../features/users/users.hooks";

const roleLabel = (role?: string) =>
  (role ?? "")
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function UserInfoCard() {
  const { data: profile, isLoading } = useMyProfile();

  const fields = [
    { label: "First Name", value: profile?.firstName },
    { label: "Last Name", value: profile?.lastName },
    { label: "Email Address", value: profile?.email },
    { label: "Phone", value: profile?.phone || "—" },
    { label: "Role", value: roleLabel(profile?.role) },
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

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
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
      )}
    </div>
  );
}
