// Shared room model: same IDs and coordinates drive the 3D scene and the SVG plan.
export type RoomId = "living" | "kitchen" | "bedroom" | "bath" | "studio";
export type Category = "floor" | "wall" | "cabinet" | "counter" | "fixture";

export interface Room {
  id: RoomId;
  name: string;
  x: [number, number];
  z: [number, number];
  categories: Category[];
  blurb: string;
  photo: string; // photo registry key
  camera: { position: [number, number, number]; target: [number, number, number] };
}

export const ROOMS: Room[] = [
  {
    id: "living",
    name: "Living Room",
    x: [-4, 0],
    z: [-3, 1],
    categories: ["floor", "wall", "fixture"],
    blurb:
      "The largest room in the plan, open to the kitchen and lit by a full-width window wall on the north side. A deep sofa faces the fireplace wall, and a sliding door opens to the covered patio.",
    photo: "oakline-01",
    camera: { position: [-0.6, 1.6, 0.6], target: [-3, 0.9, -2.2] },
  },
  {
    id: "kitchen",
    name: "Kitchen",
    x: [0, 4],
    z: [-3, 1],
    categories: ["floor", "wall", "cabinet", "counter", "fixture"],
    blurb:
      "An L-shaped cabinet run along the back and east walls with a freestanding island facing the living room. The island seats three and keeps the cook in the conversation.",
    photo: "oakline-06",
    camera: { position: [0.4, 1.7, 0.7], target: [3, 0.8, -2.2] },
  },
  {
    id: "bedroom",
    name: "Primary Bedroom",
    x: [-4, 0],
    z: [1, 4],
    categories: ["floor", "wall", "fixture"],
    blurb:
      "A quiet corner of the house reached through the living room. The bed wall is solid for acoustic privacy, and a window on the west side brings in late-afternoon light.",
    photo: "oakline-12",
    camera: { position: [-0.5, 1.6, 1.4], target: [-3, 0.6, 3.2] },
  },
  {
    id: "bath",
    name: "Bathroom",
    x: [0, 2],
    z: [1, 4],
    categories: ["floor", "wall", "cabinet", "counter", "fixture"],
    blurb:
      "A compact bath with a floating vanity, walk-in shower and a high window for privacy. It is entered from the hall side so guests can use it without passing through the bedroom.",
    photo: "oakline-11",
    camera: { position: [1, 1.7, 1.3], target: [1, 0.7, 3.5] },
  },
  {
    id: "studio",
    name: "Studio",
    x: [2, 4],
    z: [1, 4],
    categories: ["floor", "wall", "cabinet", "fixture"],
    blurb:
      "A flexible room for work, reading or a guest daybed. Built-in shelving runs the length of one wall and the desk sits under a south window.",
    photo: "oakline-08",
    camera: { position: [3, 1.7, 1.3], target: [3, 0.7, 3.5] },
  },
];

export const roomById = (id: string | null | undefined) => ROOMS.find((r) => r.id === id);

export interface FinishOption {
  id: string;
  name: string;
  color: string;
  note: string;
}

