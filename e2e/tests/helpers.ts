import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, Page, test as base } from '@playwright/test';

export const API = process.env.E2E_API_URL ?? 'http://localhost:8080/api';
const MAILPIT = process.env.E2E_MAILPIT_URL ?? 'http://localhost:18025/api/v1';
const PG_CONTAINER = process.env.E2E_PG_CONTAINER ?? 'gm-e2e-postgres';
const STATE_FILE = join(__dirname, '..', 'state.json');

/** Values shared across spec files (accounts created by earlier scenarios). */
export const state = {
  load(): Record<string, any> {
    return existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : {};
  },
  set(key: string, value: unknown) {
    const s = state.load();
    s[key] = value;
    writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
  },
  get(key: string) {
    const v = state.load()[key];
    if (v === undefined) throw new Error(`state "${key}" missing: run the earlier scenario first`);
    return v;
  },
};

/** Run SQL against the isolated e2e database. */
export function sql(query: string): string {
  return execFileSync('docker', ['exec', PG_CONTAINER, 'psql', '-U', 'gymmate', '-d', 'gymmate', '-tAc', query])
    .toString().trim();
}

/** Wait for the newest email to `to` (optionally matching subject) and return its text. */
export async function waitForEmail(to: string, subject?: RegExp, timeoutMs = 20_000): Promise<{ subject: string; text: string; html: string }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await fetch(`${MAILPIT}/search?query=${encodeURIComponent(`to:"${to}"`)}`);
    const data: any = await res.json();
    const msg = (data.messages ?? []).find((m: any) => !subject || subject.test(m.Subject));
    if (msg) {
      const full: any = await (await fetch(`${MAILPIT}/message/${msg.ID}`)).json();
      return { subject: full.Subject, text: full.Text ?? '', html: full.HTML ?? '' };
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`no email to ${to}${subject ? ` matching ${subject}` : ''} within ${timeoutMs}ms`);
}

export async function clearMailbox() {
  await fetch(`${MAILPIT}/messages`, { method: 'DELETE' });
}

export function otpFrom(text: string): string {
  const m = text.match(/\b(\d{6})\b/);
  if (!m) throw new Error('no 6-digit code in email');
  return m[1];
}

/** Call the backend directly (for assertions and setup the UI cannot do). */
export async function api(method: string, path: string, opts: { token?: string; body?: unknown; gymId?: string } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      ...(opts.gymId ? { 'X-Gym-Id': opts.gymId } : {}),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* not JSON */ }
  return { status: res.status, json, text };
}

export async function apiLogin(email: string, password: string) {
  const r = await api('POST', '/auth/login', { body: { email, password } });
  expect(r.status, `login ${email}: ${r.text}`).toBe(200);
  return r.json.data as { accessToken: string; refreshToken: string; gymId: string | null; userId: string; organisationId: string; role: string };
}

export function decodeJwt(token: string): Record<string, any> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
}

/**
 * Every test fails if the browser saw an HTTP 5xx from the API or an uncaught page error.
 * Problems are attached to the report so each failure says which request broke.
 */
export const test = base.extend<{ guard: { serverErrors: string[]; pageErrors: string[]; allow5xx: (re: RegExp) => void } }>({
  guard: [async ({ page }, use, testInfo) => {
    const serverErrors: string[] = [];
    const pageErrors: string[] = [];
    const allowed: RegExp[] = [];
    page.on('response', r => {
      if (r.url().startsWith(API) && r.status() >= 500 && !allowed.some(a => a.test(r.url()))) {
        serverErrors.push(`${r.status()} ${r.request().method()} ${r.url().replace(API, '')}`);
      }
    });
    page.on('pageerror', e => pageErrors.push(e.message));
    await use({ serverErrors, pageErrors, allow5xx: re => allowed.push(re) });
    if (serverErrors.length || pageErrors.length) {
      await testInfo.attach('runtime-problems', { body: JSON.stringify({ serverErrors, pageErrors }, null, 2), contentType: 'application/json' });
    }
    expect(serverErrors, 'API 5xx responses seen by the browser').toEqual([]);
    expect(pageErrors, 'uncaught page errors').toEqual([]);
  }, { auto: true }],
});
export { expect };

/** Log in through the real sign-in form. */
export async function uiLogin(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('info@gmail.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

/** The input/select/textarea that follows a visible label (labels here are not linked with htmlFor). */
export function field(page: Page, label: string | RegExp) {
  const text = typeof label === 'string' ? label : label.source;
  return page.locator(`xpath=//label[contains(normalize-space(.), "${text}")]/following::*[self::input or self::select or self::textarea][1]`).first();
}

/** The open modal/dialog (topmost fixed overlay). */
export function modal(page: Page) {
  return page.locator('[role="dialog"], .fixed.inset-0').last();
}
