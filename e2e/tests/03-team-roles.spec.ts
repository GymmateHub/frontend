import { test as base, expect, type Page } from '@playwright/test';
import { state, sql, api, apiLogin, waitForEmail, uiLogin, field, API } from './helpers';

const test = base;
test.describe.configure({ mode: 'default' });

const PASSWORD = 'TeamMember!2026x';
const stamp = Date.now();
const ROLES = ['MANAGER', 'STAFF', 'TRAINER'] as const;
type Role = (typeof ROLES)[number];

/**
 * Which gym screens each invited role opens. Mirrors SCREEN_PERMISSIONS in
 * src/auth/permissions.ts and the role table in the backend's RolePermissions.
 */
const SCREENS: Record<string, Role[]> = {
  '/dashboard': ['MANAGER', 'STAFF', 'TRAINER'],
  '/members': ['MANAGER', 'STAFF', 'TRAINER'],
  '/plans': ['MANAGER'],
  '/classes': ['MANAGER', 'STAFF', 'TRAINER'],
  '/calendar': ['MANAGER', 'STAFF', 'TRAINER'],
  '/challenges': ['MANAGER', 'TRAINER'],
  '/equipment': ['MANAGER', 'STAFF'],
  '/inventory': ['MANAGER', 'STAFF'],
  '/pos': ['MANAGER', 'STAFF'],
  '/leads': ['MANAGER', 'STAFF'],
  '/analytics': ['MANAGER'],
  '/reports': ['MANAGER'],
  '/billing': [],
  '/gym-management': ['MANAGER'],
  '/team': ['MANAGER'],
  '/admin-dashboard': [],
  '/tenant-management': [],
  '/settings': ['MANAGER'],
  '/notifications': ['MANAGER', 'STAFF', 'TRAINER'],
};

async function loginAs(page: Page, role: Role) {
  const u = state.get(role.toLowerCase());
  await uiLogin(page, u.email, u.password);
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe.serial('Team onboarding', () => {
  test('owner sees only Manager, Staff and Trainer as invitable roles', async ({ page }) => {
    const o = state.get('owner');
    await uiLogin(page, o.email, o.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/team');
    await page.getByRole('button', { name: /Invite Team Member/i }).click();
    const options = await field(page, 'Role').locator('option').allTextContents();
    expect(options).toEqual(['Manager', 'Staff', 'Trainer']);
  });

  for (const role of ROLES) {
    test(`owner invites a ${role} from the Team page; they join through the emailed link`, async ({ page, browser }) => {
      const o = state.get('owner');
      const email = `${role.toLowerCase()}.${stamp}@e2e.test`;
      await uiLogin(page, o.email, o.password);
      await expect(page).toHaveURL(/\/dashboard/);
      await page.goto('/team');
      await page.getByRole('button', { name: /Invite Team Member/i }).click();
      await page.getByPlaceholder('name@example.com').fill(email);
      await field(page, 'First Name').fill(role[0] + role.slice(1).toLowerCase());
      await field(page, 'Last Name').fill('Tester');
      await field(page, 'Role').selectOption(role);
      await page.getByRole('button', { name: 'Send Invite' }).click();
      await expect(page.getByText(email).first()).toBeVisible();

      const mail = await waitForEmail(email);
      const link = (mail.html.match(/href="([^"]*\/invite\?token=[^"]+)"/) ?? mail.text.match(/(https?:\/\/\S*\/invite\?token=\S+)/))?.[1];
      expect(link, 'invite link in email').toBeTruthy();

      const invitee = await (await browser.newContext()).newPage();
      await invitee.goto(new URL(link!.replace(/&amp;/g, '&')).pathname + new URL(link!.replace(/&amp;/g, '&')).search);
      await expect(invitee.getByText(email)).toBeVisible();
      await invitee.getByPlaceholder('At least 12 characters').fill(PASSWORD);
      await invitee.getByPlaceholder('Repeat your password').fill(PASSWORD);
      await invitee.getByRole('button', { name: 'Join Team' }).click();
      await expect(invitee).toHaveURL(/\/dashboard/, { timeout: 15_000 });

      expect(sql(`select role || ',' || organisation_id from users where email = '${email}'`)).toBe(`${role},${o.orgId}`);
      state.set(role.toLowerCase(), { email, password: PASSWORD });
    });
  }

  test('the API refuses to invite a member or an admin', async () => {
    const o = state.get('owner');
    const owner = await apiLogin(o.email, o.password);
    for (const role of ['MEMBER', 'ADMIN', 'GYM_OWNER']) {
      const r = await api('POST', `/gyms/${o.gymId}/invites`, { token: owner.accessToken, body: { email: `x.${role}.${stamp}@e2e.test`, role } });
      expect(r.status, `invite ${role}`).toBe(400);
    }
  });
});

for (const role of ROLES) {
  test.describe(role, () => {
    test(`${role}: screens match the permission matrix, and the API serves what they need`, async ({ page }) => {
      await loginAs(page, role);
      const forbidden: string[] = [];
      const serverErrors: string[] = [];
      page.on('response', r => {
        if (!r.url().startsWith(API)) return;
        if (r.status() === 403) forbidden.push(`${r.request().method()} ${r.url().replace(API, '').replace(/\?.*/, '')}`);
        if (r.status() >= 500) serverErrors.push(`${r.status()} ${r.request().method()} ${r.url().replace(API, '')}`);
      });
      for (const [path, allowed] of Object.entries(SCREENS)) {
        forbidden.length = 0;
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        if (allowed.includes(role)) {
          expect.soft(page.url(), `${role} should open ${path}`).toContain(path);
          expect.soft([...new Set(forbidden)], `${role} on ${path}: API refused requests the screen needs`).toEqual([]);
        } else {
          expect.soft(page.url(), `${role} must not stay on ${path}`).not.toContain(path);
        }
      }
      expect.soft(serverErrors, `${role}: API 5xx`).toEqual([]);
    });
  });
}

for (const role of ['MANAGER', 'STAFF'] as const) {
  test(`${role}: adds a member and a lead`, async ({ page }) => {
    await loginAs(page, role);
    await page.goto('/members');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Add Member/i }).first().click();
    const email = `m.by.${role.toLowerCase()}.${stamp}@e2e.test`;
    await page.getByPlaceholder('First name').fill('Bola');
    await page.getByPlaceholder('Last name').fill(role);
    await page.getByPlaceholder('member@email.com').fill(email);
    await page.getByRole('button', { name: 'Add Member', exact: true }).last().click();
    await expect(page.getByText(email).first()).toBeVisible();
    expect(sql(`select count(*) from members m join users u on u.id = m.user_id where u.email = '${email}'`)).toBe('1');

    await page.goto('/leads');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Add Lead/i }).first().click();
    await field(page, 'First Name').fill('Lead');
    await field(page, 'Last Name').fill(`${role}${stamp}`);
    await page.getByRole('button', { name: 'Add Lead', exact: true }).last().click();
    await expect(page.getByText(`${role}${stamp}`).first()).toBeVisible();
  });
}

