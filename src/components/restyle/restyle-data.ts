// Shared data for the two real-photo restyle tools. Kept free of three.js so it is SSR-safe.
import pano from "@/assets/restyle/pano-room.jpg.asset.json";
import panoMask from "@/assets/restyle/pano-room-mask.png.asset.json";
import kOrig from "@/assets/restyle/kitchen-original.jpg.asset.json";
import kGreenWhite from "@/assets/restyle/kitchen-green-white.jpg.asset.json";
import kWalnutWhite from "@/assets/restyle/kitchen-walnut-white.jpg.asset.json";
import kWhiteDark from "@/assets/restyle/kitchen-white-dark.jpg.asset.json";
import kGreenDark from "@/assets/restyle/kitchen-green-dark.jpg.asset.json";
import kWalnutDark from "@/assets/restyle/kitchen-walnut-dark.jpg.asset.json";
import { MATERIAL_PHOTOS } from "@/lib/material-photos";
import planksLight from "@/assets/restyle/planks-light.jpg.asset.json";
import planksDark from "@/assets/restyle/planks-dark.jpg.asset.json";
import stoneTiles from "@/assets/restyle/stone-tiles.jpg.asset.json";

export const PANO = {
  url: pano.url,
  maskUrl: panoMask.url, // R = floor, G = walls, B = softened original brightness
  floorAvg: 0.44,
  wallAvg: 0.458,
  credit: "Small Empty House, 360° photograph by Greg Zaal, Poly Haven (CC0)",
  source: "https://polyhaven.com/a/small_empty_house",
};

export interface PanoFloor { id: string; name: string; tex: string | null; swatch: string | null; scale: number; designId?: string }
export interface PanoWall { id: string; name: string; color: string | null; designId?: string }

export const PANO_FLOORS: PanoFloor[] = [
  { id: "original", name: "Original tile", tex: null, swatch: null, scale: 1 },
  { id: "light", name: "Light wood", tex: planksLight.url, swatch: MATERIAL_PHOTOS.lightWood.url, scale: 0.9, designId: "oak" },
  { id: "dark", name: "Rich brown wood", tex: planksDark.url, swatch: MATERIAL_PHOTOS.darkWood.url, scale: 0.9, designId: "walnut" },
  { id: "stone", name: "Pale stone tile", tex: stoneTiles.url, swatch: MATERIAL_PHOTOS.tile.url, scale: 0.55, designId: "limestone" },
];

export const PANO_WALLS: PanoWall[] = [
  { id: "original", name: "Original paint", color: null },
  { id: "ivory", name: "Light painted plaster", color: "#EFE9DD", designId: "ivory" },
  { id: "greige", name: "Warm gray plaster", color: "#CFC6B8", designId: "greige" },
  { id: "sage", name: "Muted green paint", color: "#AEB7A0", designId: "sage" },
];

export type CabinetId = "white" | "green" | "walnut";
export type CounterId = "pale" | "dark";

export const KITCHEN_CABINETS: { id: CabinetId; name: string; designId?: string }[] = [
  { id: "white", name: "White paint (as photographed)" },
  { id: "green", name: "Muted green paint", designId: "forest" },
  { id: "walnut", name: "Rich brown wood", designId: "walnut" },
];
export const KITCHEN_COUNTERS: { id: CounterId; name: string; designId?: string }[] = [
  { id: "pale", name: "Pale stone (as photographed)", designId: "quartz" },
  { id: "dark", name: "Dark gray stone", designId: "charcoal" },
];

const KITCHEN: Record<`${CabinetId}-${CounterId}`, string> = {
  "white-pale": kOrig.url,
  "green-pale": kGreenWhite.url,
  "walnut-pale": kWalnutWhite.url,
  "white-dark": kWhiteDark.url,
  "green-dark": kGreenDark.url,
  "walnut-dark": kWalnutDark.url,
};
export const KITCHEN_ORIGINAL = kOrig.url;
export const kitchenImage = (cab: CabinetId, ctr: CounterId) => KITCHEN[`${cab}-${ctr}`];
export const KITCHEN_CREDIT = { label: "Kitchen photograph from Unsplash", source: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1" };

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
