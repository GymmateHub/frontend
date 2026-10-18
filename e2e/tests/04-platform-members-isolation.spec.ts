import { test, expect, state, sql, api, apiLogin, waitForEmail, otpFrom, uiLogin } from './helpers';

test.describe.configure({ mode: 'default' });
const stamp = Date.now();

test('GMH-011: owner schedules a class session from the calendar', async ({ page }) => {
  const o = state.get('owner');
  const cls = state.get('class');
  await uiLogin(page, o.email, o.password);
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto('/calendar');
  await page.getByRole('button', { name: /Schedule Class/i }).first().click();
  const classSelect = page.locator('select').filter({ hasText: 'Select a class' });
  await expect(classSelect.locator('option', { hasText: cls.name })).toHaveCount(1);
  await classSelect.selectOption({ label: cls.name });
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  await page.locator('input[type="datetime-local"]').nth(0).fill(`${tomorrow}T09:00`);
  await page.locator('input[type="datetime-local"]').nth(1).fill(`${tomorrow}T10:00`);
  await page.getByRole('button', { name: 'Schedule', exact: true }).click();
  await expect.poll(() => sql(`select count(*) from class_schedules s join classes c on c.id = s.class_id where c.name = '${cls.name}'`)).toBe('1');
});

test('Super Admin: lands on the admin dashboard and sees the new organisation', async ({ page }) => {
  // The dev profile seeds this super admin (application-dev.yml), ignoring APP_ADMIN_*.
  await uiLogin(page, 'dev.admin@gymmatehub.com', 'DevAdmin#@1357');
  await expect(page).toHaveURL(/\/admin-dashboard/);
  await page.goto('/tenant-management');
  await expect(page.getByText(state.get('owner').org).first()).toBeVisible();
  await page.goto('/dashboard');
  await expect(page, 'super admin is kept out of gym screens').not.toHaveURL(/\/dashboard$/);
});

