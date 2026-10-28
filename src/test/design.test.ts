import { describe, expect, it } from "vitest";
import { DEFAULT_DESIGN, ROOMS, validateDesign } from "@/lib/rooms";
import { minConsultDate } from "@/lib/inquiry";

describe("saved design validation", () => {
  it("keeps valid choices for the right room", () => {
    const d = validateDesign({ version: 1, rooms: { kitchen: { cabinet: "forest" } } });
    expect(d.kitchen.cabinet).toBe("forest");
    expect(d.bedroom).toEqual(DEFAULT_DESIGN.bedroom);
  });
  it("drops unknown finishes, wrong categories and wrong versions", () => {
    expect(validateDesign({ version: 1, rooms: { kitchen: { cabinet: "chrome" } } }).kitchen.cabinet).toBe("oak");
    expect(validateDesign({ version: 1, rooms: { living: { cabinet: "walnut" } } }).living.cabinet).toBeUndefined();
    expect(validateDesign({ version: 2, rooms: { kitchen: { cabinet: "forest" } } }).kitchen.cabinet).toBe("oak");
  });
  it("uses the five required rooms with their plan coordinates", () => {
    const m = Object.fromEntries(ROOMS.map((r) => [r.id, [r.x, r.z]]));
    expect(m).toEqual({ living: [[-4, 0], [-3, 1]], kitchen: [[0, 4], [-3, 1]], bedroom: [[-4, 0], [1, 4]], bath: [[0, 2], [1, 4]], studio: [[2, 4], [1, 4]] });
  });
});

describe("consultation date", () => {
  it("earliest date is tomorrow", () => {
    expect(minConsultDate(new Date(2026, 9, 28, 15))).toBe("2026-10-29");
  });
});
