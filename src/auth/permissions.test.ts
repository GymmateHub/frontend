import { describe, expect, it } from "vitest";
import { canAccess, homeFor, type AccessSubject } from "./permissions";

const owner: AccessSubject = {
  permissions: ["org:view", "org:manage", "org:billing", "staff:view", "staff:invite", "members:view", "members:manage",
    "plans:manage", "classes:manage", "bookings:manage", "leads:manage", "pos:operate", "inventory:manage",
    "analytics:view", "notifications:view"],
};
const staff: AccessSubject = {
  permissions: ["org:view", "members:view", "members:manage", "leads:manage", "pos:operate", "inventory:manage",
    "classes:view", "bookings:manage", "notifications:view"],
};
const trainer: AccessSubject = {
  permissions: ["org:view", "members:view", "classes:view", "classes:manage", "bookings:manage", "health:manage", "notifications:view"],
};
const member: AccessSubject = { permissions: ["self:service", "plans:view", "classes:view"] };
const superAdmin: AccessSubject = { permissions: [...owner.permissions!, "platform:admin"] };

describe("canAccess", () => {
  it("opens screens from permissions", () => {
    expect(canAccess(owner, "/billing")).toBe(true);
    expect(canAccess(owner, "/team")).toBe(true);
    expect(canAccess(staff, "/leads")).toBe(true);
    expect(canAccess(staff, "/billing")).toBe(false);
    expect(canAccess(staff, "/plans")).toBe(false);
    expect(canAccess(trainer, "/challenges")).toBe(true);
    expect(canAccess(trainer, "/leads")).toBe(false);
    expect(canAccess(member, "/members")).toBe(false);
    expect(canAccess(member, "/member-app")).toBe(true);
  });

  it("inherits rules for sub-paths", () => {
    expect(canAccess(staff, "/members/123")).toBe(true);
    expect(canAccess(trainer, "/inventory/abc")).toBe(false);
  });

  it("denies everything until permissions are loaded", () => {
    expect(canAccess({ role: "GYM_OWNER" }, "/dashboard")).toBe(false);
  });

  it("keeps a platform admin on platform screens until they act as an organisation", () => {
    expect(canAccess(superAdmin, "/tenant-management")).toBe(true);
    expect(canAccess(superAdmin, "/members")).toBe(false);
    const acting = { ...superAdmin, actingOrg: { id: "org-1", name: "Iron Peak" } };
    expect(canAccess(acting, "/members")).toBe(true);
  });
});

describe("homeFor", () => {
  it("lands each kind of user on their home screen", () => {
    expect(homeFor(owner)).toBe("/dashboard");
    expect(homeFor(member)).toBe("/member-app");
    expect(homeFor(superAdmin)).toBe("/admin-dashboard");
    expect(homeFor({ ...superAdmin, actingOrg: { id: "o", name: "O" } })).toBe("/dashboard");
  });
});
