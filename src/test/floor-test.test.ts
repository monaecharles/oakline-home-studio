import { describe, expect, it } from "vitest";
import { FLOOR_TEST, floorTestReadiness } from "@/lib/matterport-floor-test";

const square = [{ x: 0, z: 0 }, { x: 3, z: 0 }, { x: 3, z: 3 }, { x: 0, z: 3 }];
const full = { enabled: true, sdkKey: "k", bundlePath: "/bundle", floorY: 0, outline: square, holes: [], sweeps: ["a", "b", "c"] };

describe("kitchen floor feasibility test gate", () => {
  it("ships disabled", () => {
    expect(floorTestReadiness(FLOOR_TEST).ready).toBe(false);
  });
  it("requires three distinct kitchen scan positions", () => {
    expect(floorTestReadiness({ ...full, sweeps: ["a", "b", "b"] }).ready).toBe(false);
    expect(floorTestReadiness(full).ready).toBe(true);
  });
  it("requires an SDK key and a measured outline", () => {
    expect(floorTestReadiness({ ...full, sdkKey: "" }).ready).toBe(false);
    expect(floorTestReadiness({ ...full, outline: square.slice(0, 2) }).ready).toBe(false);
  });
});
