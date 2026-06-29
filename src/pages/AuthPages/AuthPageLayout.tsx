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
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-sm px-8 text-center">
              <Link to="/" className="mb-6 flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">GM</span>
                </div>
                <span className="text-white font-bold text-2xl">GymMateHub</span>
              </Link>
              <h2 className="text-white text-2xl font-bold mb-3">
                Run Your Gym Smarter
              </h2>
              <p className="text-gray-400 dark:text-white/60 text-sm leading-relaxed mb-8">
                Track members, collect payments, and never miss a renewal — built for gyms across Africa and emerging markets.
              </p>
              <div className="w-full space-y-3">
                {[
                  { icon: "👥", text: "Member & payment tracking" },
                  { icon: "📅", text: "Class scheduling & bookings" },
                  { icon: "📊", text: "Revenue analytics & reports" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <span className="text-lg">{icon}</span>
                    <span className="text-gray-300 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
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
