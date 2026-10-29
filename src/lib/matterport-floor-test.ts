// One-room feasibility test: kitchen floor overlay inside the SAME Matterport model via the Bundle SDK.
// Disabled until every value below is supplied. Nothing here changes the public tour embed.

export const TOUR_MODEL_ID = "cLFn5pD1TtE";

/** Floor outline point in Matterport model space (metres): x/z on the floor plane. */
export interface Pt { x: number; z: number }

export interface FloorTestConfig {
  enabled: boolean;
  /** SDK key from Matterport Account Settings → Developer Tools, allow-listed for this site's domains. */
  sdkKey: string;
  /** Folder where the downloaded showcase-bundle is served, e.g. "/bundle". */
  bundlePath: string;
  /** Measured floor height (model-space y) of the kitchen floor. */
  floorY: number | null;
  /** Kitchen floor outline, counter-clockwise, measured from the scan. Must stop at cabinet toe-kicks and thresholds. */
  outline: Pt[];
  /** Furniture/island footprints cut out of the overlay. */
  holes: Pt[][];
  /** At least three kitchen scan positions (sweep IDs) used for the alignment check. */
  sweeps: string[];
}

export const FLOOR_TEST: FloorTestConfig = {
  enabled: false,
  sdkKey: "",
  bundlePath: "",
  floorY: null,
  outline: [],
  holes: [],
  sweeps: [],
};

export type Readiness = { ready: true } | { ready: false; missing: string[] };

const area = (p: Pt[]) => p.reduce((a, c, i) => { const n = p[(i + 1) % p.length]!; return a + c.x * n.z - n.x * c.z; }, 0) / 2;

export function floorTestReadiness(c: FloorTestConfig): Readiness {
  const missing: string[] = [];
  if (!c.enabled) missing.push("test switched off");
  if (!c.sdkKey.trim()) missing.push("SDK key");
  if (!c.bundlePath.trim()) missing.push("Bundle SDK files");
  if (c.floorY === null || !Number.isFinite(c.floorY)) missing.push("measured floor height");
  if (c.outline.length < 3 || Math.abs(area(c.outline)) < 0.5) missing.push("measured kitchen floor outline");
  if (c.holes.some((h) => h.length < 3)) missing.push("valid furniture cut-outs");
  if (new Set(c.sweeps).size < 3) missing.push("three kitchen scan positions");
  return missing.length ? { ready: false, missing } : { ready: true };
}

/** Lift above the scanned floor to avoid flicker, small enough to stay under furniture feet. */
export const FLOOR_LIFT_M = 0.004;
