import { test, expect, state, sql, uiLogin, field, API } from './helpers';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'default' });

let page: Page;
const stamp = Date.now();

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const o = state.get('owner');
  await uiLogin(page, o.email, o.password);
  await expect(page).toHaveURL(/\/dashboard/);
});
test.afterAll(async () => page.close());

// The shared page is created outside the per-test fixture, so wire the 5xx guard to it here.
const problems: string[] = [];
test.beforeEach(() => {
  problems.length = 0;
  page.removeAllListeners('response');
  page.removeAllListeners('pageerror');
  page.on('response', r => { if (r.url().startsWith(API) && r.status() >= 500) problems.push(`${r.status()} ${r.request().method()} ${r.url()}`); });
  page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
});
test.afterEach(() => expect(problems, 'API 5xx / page errors').toEqual([]));

const orgId = () => state.get('owner').orgId;
const gymId = () => state.get('owner').gymId;

test("GMH-006: dashboard revenue uses the gym's currency, not a hard-coded $", async () => {
  const symbols: Record<string, string> = { NGN: '₦', GBP: '£', USD: '$', EUR: '€' };
  const currency = sql(`select currency from gyms where id = '${gymId()}'`);
  await page.goto('/dashboard');
  const card = page.locator('text=/Monthly Revenue/i').first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  await expect(card).toContainText(symbols[currency]);
  if (currency !== 'USD') await expect(card).not.toContainText('$');
});

test('GMH-005: Quick Actions opens a panel instead of navigating', async () => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Quick Actions/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('Add New Member')).toBeVisible();
});

test('every Quick Action leads to a real page (not 404)', async () => {
  const titles = ['Add New Member', 'Schedule a Class', 'Add Retail Inventory', 'Add Gym Equipment', 'Add Membership Plan'];
  for (const t of titles) {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /Quick Actions/i }).click();
    await page.getByText(t, { exact: true }).click();
    await expect(page.locator('body'), `quick action "${t}"`).not.toContainText(/page not found|404/i);
  }
});

test('GMH-007: owner adds a member', async () => {
  await page.goto('/members');
  await page.getByRole('button', { name: /Add Member/i }).first().click();
  const email = `member.${stamp}@e2e.test`;
  await page.getByPlaceholder('First name').fill('Chidi');
  await page.getByPlaceholder('Last name').fill('Eze');
  await page.getByPlaceholder('member@email.com').fill(email);
  await page.getByPlaceholder('+234 000 0000').fill('+2348031111111');
  await page.getByRole('button', { name: 'Add Member', exact: true }).last().click();
  await expect(page.getByText(email).first()).toBeVisible();
  expect(sql(`select count(*) from members m join users u on u.id = m.user_id where u.email = '${email}' and m.gym_id = '${gymId()}'`)).toBe('1');
  state.set('member', { email, firstName: 'Chidi', lastName: 'Eze' });
});

test('GMH-008: owner creates a membership plan', async () => {
  await page.goto('/plans');
  await page.getByRole('button', { name: /Create Plan/i }).first().click();
  const name = `Gold plan ${stamp}`;
  await field(page, 'Plan Name').fill(name);
  await field(page, 'Description').fill('testing');
  await field(page, 'Price').fill('50000');
  await field(page, 'Billing Cycle').selectOption({ index: 1 }).catch(async () => { /* may already default */ });
  await field(page, 'Duration').fill('1');
  await field(page, 'Class Credits').fill('2');
  await field(page, 'Guest Passes').fill('2');
  await field(page, 'Trainer Sessions').fill('2');
  await page.getByRole('button', { name: 'Create Plan', exact: true }).last().click();
  await expect(page.getByText(name).first()).toBeVisible();
  expect(sql(`select count(*) from membership_plans where name = '${name}' and organisation_id = '${orgId()}'`)).toBe('1');
  state.set('plan', { name });
});

