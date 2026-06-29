import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./auth/auth.store";
import { ProtectedRoute, PublicRoute } from "./auth/require-auth";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Layouts
import AppLayout from "./layout/AppLayout";
import LandingLayout from "./layout/LandingLayout";

// Landing pages
import LandingHome from "./pages/landing/LandingHome";
import LandingServices from "./pages/landing/LandingServices";
import LandingAbout from "./pages/landing/LandingAbout";
import LandingPricing from "./pages/landing/LandingPricing";
import LandingContact from "./pages/landing/LandingContact";

// Auth pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import VerifyEmail from "./pages/AuthPages/VerifyEmail";

// App pages
import DashboardPage from "./pages/app/DashboardPage";
import MembersPage from "./pages/app/MembersPage";
import ClassesPage from "./pages/app/ClassesPage";
import EquipmentPage from "./pages/app/EquipmentPage";
import InventoryPage from "./pages/app/InventoryPage";
import AnalyticsPage from "./pages/app/AnalyticsPage";
import ReportsPage from "./pages/app/ReportsPage";
import BillingPage from "./pages/app/BillingPage";
import PointOfSalePage from "./pages/app/PointOfSalePage";
import LeadsPage from "./pages/app/LeadsPage";
import ChallengesPage from "./pages/app/ChallengesPage";
import MessagesPage from "./pages/app/MessagesPage";
import NotificationsPage from "./pages/app/NotificationsPage";
import SettingsPage from "./pages/app/SettingsPage";
import GymManagementPage from "./pages/app/GymManagementPage";
import TenantManagementPage from "./pages/app/TenantManagementPage";

// Other pages
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import Unauthorized from "./pages/OtherPage/Unauthorized";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Landing (public, own header/footer) ── */}
          <Route element={<LandingLayout />}>
            <Route index path="/" element={<LandingHome />} />
            <Route path="/services" element={<LandingServices />} />
            <Route path="/about" element={<LandingAbout />} />
            <Route path="/pricing" element={<LandingPricing />} />
            <Route path="/contact" element={<LandingContact />} />
          </Route>

          {/* ── Auth pages (public, sidebar-less) ── */}
          <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Legacy routes for backward compat */}
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

          {/* ── App (protected, sidebar layout) ── */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/classes" element={<ClassesPage />} />
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
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route
              path="/gym-management"
              element={
                <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                  <GymManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant-management"
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                  <TenantManagementPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ── Misc ── */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
