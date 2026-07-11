/**
 * Role-based screen access — single source of truth.
 *
 * Used by:
 *  - ProtectedRoute (blocks direct URL access)
 *  - AppSidebar (hides menu entries the user can't open)
 *  - auth.store login / PublicRoute (role-based landing page)
 *
 * NOTE: this is UX-level gating only. Real enforcement lives in the
 * backend's @PreAuthorize rules — never rely on this file for security.
 */

export type AppRole =
  | "SUPER_ADMIN"
  | "OWNER"
  | "MANAGER"
  | "TRAINER"
  | "STAFF"
  | "MEMBER";

/** Gym-operations staff (everyone who runs a gym day to day) */
const GYM_STAFF: AppRole[] = ["OWNER", "MANAGER", "TRAINER", "STAFF"];

export const SCREEN_ACCESS: Record<string, AppRole[]> = {
  // Gym operations
  "/dashboard": GYM_STAFF,
  "/members": GYM_STAFF,
  "/plans": ["OWNER", "MANAGER"],
  "/classes": GYM_STAFF,
  "/calendar": GYM_STAFF,
  "/challenges": ["OWNER", "MANAGER", "TRAINER"],
  "/equipment": ["OWNER", "MANAGER", "STAFF"],
  "/inventory": ["OWNER", "MANAGER", "STAFF"],
  "/pos": ["OWNER", "MANAGER", "STAFF"],
  "/leads": ["OWNER", "MANAGER", "STAFF"],

  // Management & insights
  "/analytics": ["OWNER", "MANAGER"],
  "/reports": ["OWNER", "MANAGER"],
  "/billing": ["OWNER"],
  "/gym-management": ["OWNER", "MANAGER"],

  // Platform administration (GymMateHub itself)
  "/admin-dashboard": ["SUPER_ADMIN"],
  "/tenant-management": ["SUPER_ADMIN"],

  // Shared
  "/messages": ["SUPER_ADMIN", ...GYM_STAFF],
  "/notifications": ["SUPER_ADMIN", ...GYM_STAFF],
  "/profile": ["SUPER_ADMIN", ...GYM_STAFF],
  "/settings": ["SUPER_ADMIN", "OWNER", "MANAGER"],

  // Members are mobile-first; the web only shows them a notice page
  "/member-app": ["MEMBER"],
};

/**
 * Can `role` open `pathname`?
 * Longest-prefix match, so "/members/123" inherits the "/members" rule.
 * Unmapped paths are not role-restricted (auth is still required).
 */
export function canAccess(
  role: string | undefined,
  pathname: string
): boolean {
  if (!role) return false;
  const match = Object.keys(SCREEN_ACCESS)
    .filter((p) => pathname === p || pathname.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return true;
  return SCREEN_ACCESS[match].includes(role as AppRole);
}

/** Where each role lands after login (and when bounced off a forbidden page). */
export function homeFor(role?: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin-dashboard";
    case "MEMBER":
      return "/member-app";
    default:
      return "/dashboard";
  }
}
