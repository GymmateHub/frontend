/**
 * Challenges are not supported by the backend yet, so the ones an owner creates are kept in
 * the browser, per gym. The Challenges page tells the user this.
 */

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  target: string;
  startDate: string;
  endDate: string;
  points: number;
}

const key = (gymId: string) => `gymmate_challenges_${gymId || "unassigned"}`;

const isChallenge = (value: unknown): value is Challenge => {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.title === "string" &&
    typeof c.description === "string" &&
    typeof c.category === "string" &&
    typeof c.target === "string" &&
    typeof c.startDate === "string" &&
    typeof c.endDate === "string" &&
    typeof c.points === "number"
  );
};

export function loadChallenges(gymId: string): Challenge[] {
  try {
    const raw = localStorage.getItem(key(gymId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isChallenge) : [];
  } catch {
    return [];
  }
}

/** @returns false if the browser refused the write (private mode, quota). */
export function saveChallenges(gymId: string, challenges: Challenge[]): boolean {
  try {
    localStorage.setItem(key(gymId), JSON.stringify(challenges));
    return true;
  } catch {
    return false;
  }
}

/** Returns a message if the dates can't form a valid challenge window. */
export function validateChallengeDates(startDate: string, endDate: string): string | null {
  if (!startDate || !endDate) return "Choose a start and end date.";
  if (endDate < startDate) return "End date can't be before the start date.";
  return null;
}
