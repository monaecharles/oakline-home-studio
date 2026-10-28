import { describe, expect, it } from "vitest";
import { designStore } from "@/lib/design-store";
import { STORAGE_KEY, validateDesign } from "@/lib/rooms";
import { WALKTHROUGH } from "@/lib/walkthrough";

describe("separate material inspiration board", () => {
  it("persists a chosen material for its room", () => {
    designStore.setFinish("kitchen", "floor", "walnut");
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(validateDesign(JSON.parse(stored ?? "null")).kitchen.floor).toBe("walnut");
  });
  it("does not alter viewing state when saving materials", () => {
    designStore.set({ roof: true, cutaway: false, mode: "plan" });
    designStore.setFinish("kitchen", "cabinet", "forest");
    expect(designStore.get().mode).toBe("plan");
    expect(designStore.get().roof).toBe(true);
    expect(designStore.get().cutaway).toBe(false);
  });
  it("uses only the specified official video and original URL", () => {
    expect(WALKTHROUGH.embedUrl).toBe("https://www.youtube-nocookie.com/embed/HphRKCxIK_Q");
    expect(WALKTHROUGH.watchUrl).toBe("https://www.youtube.com/watch?v=HphRKCxIK_Q");
  });
});
