export default function SidebarWidget() {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-brand-50 dark:bg-brand-500/10 px-4 py-5 text-center border border-brand-100 dark:border-brand-500/20">
      <div className="mb-2 flex items-center justify-center gap-2">
        <div className="h-6 w-6 rounded-md bg-brand-500 flex items-center justify-center">
          <span className="text-white font-bold text-xs">GM</span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          GymMateHub
        </h3>
      </div>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Need help? Contact our support team anytime.
      </p>
      <a
        href="mailto:support@gymmatehub.com"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 transition-colors"
      >
        Get Support
      </a>
    </div>
  );
}
