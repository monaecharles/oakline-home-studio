import * as THREE from "three";

// Procedural canvas textures so finishes carry grain/mottling, not only color.
const cache = new Map<string, THREE.CanvasTexture>();

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + amt)));
  return `#${c.getHexString()}`;
}

export type TexKind = "wood" | "stone" | "paint" | "fabric" | "metal" | "grass";

export function makeTexture(kind: TexKind, color: string, repeat: [number, number] = [1, 1]) {
  const key = `${kind}:${color}:${repeat.join("x")}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d")!;
  const r = rng(color.split("").reduce((a, ch) => a + ch.charCodeAt(0), 7));
  g.fillStyle = color;
  g.fillRect(0, 0, size, size);
  if (kind === "wood") {
    const plank = 32;
    for (let y = 0; y < size; y += plank) {
      g.fillStyle = shade(color, (r() - 0.5) * 0.06);
      g.fillRect(0, y, size, plank);
      for (let i = 0; i < 14; i++) {
        g.strokeStyle = shade(color, (r() - 0.6) * 0.12);
        g.globalAlpha = 0.5;
        g.lineWidth = r() * 1.6 + 0.4;
        g.beginPath();
        const yy = y + r() * plank;
        g.moveTo(0, yy);
        for (let x = 0; x <= size; x += 16) g.lineTo(x, yy + Math.sin(x * 0.03 + i) * 2 * r());
        g.stroke();
      }
      g.globalAlpha = 1;
      g.fillStyle = shade(color, -0.18);
      g.fillRect(0, y, size, 1);
      const seam = Math.floor(r() * size);
      g.fillRect(seam, y, 1, plank);
    }
  } else if (kind === "stone") {
    for (let i = 0; i < 2200; i++) {
      g.fillStyle = shade(color, (r() - 0.5) * 0.12);
      g.globalAlpha = 0.5;
      g.fillRect(r() * size, r() * size, 2, 2);
    }
    g.globalAlpha = 0.25;
    g.strokeStyle = shade(color, -0.15);
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(r() * size, 0);
      g.bezierCurveTo(r() * size, size * 0.3, r() * size, size * 0.7, r() * size, size);
      g.stroke();
    }
    g.globalAlpha = 1;
  } else if (kind === "fabric") {
    for (let y = 0; y < size; y += 2) {
      g.fillStyle = shade(color, (y % 4 ? 0.02 : -0.02));
      g.fillRect(0, y, size, 1);
    }
  } else if (kind === "grass") {
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = shade(color, (r() - 0.5) * 0.1);
      g.fillRect(r() * size, r() * size, 1, 3);
    }
  } else {
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = shade(color, (r() - 0.5) * (kind === "metal" ? 0.08 : 0.03));
      g.globalAlpha = 0.6;
      g.fillRect(r() * size, r() * size, kind === "metal" ? 6 : 2, 1);
    }
    g.globalAlpha = 1;
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

export function disposeTextures() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}
