import { afterEach, describe, expect, it } from "vitest";
import { loadChallenges, saveChallenges, validateChallengeDates, type Challenge } from "./challengesStore";

const sample: Challenge = {
  id: "ch-1",
  title: "Summer Shred",
  description: "",
  category: "Consistency",
  target: "20 Workouts",
  startDate: "2026-06-01",
  endDate: "2026-06-30",
  points: 100,
};

afterEach(() => localStorage.clear());

describe("challenges storage", () => {
  it("starts empty — no invented seed data", () => {
    expect(loadChallenges("g1")).toEqual([]);
  });

  it("saves and loads per gym", () => {
    expect(saveChallenges("g1", [sample])).toBe(true);
    expect(loadChallenges("g1")).toEqual([sample]);
    expect(loadChallenges("g2")).toEqual([]);
  });

  it("drops malformed entries and survives corrupt JSON", () => {
    localStorage.setItem("gymmate_challenges_g1", JSON.stringify([sample, { id: 1 }, null]));
    expect(loadChallenges("g1")).toEqual([sample]);
    localStorage.setItem("gymmate_challenges_g1", "{bad");
    expect(loadChallenges("g1")).toEqual([]);
    localStorage.setItem("gymmate_challenges_g1", JSON.stringify({ not: "an array" }));
    expect(loadChallenges("g1")).toEqual([]);
  });
});

describe("validateChallengeDates", () => {
  it("accepts same-day and forward ranges", () => {
    expect(validateChallengeDates("2026-06-01", "2026-06-01")).toBeNull();
    expect(validateChallengeDates("2026-06-01", "2026-06-30")).toBeNull();
  });
  it("rejects missing or reversed dates", () => {
    expect(validateChallengeDates("", "2026-06-30")).toMatch(/start and end/);
    expect(validateChallengeDates("2026-06-30", "2026-06-01")).toMatch(/before/);
  });
});
