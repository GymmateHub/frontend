import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./auth/auth.store";
import { ProtectedRoute, PublicRoute } from "./auth/require-auth";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Landing pages load with the first bundle: they are the public entry point
// and are prerendered at build time (see src/pages/landing/landing-pages.ts).
import LandingLayout from "./layout/LandingLayout";
import { LANDING_PAGES } from "./pages/landing/landing-pages";

// Everything behind sign-in, and the auth screens, load on demand so visitors
// to the marketing pages don't download the dashboard.
const AppLayout = lazy(() => import("./layout/AppLayout"));

// Auth pages
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/AuthPages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/AuthPages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/AuthPages/VerifyEmail"));
const AcceptInvite = lazy(() => import("./pages/AuthPages/AcceptInvite"));

// App pages
const DashboardPage = lazy(() => import("./pages/app/DashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/app/AdminDashboardPage"));
const MembersPage = lazy(() => import("./pages/app/MembersPage"));
const MembershipPlansPage = lazy(() => import("./pages/app/MembershipPlansPage"));
const ClassesPage = lazy(() => import("./pages/app/ClassesPage"));
const EquipmentPage = lazy(() => import("./pages/app/EquipmentPage"));
const InventoryPage = lazy(() => import("./pages/app/InventoryPage"));
const AnalyticsPage = lazy(() => import("./pages/app/AnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/app/ReportsPage"));
const BillingPage = lazy(() => import("./pages/app/BillingPage"));
const PointOfSalePage = lazy(() => import("./pages/app/PointOfSalePage"));
const LeadsPage = lazy(() => import("./pages/app/LeadsPage"));
const ChallengesPage = lazy(() => import("./pages/app/ChallengesPage"));
const MessagesPage = lazy(() => import("./pages/app/MessagesPage"));
const NotificationsPage = lazy(() => import("./pages/app/NotificationsPage"));
const MessageTemplatesPage = lazy(() => import("./pages/app/MessageTemplatesPage"));
const SettingsPage = lazy(() => import("./pages/app/SettingsPage"));
const GymManagementPage = lazy(() => import("./pages/app/GymManagementPage"));
const TeamPage = lazy(() => import("./pages/app/TeamPage"));
const TenantManagementPage = lazy(() => import("./pages/app/TenantManagementPage"));

// Other pages
const Calendar = lazy(() => import("./pages/Calendar"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const Unauthorized = lazy(() => import("./pages/OtherPage/Unauthorized"));
const MemberAppNotice = lazy(() => import("./pages/OtherPage/MemberAppNotice"));

function RouteFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* ── Landing (public, own header/footer) ── */}
            <Route element={<LandingLayout />}>
              {LANDING_PAGES.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
              <Route path="/services" element={<Navigate to="/features" replace />} />
            </Route>

            {/* ── Auth pages (public, sidebar-less) ── */}
            <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            {/* Team invite email link; works whether or not someone is signed in */}
            <Route path="/invite" element={<AcceptInvite />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Legacy routes for backward compat */}
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

            {/* ── App (protected, sidebar layout) ── */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/plans" element={<MembershipPlansPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/pos" element={<PointOfSalePage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/message-templates" element={<MessageTemplatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<UserProfiles />} />
              {/* Access is enforced centrally by ProtectedRoute via
                  src/auth/permissions.ts (SCREEN_PERMISSIONS) */}
              <Route path="/gym-management" element={<GymManagementPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/tenant-management" element={<TenantManagementPage />} />
            </Route>

            {/* Members are mobile-first — web shows a notice (no sidebar) */}
            <Route
              path="/member-app"
              element={
                <ProtectedRoute>
                  <MemberAppNotice />
                </ProtectedRoute>
              }
            />

            {/* ── Misc ── */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