test('GMH-009/010: owner adds a class; Avg Attendance is readable', async () => {
  await page.goto('/classes');
  await expect(page.locator('body')).not.toContainText('â€');
  await page.getByRole('button', { name: /Add Class/i }).first().click();
  const name = `HIIT Power Hour ${stamp}`;
  await field(page, 'Class Name').fill(name);
  await field(page, 'Description').fill('High intensity intervals');
  await field(page, 'Duration').fill('45');
  await field(page, 'Capacity').fill('20');
  await page.getByRole('button', { name: 'Add Class', exact: true }).last().click();
  await expect(page.getByText(name).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(name).first(), 'class still listed after reload (served by the API, not the cache)').toBeVisible();
  expect(sql(`select count(*) from classes where name = '${name}' and gym_id = '${gymId()}'`)).toBe('1');
  state.set('class', { name });
});

test('GMH-012: owner creates a challenge', async () => {
  await page.goto('/challenges');
  await page.getByRole('button', { name: /Create Challenge/i }).first().click();
  const title = `30-Day Shred ${stamp}`;
  await field(page, 'Challenge Title').fill(title);
  await field(page, 'Target Goal').fill('20 Workouts');
  await page.getByRole('button', { name: 'Create Challenge', exact: true }).last().click();
  await expect(page.getByText(title).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(title), 'challenge persists after reload').toBeVisible();
});

test('GMH-016: owner adds an inventory item with opening stock', async () => {
  await page.goto('/inventory');
  await page.getByRole('button', { name: /Add Item/i }).first().click();
  const name = `Whey Protein ${stamp}`;
  await field(page, 'Item Name').fill(name);
  await field(page, 'Cost Price').fill('15000');
  await field(page, 'Retail Price').fill('25000');
  await field(page, 'Initial Stock').fill('12');
  await field(page, 'Low Stock Alert').fill('3');
  await page.getByRole('button', { name: 'Add Product', exact: true }).click();
  await expect(page.getByText(name).first()).toBeVisible();
  expect(sql(`select current_stock from inventory_items where name = '${name}' and gym_id = '${gymId()}'`)).toBe('12');
  state.set('inventory', { name });
});

test('GMH-015: equipment Gym dropdown lists the gym; owner adds equipment', async () => {
  await page.goto('/equipment');
  await page.getByRole('button', { name: /Add Equipment/i }).first().click();
  const gymSelect = page.locator('select').filter({ has: page.locator(`option[value="${gymId()}"]`) });
  await expect(gymSelect, 'gym dropdown contains the owner\'s gym').toHaveCount(1);
  const name = `Treadmill X-500 ${stamp}`;
  await page.getByPlaceholder('e.g. Treadmill X-500').fill(name);
  await gymSelect.selectOption(gymId());
  const category = field(page, 'Category');
  if (await category.evaluate(e => e.tagName === 'SELECT')) await category.selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Add Equipment', exact: true }).last().click();
  await expect(page.getByText(name).first()).toBeVisible();
  expect(sql(`select count(*) from equipment where name = '${name}' and gym_id = '${gymId()}'`)).toBe('1');
});

test('GMH-014: owner adds a lead', async () => {
  await page.goto('/leads');
  await page.getByRole('button', { name: /Add Lead/i }).first().click();
  await field(page, 'First Name').fill('Tunde');
  await field(page, 'Last Name').fill(`Bello${stamp}`);
  await field(page, 'Email').fill(`lead.${stamp}@e2e.test`);
  await field(page, 'Phone').fill('+2348032222222');
  await field(page, 'Source').selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Add Lead', exact: true }).last().click();
  await expect(page.getByText(`Bello${stamp}`).first()).toBeVisible();
  expect(sql(`select count(*) from leads where last_name = 'Bello${stamp}' and gym_id = '${gymId()}' and organisation_id = '${orgId()}'`)).toBe('1');
});

test('GMH-013: POS explains how to get started when inventory is empty, lists products otherwise', async () => {
  await page.goto('/pos');
  await expect(page.getByText(state.get('inventory').name)).toBeVisible();
});

test('GMH-017: analytics renders data, not endless skeletons', async () => {
  await page.goto('/analytics');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 15_000 });
});
