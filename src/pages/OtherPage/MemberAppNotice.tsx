import { Smartphone } from "lucide-react";
import Button from "../../components/ui/button/Button";
import { useAuth } from "../../auth/auth.store";

/**
 * Shown to MEMBER accounts that sign in on the web.
 * The member experience lives in the mobile app; the web app is for
 * gym staff and platform administrators.
 */
export default function MemberAppNotice() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-theme-sm dark:bg-gray-800">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
          <Smartphone className="h-7 w-7 text-brand-500" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
          Hi {user?.firstName || "there"}, GymMateHub for members lives on
          mobile
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Your membership, class bookings, check-ins and progress tracking are
          all in the GymMateHub mobile app. Download it and sign in with this
          same account.
        </p>
        <Button className="w-full" onClick={() => logout()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