test('Super Admin: acts inside an organisation (audited), then exits', async ({ page }) => {
  const o = state.get('owner');
  await uiLogin(page, 'dev.admin@gymmatehub.com', 'DevAdmin#@1357');
  await expect(page).toHaveURL(/\/admin-dashboard/);
  await page.goto('/members');
  await expect(page, 'no gym screens before choosing an organisation').not.toHaveURL(/\/members/);

  await page.goto('/tenant-management');
  const row = page.locator('tr', { hasText: o.org });
  await row.getByRole('button').last().click();
  await page.getByRole('button', { name: 'Act as organisation' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(`Acting as ${o.org}`, { exact: false })).toBeVisible();

  await page.goto('/members');
  await expect(page.getByText(state.get('member').email).first()).toBeVisible();

  const log = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', '.stack', 'backend.log'), 'utf8');
  expect(log, 'override written to the security audit log').toContain('SUPER_ADMIN_ORG_OVERRIDE');
  expect(log).toContain(o.orgId);

  await page.getByRole('button', { name: 'Exit organisation' }).click();
  await expect(page).toHaveURL(/\/admin-dashboard/);
});

test('Member: resets password from the emailed link, logs in, sees the member-app notice', async ({ page }) => {
  const m = state.get('member');
  await page.goto('/forgot-password');
  await page.getByPlaceholder('Enter your email').fill(m.email);
  await page.getByRole('button', { name: /Send Reset Link/i }).click();
  const mail = await waitForEmail(m.email, /reset/i);
  const link = (mail.html.match(/href="([^"]*reset-password[^"]*)"/) || mail.text.match(/(https?:\/\/\S*reset-password\S*)/))?.[1];
  expect(link, 'reset link in email').toBeTruthy();
  const url = new URL(link!.replace(/&amp;/g, '&'));
  await page.goto(`/reset-password${url.search}`);
  const newPassword = 'MemberPass!2026xy';
  await page.getByPlaceholder('Enter new password').fill(newPassword);
  await page.getByPlaceholder('Confirm new password').fill(newPassword);
  await page.getByRole('button', { name: /Reset Password/i }).click();
  await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  state.set('member', { ...m, password: newPassword });

  await uiLogin(page, m.email, newPassword);
  await expect(page).toHaveURL(/\/member-app/);
});

test('Member: API self-service the mobile app depends on', async () => {
  const m = state.get('member');
  const t = await apiLogin(m.email, m.password);
  expect((await api('GET', '/users/me', { token: t.accessToken })).status, '/users/me').toBe(200);
  expect((await api('GET', '/members/refunds/my-requests', { token: t.accessToken })).status, 'refund requests').toBe(200);
  const missing: string[] = [];
  for (const p of ['/members/me', '/members/me/membership', '/members/me/schedule', '/members/me/bookings', '/members/me/qr-code', '/members/me/plans']) {
    const r = await api('GET', p, { token: t.accessToken });
    if (r.status !== 200) missing.push(`${p} -> ${r.status}`);
  }
  expect.soft(missing, 'mobile member endpoints that do not work').toEqual([]);
});

test.describe('Cross-tenant isolation', () => {
  test.describe.configure({ mode: 'serial' });

  test('a second organisation signs up', async ({ page }) => {
    const rival = { email: `rival.${stamp}@e2e.test`, password: 'RivalOwner!2026x', org: `Rival Gyms ${stamp}`, gym: `Rival Ikeja ${stamp}` };
    await page.goto('/register');
    await page.getByPlaceholder('Enter your first name').fill('Rita');
    await page.getByPlaceholder('Enter your last name').fill('Rival');
    await page.getByPlaceholder('Enter your email').fill(rival.email);
    await page.getByPlaceholder('e.g. +1234567890').fill('+2348030000002');
    await page.getByPlaceholder('e.g. Iron Peak Holdings').fill(rival.org);
    await page.getByPlaceholder('e.g. Iron Peak Fitness').fill(rival.gym);
    await page.getByPlaceholder('Enter your password').fill(rival.password);
    await page.locator('input[type="checkbox"]').first().check({ force: true });
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL(/\/verify-email/);
    await page.getByPlaceholder('Enter your OTP code').fill(otpFrom((await waitForEmail(rival.email)).text));
    await page.getByRole('button', { name: /verify/i }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
    state.set('rival', rival);
  });

  test("rival cannot read or write the first organisation's data", async () => {
    const o = state.get('owner');
    const r = state.get('rival');
    const rival = await apiLogin(r.email, r.password);
    const t = rival.accessToken;
    const issues: string[] = [];

    const members = await api('GET', '/members', { token: t });
    if (JSON.stringify(members.json).includes(state.get('member').email)) issues.push('GET /members lists the other org\'s member');

    const leadsByGym = await api('GET', `/leads/gym/${o.gymId}`, { token: t });
    if (leadsByGym.status === 200 && (leadsByGym.json?.data ?? []).length > 0) issues.push(`GET /leads/gym/{otherGym} returned ${leadsByGym.json.data.length} leads`);

    const membersByGym = await api('GET', `/members/gym/${o.gymId}`, { token: t });
    if (membersByGym.status === 200 && (membersByGym.json?.data ?? []).length > 0) issues.push(`GET /members/gym/{otherGym} returned ${membersByGym.json.data.length} members`);

    const leadInOtherGym = await api('POST', '/leads', { token: t, body: { gymId: o.gymId, firstName: 'Spy', lastName: 'Lead' } });
    if (leadInOtherGym.status < 400) issues.push(`POST /leads into the other org's gym -> ${leadInOtherGym.status}`);

    // A spoofed X-Gym-Id must not move the write into the other gym (the token's own gym wins).
    await api('POST', '/leads', { token: t, gymId: o.gymId, body: { firstName: 'Spy', lastName: 'Header' } });
    if (sql(`select count(*) from leads where first_name = 'Spy' and gym_id = '${o.gymId}'`) !== '0') issues.push('X-Gym-Id spoof wrote a lead into the other gym');

    const memberInOtherGym = await api('POST', '/members', { token: t, body: { gymId: o.gymId, email: `spy.${stamp}@e2e.test`, firstName: 'Spy', lastName: 'Member' } });
    if (memberInOtherGym.status < 400) issues.push(`POST /members into the other org's gym -> ${memberInOtherGym.status}`);

    const gym = await api('GET', `/gyms/${o.gymId}`, { token: t });
    if (gym.status === 200) issues.push('GET /gyms/{otherGym} returned the other org\'s gym');

    // Records of the first organisation, read by id.
    const org = o.orgId;
    const byId: Record<string, string> = {
      leads: sql(`select id from leads where organisation_id = '${org}' limit 1`),
      'membership-plans': sql(`select id from membership_plans where organisation_id = '${org}' limit 1`),
      classes: sql(`select id from classes where organisation_id = '${org}' limit 1`),
      'inventory/items': sql(`select id from inventory_items where organisation_id = '${org}' limit 1`),
      'inventory/equipment': sql(`select id from equipment where organisation_id = '${org}' limit 1`),
    };
    for (const [res, id] of Object.entries(byId)) {
      if (!id) continue;
      const got = await api('GET', `/${res}/${id}`, { token: t });
      if (got.status === 200) issues.push(`GET /${res}/{id} returned the other org's record`);
    }

    // Write by id: must not deactivate the other organisation's gym.
    await api('PATCH', `/gyms/${o.gymId}/deactivate`, { token: t });
    if (sql(`select is_active from gyms where id = '${o.gymId}'`) !== 't') issues.push('PATCH /gyms/{otherGym}/deactivate deactivated the other org\'s gym');

    expect(sql(`select count(*) from leads where first_name = 'Spy' and gym_id = '${o.gymId}'`), 'no spy leads in the first gym').toBe('0');
    expect(issues).toEqual([]);
  });
});

test('Logout returns to sign-in and protected pages require login again', async ({ page }) => {
  const o = state.get('owner');
  await uiLogin(page, o.email, o.password);
  await expect(page).toHaveURL(/\/dashboard/);
  await page.locator('header').getByRole('button').filter({ hasText: o.firstName }).first().click();
  await page.getByText('Sign out').click();
  await expect(page).toHaveURL(/\/(login|signin)?$/);
  await page.goto('/members');
  await expect(page).toHaveURL(/\/(login|signin)/);
});
