import { useSyncExternalStore } from "react";
import { DEFAULT_DESIGN, DESIGN_VERSION, STORAGE_KEY, validateDesign, type Category, type DesignState, type RoomId } from "./rooms";

export interface ViewerState {
  design: DesignState;
  selected: RoomId | null;
  roof: boolean;
  cutaway: boolean;
  evening: boolean;
  mode: "3d" | "plan";
  storageOk: boolean;
  hydrated: boolean;
}

const clone = (d: DesignState): DesignState => JSON.parse(JSON.stringify(d));
let state: ViewerState = {
  design: clone(DEFAULT_DESIGN),
  selected: null,
  roof: true,
  cutaway: false,
  evening: false,
  mode: "3d",
  storageOk: true,
  hydrated: false,
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: DESIGN_VERSION, rooms: state.design }));
  } catch {
    if (state.storageOk) state = { ...state, storageOk: false };
  }
}

export const designStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  hydrate() {
    if (state.hydrated) return;
    let design = clone(DEFAULT_DESIGN);
    let storageOk = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          design = validateDesign(JSON.parse(raw));
        } catch {
          design = clone(DEFAULT_DESIGN);
        }
      }
    } catch {
      storageOk = false;
    }
    state = { ...state, design, storageOk, hydrated: true };
    emit();
  },
  select(id: RoomId | null) {
    state = { ...state, selected: id };
    emit();
  },
  setFinish(room: RoomId, cat: Category, value: string) {
    state = { ...state, design: { ...state.design, [room]: { ...state.design[room], [cat]: value } } };
    persist();
    emit();
  },
  set(p: Partial<Pick<ViewerState, "roof" | "cutaway" | "evening" | "mode">>) {
    state = { ...state, ...p };
    emit();
  },
  resetRoom(room: RoomId) {
    state = { ...state, design: { ...state.design, [room]: { ...DEFAULT_DESIGN[room] } } };
    persist();
    emit();
  },
  resetHome() {
    state = { ...state, design: clone(DEFAULT_DESIGN) };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    emit();
  },
};

export function useDesign() {
  return useSyncExternalStore(designStore.subscribe, designStore.get, designStore.get);
}

export const INQUIRY_PREFILL_KEY = "oakline:inquiry-prefill:v1";
