import { test, expect, state, sql, waitForEmail, otpFrom, clearMailbox, apiLogin, decodeJwt, API } from './helpers';

test.describe.configure({ mode: 'serial' });

const stamp = Date.now();
const owner = {
  firstName: 'Ada', lastName: 'Okafor',
  email: `owner.${stamp}@e2e.test`, phone: '+2348030000001',
  org: `Iron Peak Holdings ${stamp}`, gym: `Iron Peak Lekki ${stamp}`,
  password: 'StrongPass!2026xy',
};

async function fillSignUp(page, password: string) {
  await page.goto('/register');
  await page.getByPlaceholder('Enter your first name').fill(owner.firstName);
  await page.getByPlaceholder('Enter your last name').fill(owner.lastName);
  await page.getByPlaceholder('Enter your email').fill(owner.email);
  await page.getByPlaceholder('e.g. +1234567890').fill(owner.phone);
  await page.getByPlaceholder('e.g. Iron Peak Holdings').fill(owner.org);
  await page.getByPlaceholder('e.g. Iron Peak Fitness').fill(owner.gym);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.locator('input[type="checkbox"]').first().check({ force: true });
}

test('GMH-002: short password is rejected inline before any request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', r => { if (r.url().includes('/api/auth/register')) requests.push(r.url()); });
  await fillSignUp(page, 'short1!');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByText(/at least 12 characters/i)).toBeVisible();
  expect(requests, 'no register request for an invalid password').toEqual([]);
});

test('GMH-001/003: owner signs up with the visible fields only, verifies OTP, lands on dashboard', async ({ page }) => {
  await clearMailbox();
  await fillSignUp(page, owner.password);
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL(/\/verify-email/);

  const mail = await waitForEmail(owner.email);
  const otp = otpFrom(mail.text || mail.html);
  await page.getByPlaceholder('Enter your OTP code').fill(otp);
  await page.getByRole('button', { name: /verify/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });

  // Backend state: organisation, gym, owner, starter subscription all provisioned.
  const orgId = sql(`select id from organisations where name = '${owner.org}'`);
  expect(orgId).not.toBe('');
  expect(sql(`select count(*) from gyms where organisation_id = '${orgId}' and name = '${owner.gym}'`)).toBe('1');
  expect(sql(`select role || ',' || status || ',' || email_verified from users where email = '${owner.email}'`)).toBe('GYM_OWNER,ACTIVE,true');
  expect(sql(`select count(*) from subscriptions where organisation_id = '${orgId}'`)).toBe('1');
  const gymId = sql(`select id from gyms where organisation_id = '${orgId}'`);

  state.set('owner', { ...owner, orgId, gymId });
});

test('login token carries the gym; refresh keeps it (GMH-007/014 root cause)', async () => {
  const o = state.get('owner');
  const login = await apiLogin(o.email, o.password);
  expect(decodeJwt(login.accessToken).gymId).toBe(o.gymId);

  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: login.refreshToken }),
  });
  expect(res.status).toBe(200);
  const refreshed = (await res.json()).data;
  expect(decodeJwt(refreshed.accessToken).gymId, 'gym survives refresh').toBe(o.gymId);
});

test('wrong password shows an error and stays on login', async ({ page }) => {
  const o = state.get('owner');
  await page.goto('/login');
  await page.getByPlaceholder('info@gmail.com').fill(o.email);
  await page.getByPlaceholder('Enter your password').fill('WrongPassword!123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('text=/invalid|incorrect|wrong/i').first()).toBeVisible();
});
