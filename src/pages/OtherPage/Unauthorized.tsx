import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function Unauthorized() {
  return (
    <>
      <PageMeta title="Unauthorized | GymMate" description="Access denied" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-white/90">
            403
          </h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Access Denied
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            You don&apos;t have permission to view this page.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
