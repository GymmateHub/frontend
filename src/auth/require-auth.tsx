import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./auth.store";

const LoadingSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export const RequireAuth: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => (
  <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>
);

export const useRequireRole = (allowedRoles: string[]): boolean => {
  const { user } = useAuth();
  if (!user) return false;
  return allowedRoles.includes(user.role);
};
