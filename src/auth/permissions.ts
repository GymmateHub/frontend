/**
 * Permission-based screen access — single source of truth on the frontend.
 *
 * The backend grants permissions per role (shared.security.RolePermissions) and sends them with
 * the login response and /api/users/me. Screens here only say which permission they need, so
 * the frontend can never drift from what the API actually allows.
 *
 * Used by:
 *  - ProtectedRoute (blocks direct URL access)
 *  - AppSidebar (hides menu entries the user can't open)
 *  - auth.store login / PublicRoute (landing page)
 *
 * NOTE: this is UX-level gating only. Real enforcement is the backend's
 * @PreAuthorize("hasAuthority(...)") rules.
 */
export type AppRole =
  | "SUPER_ADMIN"
  | "GYM_OWNER"
  | "MANAGER"
  | "TRAINER"
  | "STAFF"
  | "MEMBER";

/** Permission authorities issued by the backend (shared.security.Permission). */
export const PERMISSIONS = {
  PLATFORM_ADMIN: "platform:admin",
  ORG_VIEW: "org:view",
  ORG_MANAGE: "org:manage",
  ORG_BILLING: "org:billing",
  STAFF_VIEW: "staff:view",
  STAFF_INVITE: "staff:invite",
  STAFF_MANAGE: "staff:manage",
  MEMBERS_VIEW: "members:view",
  MEMBERS_MANAGE: "members:manage",
  PLANS_VIEW: "plans:view",
  PLANS_MANAGE: "plans:manage",
  LEADS_MANAGE: "leads:manage",
  POS_OPERATE: "pos:operate",
  POS_MANAGE: "pos:manage",
  INVENTORY_MANAGE: "inventory:manage",
  ACCESS_OPERATE: "access:operate",
  CLASSES_VIEW: "classes:view",
  CLASSES_MANAGE: "classes:manage",
  BOOKINGS_MANAGE: "bookings:manage",
  HEALTH_MANAGE: "health:manage",
  ANALYTICS_VIEW: "analytics:view",
  REFUNDS_MANAGE: "refunds:manage",
  NOTIFICATIONS_VIEW: "notifications:view",
  NOTIFICATIONS_MANAGE: "notifications:manage",
  SELF_SERVICE: "self:service",
} as const;

const P = PERMISSIONS;

/** The organisation a platform admin is currently acting inside (audited by the backend). */
export interface ActingOrg {
  id: string;
  name: string;
}

/** What access decisions need to know about the signed-in user. */
export interface AccessSubject {
  role?: string;
  permissions?: string[];
  actingOrg?: ActingOrg | null;
}

/** A screen opens when the user holds ANY of the listed permissions. */
export const SCREEN_PERMISSIONS: Record<string, string[]> = {
  // Gym operations
  "/dashboard": [P.ORG_VIEW],
  "/members": [P.MEMBERS_VIEW],
  "/plans": [P.PLANS_MANAGE],
  "/classes": [P.CLASSES_MANAGE, P.BOOKINGS_MANAGE],
  "/calendar": [P.CLASSES_MANAGE, P.BOOKINGS_MANAGE],
  "/challenges": [P.CLASSES_MANAGE],
  "/equipment": [P.INVENTORY_MANAGE],
  "/inventory": [P.INVENTORY_MANAGE],
  "/pos": [P.POS_OPERATE],
  "/leads": [P.LEADS_MANAGE],
  // Management & insights
  "/analytics": [P.ANALYTICS_VIEW],
  "/reports": [P.ANALYTICS_VIEW],
  "/billing": [P.ORG_BILLING],
  "/gym-management": [P.ORG_MANAGE],
  "/team": [P.STAFF_VIEW],
  // Platform administration (GymMateHub itself)
  "/admin-dashboard": [P.PLATFORM_ADMIN],
  "/tenant-management": [P.PLATFORM_ADMIN],
  // Shared
  "/messages": [P.NOTIFICATIONS_VIEW],
  "/notifications": [P.NOTIFICATIONS_VIEW],
  "/profile": [P.ORG_VIEW, P.PLATFORM_ADMIN],
  "/settings": [P.ORG_MANAGE, P.PLATFORM_ADMIN],
  // Members are mobile-first; the web only shows them a notice page
  "/member-app": [P.SELF_SERVICE],
};

/** Screens a platform admin uses without acting inside an organisation. */
const PLATFORM_SCREENS = new Set(["/admin-dashboard", "/tenant-management", "/profile", "/settings"]);

export function hasPermission(subject: AccessSubject | null | undefined, permission: string): boolean {
  return !!subject?.permissions?.includes(permission);
}

const isPlatformAdmin = (subject: AccessSubject | null | undefined) =>
  hasPermission(subject, P.PLATFORM_ADMIN);

/**
 * Can the user open `pathname`?
 * Longest-prefix match, so "/members/123" inherits the "/members" rule.
 * Unmapped paths are not restricted (auth is still required).
 * A platform admin sees gym screens only while acting inside an organisation.
 */
export function canAccess(subject: AccessSubject | null | undefined, pathname: string): boolean {
  if (!subject?.permissions) return false;
  const match = Object.keys(SCREEN_PERMISSIONS)
    .filter((p) => pathname === p || pathname.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return true;
  if (isPlatformAdmin(subject) && !subject.actingOrg && !PLATFORM_SCREENS.has(match)) return false;
  return SCREEN_PERMISSIONS[match].some((p) => hasPermission(subject, p));
}

/** Where the user lands after login (and when bounced off a screen they can't open). */
export function homeFor(subject: AccessSubject | null | undefined): string {
  if (isPlatformAdmin(subject)) return subject?.actingOrg ? "/dashboard" : "/admin-dashboard";
  if (hasPermission(subject, P.SELF_SERVICE)) return "/member-app";
  return "/dashboard";
}
