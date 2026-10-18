/**
 * Weekly opening hours, stored on the gym as a JSON string (`Gym.businessHours` jsonb column).
 */

export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Day = (typeof DAYS)[number];

export interface DayHours {
  open: string;
  close: string;
  active: boolean;
}

export type BusinessHours = Record<Day, DayHours>;

export const DAY_LABELS: Record<Day, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { open: "06:00", close: "22:00", active: true },
  tuesday: { open: "06:00", close: "22:00", active: true },
  wednesday: { open: "06:00", close: "22:00", active: true },
  thursday: { open: "06:00", close: "22:00", active: true },
  friday: { open: "06:00", close: "22:00", active: true },
  saturday: { open: "08:00", close: "20:00", active: true },
  sunday: { open: "09:00", close: "18:00", active: false },
};

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Parse the stored JSON, falling back to defaults per day for anything missing or malformed. */
export function parseBusinessHours(raw: string | null | undefined): BusinessHours {
  const result = {} as BusinessHours;
  let parsed: Record<string, Partial<DayHours>> = {};
  if (raw) {
    try {
      const value = JSON.parse(raw);
      if (value && typeof value === "object") parsed = value;
    } catch {
      // fall through to defaults
    }
  }
  for (const day of DAYS) {
    const fallback = DEFAULT_BUSINESS_HOURS[day];
    const stored = parsed[day] ?? {};
    result[day] = {
      open: typeof stored.open === "string" && TIME.test(stored.open) ? stored.open : fallback.open,
      close: typeof stored.close === "string" && TIME.test(stored.close) ? stored.close : fallback.close,
      active: typeof stored.active === "boolean" ? stored.active : fallback.active,
    };
  }
  return result;
}

export function serializeBusinessHours(hours: BusinessHours): string {
  return JSON.stringify(hours);
}

/** Returns a message for the first open day whose closing time is not after opening time. */
export function validateBusinessHours(hours: BusinessHours): string | null {
  for (const day of DAYS) {
    const { open, close, active } = hours[day];
    if (active && open >= close) {
      return `${DAY_LABELS[day]}: closing time must be after opening time.`;
    }
  }
  return null;
}