export const FINISHES: Record<Category, { label: string; options: FinishOption[] }> = {
  floor: {
    label: "Flooring",
    options: [
      { id: "oak", name: "Warm oak", color: "#C49A6C", note: "Light, honey-toned plank with visible straight grain." },
      { id: "walnut", name: "Deep walnut", color: "#6B4A33", note: "Dark chocolate plank with wavy grain and more contrast." },
      { id: "limestone", name: "Limestone", color: "#D9D2C3", note: "Pale honed stone tile with soft mottling." },
    ],
  },
  wall: {
    label: "Wall color",
    options: [
      { id: "ivory", name: "Ivory", color: "#EFE9DD", note: "Warm white that stays soft in morning light." },
      { id: "greige", name: "Greige", color: "#CFC6B8", note: "Gray-beige that hides scuffs and reads calm at night." },
      { id: "sage", name: "Sage", color: "#AEB7A0", note: "Muted green that pairs with oak and brass." },
    ],
  },
  cabinet: {
    label: "Cabinetry",
    options: [
      { id: "oak", name: "Oak", color: "#B98B5E", note: "Rift-cut look with even, linear grain." },
      { id: "walnut", name: "Walnut", color: "#5E4130", note: "Rich dark wood with figure in the grain." },
      { id: "forest", name: "Forest painted", color: "#2F4A3C", note: "Deep green painted finish, satin sheen." },
    ],
  },
  counter: {
    label: "Counters",
    options: [
      { id: "quartz", name: "Ivory quartz", color: "#EEEAE2", note: "Bright, even surface with faint veining." },
      { id: "charcoal", name: "Charcoal stone", color: "#3A3A38", note: "Dark honed stone with a matte, velvety feel." },
    ],
  },
  fixture: {
    label: "Fixtures",
    options: [
      { id: "brass", name: "Brushed brass", color: "#AD9270", note: "Warm metal that softens with use." },
      { id: "black", name: "Matte black", color: "#1F1F1D", note: "Crisp graphic accent, shows water spots less." },
    ],
  },
};

export type RoomFinishes = Partial<Record<Category, string>>;
export type DesignState = Record<RoomId, RoomFinishes>;

export const DEFAULT_DESIGN: DesignState = {
  living: { floor: "oak", wall: "ivory", fixture: "brass" },
  kitchen: { floor: "oak", wall: "ivory", cabinet: "oak", counter: "quartz", fixture: "brass" },
  bedroom: { floor: "oak", wall: "greige", fixture: "black" },
  bath: { floor: "limestone", wall: "ivory", cabinet: "walnut", counter: "quartz", fixture: "brass" },
  studio: { floor: "oak", wall: "sage", cabinet: "oak", fixture: "black" },
};

export const STORAGE_KEY = "oakline:design:v1";
export const DESIGN_VERSION = 1;

export function finishColor(cat: Category, id: string | undefined) {
  const opts = FINISHES[cat].options;
  return (opts.find((o) => o.id === id) ?? opts[0]).color;
}
export function finishName(cat: Category, id: string | undefined) {
  const opts = FINISHES[cat].options;
  return (opts.find((o) => o.id === id) ?? opts[0]).name;
}

/** Validate untrusted stored data; returns a clean DesignState. */
export function validateDesign(raw: unknown): DesignState {
  const out: DesignState = JSON.parse(JSON.stringify(DEFAULT_DESIGN));
  if (!raw || typeof raw !== "object") return out;
  const r = raw as { version?: unknown; rooms?: unknown };
  if (r.version !== DESIGN_VERSION || !r.rooms || typeof r.rooms !== "object") return out;
  for (const room of ROOMS) {
    const saved = (r.rooms as Record<string, unknown>)[room.id];
    if (!saved || typeof saved !== "object") continue;
    for (const cat of room.categories) {
      const v = (saved as Record<string, unknown>)[cat];
      if (typeof v === "string" && FINISHES[cat].options.some((o) => o.id === v)) out[room.id][cat] = v;
    }
  }
  return out;
}

export function designSummary(d: DesignState) {
  return ROOMS.map(
    (r) => `${r.name}: ` + r.categories.map((c) => `${FINISHES[c].label.toLowerCase()} ${finishName(c, d[r.id][c])}`).join(", "),
  ).join("\n");
}

export function finishSchedule(d: DesignState) {
  return {
    studio: "Oakline Custom Homes",
    version: DESIGN_VERSION,
    createdAt: new Date().toISOString(),
    note: "Finishes are visual approximations. Colors vary by display and lighting.",
    rooms: ROOMS.map((r) => ({
      id: r.id,
      name: r.name,
      finishes: Object.fromEntries(r.categories.map((c) => [FINISHES[c].label, finishName(c, d[r.id][c])])),
    })),
  };
}
