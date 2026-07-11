import type React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white z-1 dark:bg-gray-900">
      <div className="relative flex flex-col w-full h-screen lg:flex-row dark:bg-gray-900">
        {/* Form side — ~70% */}
        <div className="flex w-full flex-col p-6 sm:p-10 lg:w-[70%]">
          <Link to="/" className="flex w-fit items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-lg">
              <span className="text-lg font-bold text-white">GM</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white/90">
              GymMateHub
            </span>
          </Link>
          <div className="flex flex-1 flex-col">{children}</div>
        </div>

        {/* Brand side — 30% */}
        <div className="relative hidden h-full w-[30%] items-center bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />
            <div className="flex max-w-xs flex-col items-center px-8 text-center">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 shadow-lg">
                  <span className="text-xl font-bold text-white">GM</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  GymMateHub
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 dark:text-white/60">
                Run your gym smarter — members, payments and renewals in one
                place.
              </p>
            </div>
          </div>
        </div>

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