test('MANAGER: creates a membership plan, sees the team but cannot invite', async ({ page }) => {
  await loginAs(page, 'MANAGER');
  await page.goto('/plans');
  await page.getByRole('button', { name: /Create Plan/i }).first().click();
  const name = `Manager plan ${stamp}`;
  await field(page, 'Plan Name').fill(name);
  await field(page, 'Price').fill('20000');
  await page.getByRole('button', { name: 'Create Plan', exact: true }).last().click();
  await expect(page.getByText(name).first()).toBeVisible();

  await page.goto('/team');
  await expect(page.getByText(state.get('owner').email)).toBeVisible();
  await expect(page.getByRole('button', { name: /Invite Team Member/i })).toHaveCount(0);

  const u = state.get('manager');
  const t = await apiLogin(u.email, u.password);
  const r = await api('POST', `/gyms/${state.get('owner').gymId}/invites`, { token: t.accessToken, body: { email: `nope.${stamp}@e2e.test`, role: 'STAFF' } });
  expect(r.status, 'manager invite').toBe(403);
});

test('TRAINER: views members without add or edit controls; API refuses member and lead writes', async ({ page }) => {
  await loginAs(page, 'TRAINER');
  await page.goto('/members');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('button', { name: /Add Member/i })).toHaveCount(0);

  const u = state.get('trainer');
  const t = await apiLogin(u.email, u.password);
  expect((await api('POST', '/leads', { token: t.accessToken, body: { firstName: 'X', lastName: 'Y' } })).status).toBe(403);
  expect((await api('POST', '/members', { token: t.accessToken, body: { email: `t.${stamp}@e2e.test`, firstName: 'X', lastName: 'Y' } })).status).toBe(403);
});

test('STAFF: sees the schedule but cannot create classes or open billing', async ({ page }) => {
  await loginAs(page, 'STAFF');
  await page.goto('/classes');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('button', { name: /Add Class/i })).toHaveCount(0);
  const u = state.get('staff');
  const t = await apiLogin(u.email, u.password);
  expect((await api('GET', '/subscriptions/current', { token: t.accessToken })).status).toBe(403);
});
