import lightWood from "@/assets/light-wood.jpg.asset.json";
import darkWood from "@/assets/dark-wood.jpg.asset.json";
import metal from "@/assets/brushed-metal.jpg.asset.json";
import tile from "@/assets/marble_01.jpg.asset.json";
import paleStone from "@/assets/pale-stone-detail.jpg.asset.json";
import darkStone from "@/assets/dark-stone-detail.jpg.asset.json";
import green from "@/assets/green-paint-detail.jpg.asset.json";
import palePaint from "@/assets/painted_plaster_wall.jpg.asset.json";
import plaster from "@/assets/white_plaster_02.jpg.asset.json";
import type { Category } from "./rooms";

export const MATERIAL_PHOTOS = {
  lightWood: { url: lightWood.url, alt: "Close-up of light brown wood with visible grain", source: "https://unsplash.com/photos/UhSCrH3p4Go", license: "Unsplash License" },
  darkWood: { url: darkWood.url, alt: "Close-up of dark brown wood grain", source: "https://unsplash.com/photos/dtwk6OYNsL4", license: "Unsplash License" },
  metal: { url: metal.url, alt: "Brushed silver metal with fine horizontal lines", source: "https://unsplash.com/photos/u9enPDMCAVY", license: "Unsplash License" },
  tile: { url: tile.url, alt: "Pale stone tiles with mottling and visible grout joints", source: "https://polyhaven.com/a/marble_01", license: "CC0" },
  paleStone: { url: paleStone.url, alt: "Pale stone surface with natural variation", source: "https://polyhaven.com/a/marble_01", license: "CC0" },
  darkStone: { url: darkStone.url, alt: "Dark gray stone surface with visible mottling", source: "https://polyhaven.com/a/granite_tile", license: "CC0" },
  green: { url: green.url, alt: "Detail of a muted green painted wall", source: "https://unsplash.com/photos/photo-1616046229478-9901c5536a45", license: "Unsplash License" },
  palePaint: { url: palePaint.url, alt: "Light painted plaster with visible surface texture", source: "https://polyhaven.com/a/painted_plaster_wall", license: "CC0" },
  plaster: { url: plaster.url, alt: "Warm gray plaster surface with fine texture", source: "https://polyhaven.com/a/white_plaster_02", license: "CC0" },
};

export function materialPhoto(category: Category, id: string) {
  if (category === "fixture") return MATERIAL_PHOTOS.metal;
  if (category === "counter") return id === "charcoal" ? MATERIAL_PHOTOS.darkStone : MATERIAL_PHOTOS.paleStone;
  if (category === "floor" && id === "limestone") return MATERIAL_PHOTOS.tile;
  if (id === "forest" || id === "sage") return MATERIAL_PHOTOS.green;
  if (category === "wall") return id === "greige" ? MATERIAL_PHOTOS.plaster : MATERIAL_PHOTOS.palePaint;
  return id === "walnut" ? MATERIAL_PHOTOS.darkWood : MATERIAL_PHOTOS.lightWood;
}