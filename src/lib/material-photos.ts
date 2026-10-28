import lightWood from "@/assets/light-wood.jpg.asset.json";
import darkWood from "@/assets/dark-wood.jpg.asset.json";
import metal from "@/assets/brushed-metal.jpg.asset.json";
import type { Category } from "./rooms";

export const MATERIAL_PHOTOS = {
  lightWood: { url: lightWood.url, alt: "Close-up of light brown wood with visible grain", source: "https://unsplash.com/photos/UhSCrH3p4Go", license: "Unsplash License" },
  darkWood: { url: darkWood.url, alt: "Close-up of dark brown wood grain", source: "https://unsplash.com/photos/dtwk6OYNsL4", license: "Unsplash License" },
  metal: { url: metal.url, alt: "Brushed silver metal with fine horizontal lines", source: "https://unsplash.com/photos/u9enPDMCAVY", license: "Unsplash License" },
};

export function materialPhoto(category: Category, id: string) {
  if (category === "fixture") return MATERIAL_PHOTOS.metal;
  return id === "walnut" ? MATERIAL_PHOTOS.darkWood : MATERIAL_PHOTOS.lightWood;
}