import { test, expect, state, sql, uiLogin, API } from './helpers';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;
const stamp = Date.now();

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const o = state.get('owner');
  await uiLogin(page, o.email, o.password);
  await expect(page).toHaveURL(/\/dashboard/);
});
test.afterAll(async () => page.close());

const problems: string[] = [];
test.beforeEach(() => {
  problems.length = 0;
  page.removeAllListeners('response');
  page.removeAllListeners('pageerror');
  page.on('response', r => {
    if (r.url().startsWith(API) && r.status() >= 500) {
      problems.push(`${r.status()} ${r.request().method()} ${r.url()}`);
    }
  });
  page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
});
test.afterEach(() => expect(problems, 'API 5xx / page errors').toEqual([]));

const orgId = () => state.get('owner').orgId;
const gymId = () => state.get('owner').gymId;

test('GMH-004: header search bar opens Command Palette and navigates to selected page', async () => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Search or type a command/i }).click();
  const input = page.getByPlaceholder('Type a command or search pages...');
  await expect(input).toBeVisible();
  await input.fill('Reports');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/reports/);
});

test('GMH-018: owner generates reports and exports CSV without gym association error', async () => {
  await page.goto('/reports');
  await page.getByRole('button', { name: /Generate Report/i }).first().click();
  await expect(page.locator('body')).not.toContainText(/A gym must be associated/i);
  await expect(page.getByRole('button', { name: /Refresh Report/i }).first()).toBeVisible({ timeout: 10_000 });

  const downloadPromise = page.waitForEvent('download');
  await page.getByTitle('Download CSV').first().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/revenue-report.*\.csv$/i);
});

test('GMH-019/020: Billing page opens Add Card and Upgrade Plan modals with real tier options', async () => {
  await page.goto('/billing');
  await expect(page.getByRole('heading', { name: 'Billing' })).toBeVisible();

  // GMH-019: Add Payment Method opens Add Card modal
  await page.getByRole('button', { name: /Add Payment Method/i }).click();
  await expect(page.getByRole('heading', { name: 'Add Card' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Add Card' })).toHaveCount(0);

  // GMH-020: Upgrade Plan opens modal with higher tiers
  await page.getByRole('button', { name: /Upgrade Plan/i }).click();
  await expect(page.getByRole('heading', { name: 'Upgrade Plan' })).toBeVisible();
  await expect(page.getByRole('radiogroup', { name: 'Plans' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
});

test('GMH-021: owner opens Add Gym modal on Gym Management page', async () => {
  await page.goto('/gym-management');
  const o = state.get('owner');
  await expect(page.getByText(o.gym).first()).toBeVisible();

  await page.getByRole('button', { name: /Add Gym/i }).click();
  await expect(page.getByRole('heading', { name: 'Add New Gym Location' })).toBeVisible();
  await expect(page.getByPlaceholder('+234 000 0000')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
});

test('GMH-022/023: Profile page displays owner onboarding info and saves profile edits', async () => {
  const o = state.get('owner');
  await page.goto('/profile');
  await expect(page.locator('body')).not.toContainText('Loading...');
  await expect(page.getByText(o.email).first()).toBeVisible();
  await expect(page.getByText(o.firstName).first()).toBeVisible();

  // GMH-023: Edit Personal Information and save
  await page.getByRole('button', { name: /Edit Profile/i }).click();
  await expect(page.getByText('Edit Personal Information')).toBeVisible();
  const firstInput = page.locator('input[name="firstName"]');
  await firstInput.fill('Adaeze');
  await page.getByRole('button', { name: 'Save Changes' }).click();

  await expect(page.getByText('Adaeze').first()).toBeVisible();
  expect(sql(`select first_name from users where email = '${o.email}'`)).toBe('Adaeze');

  // Restore original firstName so state remains consistent
  await page.getByRole('button', { name: /Edit Profile/i }).click();
  await page.locator('input[name="firstName"]').fill(o.firstName);
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText(o.firstName).first()).toBeVisible();
});

test('GMH-024/025: Settings page updates Gym Profile and persists Logo URL', async () => {
  await page.goto('/settings');
  const addressInput = page.getByLabel('Address');
  await expect(addressInput).toBeVisible();

  const newStreet = `${stamp} Admiralty Way, Lekki`;
  const newLogo = `https://cdn.gymmatehub.test/logo-${stamp}.png`;
  await addressInput.fill(newStreet);
  await page.getByLabel('Logo').fill(newLogo);
  await page.getByRole('button', { name: /Save Profile/i }).click();

  await expect.poll(() => sql(`select logo_url from gyms where id = '${gymId()}'`)).toBe(newLogo);
});

test('GMH-026: Settings page saves Business Hours per day', async () => {
  await page.goto('/settings');
  const tuesdayOpen = page.getByLabel('Tuesday opening time');
  await tuesdayOpen.fill('07:30');
  await page.getByRole('button', { name: /Save Hours/i }).click();

  await expect.poll(() => sql(`select business_hours from gyms where id = '${gymId()}'`)).toContain('07:30');
});

test('GMH-027: Settings page saves Notification Preferences in browser storage', async () => {
  await page.goto('/settings');
  const toggle = page.getByRole('switch', { name: /New member registrations/i });
  const before = await toggle.getAttribute('aria-checked');
  await toggle.click();
  await page.getByRole('button', { name: /Save Preferences/i }).click();

  await page.reload();
  await expect(page.getByRole('switch', { name: /New member registrations/i })).toHaveAttribute(
    'aria-checked',
    before === 'true' ? 'false' : 'true'
  );
});

test('GMH-028/029: Settings Security card shows 2FA Coming soon and changes password end-to-end', async () => {
  const o = state.get('owner');
  await page.goto('/settings');

  // GMH-029: 2FA clearly marked Coming soon and button disabled
  await expect(page.getByText('Coming soon')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enable 2FA' })).toBeDisabled();

  // GMH-028: Change Password validates minimum length then updates password
  await page.getByRole('button', { name: 'Change Password' }).click();
  await page.getByLabel('Current Password').fill(o.password);
  await page.getByLabel('New Password', { exact: true }).fill('short');
  await page.getByLabel('Confirm New Password').fill('short');
  await page.getByRole('button', { name: 'Update Password' }).click();
  await expect(page.getByRole('alert')).toContainText(/at least 12/i);

  const rotated = 'RotatedPass!2026xy';
  await page.getByLabel('New Password', { exact: true }).fill(rotated);
  await page.getByLabel('Confirm New Password').fill(rotated);
  await page.getByRole('button', { name: 'Update Password' }).click();
  await expect(page.getByLabel('Current Password')).toHaveCount(0);

  // Rotate back to original owner password so repeatable runs work cleanly
  await page.getByRole('button', { name: 'Change Password' }).click();
  await page.getByLabel('Current Password').fill(rotated);
  await page.getByLabel('New Password', { exact: true }).fill(o.password);
  await page.getByLabel('Confirm New Password').fill(o.password);
  await page.getByRole('button', { name: 'Update Password' }).click();
  await expect(page.getByLabel('Current Password')).toHaveCount(0);
});
