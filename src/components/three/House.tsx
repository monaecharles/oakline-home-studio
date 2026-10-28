import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { FINISHES, ROOMS, finishColor, type Category, type DesignState, type RoomId } from "@/lib/rooms";
import { makeTexture, type TexKind } from "./textures";

export const WALL_H = 2.6;
const T = 0.16;

type Mats = Record<RoomId, Record<Category, THREE.MeshStandardMaterial>>;

const TEX_FOR: Record<Category, (id: string) => TexKind> = {
  floor: (id) => (id === "limestone" ? "stone" : "wood"),
  wall: () => "paint",
  cabinet: (id) => (id === "forest" ? "paint" : "wood"),
  counter: () => "stone",
  fixture: () => "metal",
};

export function useRoomMaterials(design: DesignState) {
  const mats = useMemo(() => {
    const m = {} as Mats;
    for (const r of ROOMS) {
      m[r.id] = {} as Mats[RoomId];
      (Object.keys(FINISHES) as Category[]).forEach((c) => {
        m[r.id][c] = new THREE.MeshStandardMaterial({ name: `${r.id}:${c}`, roughness: 0.8 });
      });
    }
    return m;
  }, []);
  useEffect(() => {
    for (const r of ROOMS) {
      (Object.keys(FINISHES) as Category[]).forEach((c) => {
        const id = design[r.id][c] ?? FINISHES[c].options[0]!.id;
        const mat = mats[r.id][c];
        const rep: [number, number] = c === "floor" ? [2, 2] : [1, 1];
        mat.map = makeTexture(TEX_FOR[c](id), finishColor(c, id), rep);
        mat.userData["finish"] = id;
        mat.metalness = c === "fixture" ? (id === "brass" ? 0.85 : 0.2) : 0;
        mat.roughness = c === "fixture" ? (id === "brass" ? 0.35 : 0.55) : c === "counter" ? 0.35 : c === "floor" ? 0.6 : 0.85;
        mat.needsUpdate = true;
      });
    }
  }, [design, mats]);
  useEffect(() => () => ROOMS.forEach((r) => Object.values(mats[r.id]).forEach((m) => m.dispose())), [mats]);
  return mats;
}

function useStatic() {
  return useMemo(() => {
    const std = (color: string, kind?: TexKind, rough = 0.8, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color: kind ? "#ffffff" : color, map: kind ? makeTexture(kind, color) : null, roughness: rough, ...extra });
    return {
      core: std("#E7E1D6", undefined, 0.9),
      exterior: std("#D8D1C4", "stone", 0.9),
      trim: std("#252522", undefined, 0.5),
      glass: new THREE.MeshPhysicalMaterial({ color: "#cfe0e6", transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0, depthWrite: false }),
      roof: std("#3b3a36", undefined, 0.85),
      fascia: std("#76543B", "wood", 0.7),
      forest: std("#2F4A3C", "fabric", 0.95),
      linen: std("#E9E3D6", "fabric", 0.95),
      rug: std("#C9BBA3", "fabric", 1),
      wood: std("#8A6446", "wood", 0.7),
      darkwood: std("#4E3726", "wood", 0.7),
      deck: std("#9C7A58", "wood", 0.8),
      grass: std("#7E8C63", "grass", 1),
      ceramic: std("#F4F1EA", undefined, 0.2),
      leaf: std("#55704F", undefined, 0.9),
      bark: std("#5B4636", undefined, 1),
      lamp: std("#FFF1D6", undefined, 0.6, { emissive: new THREE.Color("#FFD9A0"), emissiveIntensity: 0 }),
      mirror: std("#C9D3D6", undefined, 0.05, { metalness: 0.9 }),
    };
  }, []);
}
type Static = ReturnType<typeof useStatic>;

function B({ p, s, m, r }: { p: [number, number, number]; s: [number, number, number]; m: THREE.Material; r?: number }) {
  return (
    <mesh position={p} rotation-y={r ?? 0} castShadow receiveShadow material={m}>
      <boxGeometry args={s} />
    </mesh>
  );
}

// ---------- Walls with openings ----------
interface Opening { s: number; e: number; bottom: number; top: number; glass?: boolean }
interface WallDef { id: string; a: [number, number]; b: [number, number]; sides: [RoomId | null, RoomId | null]; openings?: Opening[] }

// sides[0] = room on the negative side (-z for x-walls, -x for z-walls), sides[1] = positive side.
const WALLS: WallDef[] = [
  { id: "north", a: [-4, -3], b: [4, -3], sides: [null, "living"], openings: [{ s: 0.5, e: 3.5, bottom: 0.45, top: 2.25, glass: true }, { s: 5, e: 6.6, bottom: 1.1, top: 2.1, glass: true }] },
  { id: "south", a: [-4, 4], b: [4, 4], sides: ["bedroom", null], openings: [{ s: 0.8, e: 2.4, bottom: 0.8, top: 2.1, glass: true }, { s: 4.6, e: 5.4, bottom: 1.6, top: 2.2, glass: true }, { s: 6.5, e: 7.5, bottom: 0.8, top: 2.1, glass: true }] },
  { id: "west", a: [-4, -3], b: [-4, 4], sides: [null, "living"], openings: [{ s: 0.6, e: 2.4, bottom: 0, top: 2.2, glass: true }, { s: 5, e: 6.4, bottom: 0.8, top: 2.1, glass: true }] },
  { id: "east", a: [4, -3], b: [4, 4], sides: ["kitchen", null], openings: [{ s: 3.05, e: 3.95, bottom: 0, top: 2.1 }, { s: 5.2, e: 6.4, bottom: 0.8, top: 2.1, glass: true }] },
  { id: "mid-west", a: [-4, 1], b: [0, 1], sides: ["living", "bedroom"], openings: [{ s: 2.8, e: 3.7, bottom: 0, top: 2.1 }] },
  { id: "mid-east", a: [0, 1], b: [4, 1], sides: ["kitchen", "bath"], openings: [{ s: 0.25, e: 1.05, bottom: 0, top: 2.1 }, { s: 2.6, e: 3.4, bottom: 0, top: 2.1 }] },
  { id: "bed-bath", a: [0, 1], b: [0, 4], sides: ["bedroom", "bath"] },
  { id: "bath-studio", a: [2, 1], b: [2, 4], sides: ["bath", "studio"] },
];
// Some exterior walls span two rooms; pick paint room by position along the wall.
function paintRoomAt(w: WallDef, side: 0 | 1, u: number): RoomId | null {
  const base = w.sides[side];
  if (!base) return null;
  const alongX = w.a[1] === w.b[1];
  const x = alongX ? w.a[0] + u : w.a[0];
  const z = alongX ? w.a[1] : w.a[1] + u;
  if (w.id === "mid-east" && side === 1) return x > 2 ? "studio" : "bath";
  if (w.id === "north" || w.id === "west" || w.id === "south" || w.id === "east") {
    const hit = ROOMS.find((r) => x >= r.x[0] - 0.01 && x <= r.x[1] + 0.01 && z >= r.z[0] - 0.01 && z <= r.z[1] + 0.01 && (u === 0 || true));
    // choose by midpoint inside house
    const ix = alongX ? x : x + (side === 1 ? 0.2 : -0.2);
    const iz = alongX ? z + (side === 1 ? 0.2 : -0.2) : z;
    const inside = ROOMS.find((r) => ix > r.x[0] && ix < r.x[1] && iz > r.z[0] && iz < r.z[1]);
    return inside?.id ?? hit?.id ?? base;
  }
  return base;
}

function pieces(len: number, ops: Opening[] = []) {
  const out: { u0: number; u1: number; y0: number; y1: number }[] = [];
  const sorted = [...ops].sort((a, b) => a.s - b.s);
  let cur = 0;
  for (const o of sorted) {
    if (o.s > cur) out.push({ u0: cur, u1: o.s, y0: 0, y1: WALL_H });
    if (o.bottom > 0) out.push({ u0: o.s, u1: o.e, y0: 0, y1: o.bottom });
    if (o.top < WALL_H) out.push({ u0: o.s, u1: o.e, y0: o.top, y1: WALL_H });
    cur = o.e;
  }
  if (cur < len) out.push({ u0: cur, u1: len, y0: 0, y1: WALL_H });
  return out;
}

function Wall({ w, mats, st, hidden, low }: { w: WallDef; mats: Mats; st: Static; hidden: boolean; low: boolean }) {
  const alongX = w.a[1] === w.b[1];
  const len = alongX ? w.b[0] - w.a[0] : w.b[1] - w.a[1];
  const ps = useMemo(() => pieces(len, w.openings), [len, w.openings]);
  if (hidden) return null;
  const toWorld = (u: number): [number, number] => (alongX ? [w.a[0] + u, w.a[1]] : [w.a[0], w.a[1] + u]);
  return (
    <group scale={[1, low ? 0.42 : 1, 1]} name={`wall-${w.id}`}>
      {ps.map((p, i) => {
        const [cx, cz] = toWorld((p.u0 + p.u1) / 2);
        const L = p.u1 - p.u0;
        const H = p.y1 - p.y0;
        const cy = (p.y0 + p.y1) / 2;
        const exteriorSide = w.sides[0] === null ? 0 : w.sides[1] === null ? 1 : -1;
        return (
          <group key={i}>
            <mesh position={[cx, cy, cz]} castShadow receiveShadow material={st.core}>
              <boxGeometry args={alongX ? [L, H, T] : [T, H, L]} />
            </mesh>
            {([0, 1] as const).map((side) => {
              const sign = side === 0 ? -1 : 1;
              const off = T / 2 + 0.003;
              const pos: [number, number, number] = alongX ? [cx, cy, cz + sign * off] : [cx + sign * off, cy, cz];
              const rotY = alongX ? (side === 0 ? Math.PI : 0) : side === 0 ? -Math.PI / 2 : Math.PI / 2;
              const room = paintRoomAt(w, side, (p.u0 + p.u1) / 2);
              const mat = side === exteriorSide || !room ? st.exterior : mats[room].wall;
              return (
                <mesh key={side} position={pos} rotation-y={rotY} material={mat} receiveShadow>
                  <planeGeometry args={[L, H]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
      {w.openings?.filter((o) => o.glass).map((o, i) => {
        const [cx, cz] = toWorld((o.s + o.e) / 2);
        const L = o.e - o.s;
        const H = o.top - o.bottom;
        const cy = (o.top + o.bottom) / 2;
        const frame = (dx: number, dy: number, sx: number, sy: number) => (
          <mesh position={alongX ? [cx + dx, cy + dy, cz] : [cx, cy + dy, cz + dx]} material={st.trim}>
            <boxGeometry args={alongX ? [sx, sy, 0.06] : [0.06, sy, sx]} />
          </mesh>
        );
        return (
          <group key={`g${i}`}>
            <mesh position={[cx, cy, cz]} material={st.glass}>
              <boxGeometry args={alongX ? [L, H, 0.02] : [0.02, H, L]} />
            </mesh>
            {frame(0, H / 2, L, 0.05)}
            {frame(0, -H / 2, L, 0.05)}
            {frame(-L / 2, 0, 0.05, H)}
            {frame(L / 2, 0, 0.05, H)}
            {L > 1.2 && frame(0, 0, 0.04, H)}
          </group>
        );
      })}
    </group>
  );
}

// ---------- Furniture ----------
function Sofa({ p, r = 0, st }: { p: [number, number, number]; r?: number; st: Static }) {
  return (
    <group position={p} rotation-y={r}>
      <B p={[0, 0.22, 0]} s={[2.1, 0.32, 0.9]} m={st.forest} />
      <B p={[0, 0.55, -0.37]} s={[2.1, 0.5, 0.18]} m={st.forest} />
      <B p={[-1.0, 0.42, 0]} s={[0.16, 0.3, 0.9]} m={st.forest} />
      <B p={[1.0, 0.42, 0]} s={[0.16, 0.3, 0.9]} m={st.forest} />
      <B p={[-0.5, 0.45, 0.05]} s={[0.9, 0.12, 0.7]} m={st.forest} />
      <B p={[0.5, 0.45, 0.05]} s={[0.9, 0.12, 0.7]} m={st.forest} />
      <B p={[-0.6, 0.62, -0.22]} s={[0.4, 0.34, 0.12]} m={st.linen} />
    </group>
  );
}
function Lamp({ p, st, fix, h = 1.5 }: { p: [number, number, number]; st: Static; fix: THREE.Material; h?: number }) {
  return (
    <group position={p}>
      <mesh position={[0, h / 2, 0]} material={fix}><cylinderGeometry args={[0.015, 0.015, h]} /></mesh>
      <mesh position={[0, 0.02, 0]} material={fix}><cylinderGeometry args={[0.14, 0.14, 0.03]} /></mesh>
      <mesh position={[0, h, 0]} material={st.lamp}><cylinderGeometry args={[0.13, 0.18, 0.25, 20, 1, true]} /></mesh>
    </group>
  );
}
function Pendant({ p, st, fix }: { p: [number, number, number]; st: Static; fix: THREE.Material }) {
  return (
    <group position={p}>
      <mesh position={[0, (WALL_H - p[1]) / 2, 0]} material={fix}><cylinderGeometry args={[0.006, 0.006, WALL_H - p[1]]} /></mesh>
      <mesh material={fix}><sphereGeometry args={[0.18, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh position={[0, -0.01, 0]} rotation-x={Math.PI / 2} material={st.lamp}><circleGeometry args={[0.16, 20]} /></mesh>
    </group>
  );
}
function Plant({ p, st }: { p: [number, number, number]; st: Static }) {
  return (
    <group position={p}>
      <mesh position={[0, 0.18, 0]} material={st.ceramic} castShadow><cylinderGeometry args={[0.16, 0.12, 0.36, 16]} /></mesh>
      <mesh position={[0, 0.75, 0]} material={st.leaf} castShadow><icosahedronGeometry args={[0.32, 1]} /></mesh>
    </group>
  );
}
function Tree({ p, s = 1, st }: { p: [number, number, number]; s?: number; st: Static }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 1, 0]} material={st.bark} castShadow><cylinderGeometry args={[0.08, 0.12, 2, 8]} /></mesh>
      <mesh position={[0, 2.4, 0]} material={st.leaf} castShadow><icosahedronGeometry args={[0.9, 1]} /></mesh>
    </group>
  );
}

function Living({ m, st }: { m: Mats["living"]; st: Static }) {
  return (
    <group>
      <B p={[-2, 0.01, -1]} s={[2.6, 0.02, 1.9]} m={st.rug} />
      <Sofa p={[-2, 0, 0.2]} r={Math.PI} st={st} />
      <B p={[-2, 0.2, -1]} s={[1.1, 0.06, 0.6]} m={st.wood} />
      <B p={[-2, 0.1, -1]} s={[1.0, 0.16, 0.5]} m={st.darkwood} />
      <group position={[-3.3, 0, -1.4]} rotation-y={Math.PI / 2}>
        <B p={[0, 0.22, 0]} s={[0.8, 0.3, 0.8]} m={st.linen} />
        <B p={[0, 0.5, -0.33]} s={[0.8, 0.45, 0.14]} m={st.linen} />
      </group>
      {/* media console on north side below window */}
      <B p={[-2, 0.22, -2.75]} s={[2.4, 0.44, 0.38]} m={st.wood} />
      <B p={[-2.8, 0.47, -2.75]} s={[0.2, 0.06, 0.2]} m={st.ceramic} />
      <Lamp p={[-0.5, 0, 0.6]} st={st} fix={m.fixture} />
      <Plant p={[-3.6, 0, 0.6]} st={st} />
      {/* sconces */}
      <B p={[-0.3, 1.8, -2.9]} s={[0.08, 0.2, 0.08]} m={m.fixture} />
    </group>
  );
}
function Kitchen({ m, st }: { m: Mats["kitchen"]; st: Static }) {
  return (
    <group>
      {/* north run */}
      <B p={[2, 0.43, -2.69]} s={[3.6, 0.86, 0.6]} m={m.cabinet} />
      <B p={[2, 0.89, -2.68]} s={[3.64, 0.05, 0.64]} m={m.counter} />
      <B p={[0.8, 1.85, -2.76]} s={[1.0, 0.8, 0.36]} m={m.cabinet} />
      <B p={[3.25, 1.85, -2.76]} s={[1.1, 0.8, 0.36]} m={m.cabinet} />
      {/* east run with tall pantry */}
      <B p={[3.69, 0.43, -1.4]} s={[0.6, 0.86, 2.0]} m={m.cabinet} />
      <B p={[3.68, 0.89, -1.4]} s={[0.64, 0.05, 2.0]} m={m.counter} />
      <B p={[3.69, 1.1, -0.1]} s={[0.6, 2.2, 0.6]} m={m.cabinet} />
      {/* island */}
      <B p={[2, 0.45, -0.9]} s={[2.0, 0.9, 0.9]} m={m.cabinet} />
      <B p={[2, 0.93, -0.9]} s={[2.15, 0.06, 1.0]} m={m.counter} />
      {/* handles */}
      {[0.6, 1.2, 1.8, 2.4, 3.0].map((x) => (
        <B key={x} p={[x, 0.75, -2.38]} s={[0.25, 0.02, 0.02]} m={m.fixture} />
      ))}
      {/* faucet + sink */}
      <B p={[1.8, 0.92, -2.65]} s={[0.6, 0.02, 0.4]} m={st.mirror} />
      <mesh position={[1.8, 1.08, -2.85]} material={m.fixture}><cylinderGeometry args={[0.018, 0.018, 0.34]} /></mesh>
      <B p={[1.8, 1.24, -2.76]} s={[0.03, 0.03, 0.2]} m={m.fixture} />
      {/* range + hood */}
      <B p={[3.25, 0.93, -2.65]} s={[0.7, 0.02, 0.5]} m={st.trim} />
      {/* stools */}
      {[1.4, 2.0, 2.6].map((x) => (
        <group key={x} position={[x, 0, -0.05]}>
          <mesh position={[0, 0.65, 0]} material={st.wood} castShadow><cylinderGeometry args={[0.18, 0.18, 0.05, 16]} /></mesh>
          <mesh position={[0, 0.32, 0]} material={m.fixture}><cylinderGeometry args={[0.02, 0.02, 0.64]} /></mesh>
          <mesh position={[0, 0.02, 0]} material={m.fixture}><cylinderGeometry args={[0.16, 0.16, 0.03]} /></mesh>
        </group>
      ))}
      <Pendant p={[1.5, 1.75, -0.9]} st={st} fix={m.fixture} />
      <Pendant p={[2.5, 1.75, -0.9]} st={st} fix={m.fixture} />
    </group>
  );
}
function Bedroom({ m, st }: { m: Mats["bedroom"]; st: Static }) {
  return (
    <group>
      <B p={[-2.2, 0.01, 3.0]} s={[2.4, 0.02, 1.8]} m={st.rug} />
      <B p={[-2.2, 0.2, 3.0]} s={[1.7, 0.3, 2.0]} m={st.wood} />
      <B p={[-2.2, 0.45, 3.0]} s={[1.6, 0.22, 1.9]} m={st.linen} />
      <B p={[-2.2, 0.58, 2.4]} s={[1.62, 0.06, 0.9]} m={st.forest} />
      <B p={[-2.2, 0.75, 3.92]} s={[1.9, 1.1, 0.1]} m={st.darkwood} />
      <B p={[-2.6, 0.65, 3.7]} s={[0.55, 0.16, 0.3]} m={st.linen} />
      <B p={[-1.8, 0.65, 3.7]} s={[0.55, 0.16, 0.3]} m={st.linen} />
      {[-3.35, -1.05].map((x) => (
        <group key={x}>
          <B p={[x, 0.25, 3.7]} s={[0.45, 0.5, 0.4]} m={st.wood} />
          <Lamp p={[x, 0.5, 3.7]} st={st} fix={m.fixture} h={0.35} />
        </group>
      ))}
      <B p={[-0.35, 0.45, 2.4]} s={[0.45, 0.9, 1.2]} m={st.wood} />
      <B p={[-0.12, 0.65, 2.4]} s={[0.02, 0.02, 0.9]} m={m.fixture} />
    </group>
  );
}
function Bath({ m, st }: { m: Mats["bath"]; st: Static }) {
  return (
    <group>
      <B p={[0.75, 0.55, 3.72]} s={[1.1, 0.4, 0.5]} m={m.cabinet} />
      <B p={[0.75, 0.77, 3.71]} s={[1.14, 0.04, 0.54]} m={m.counter} />
      <mesh position={[0.75, 1.55, 3.9]} rotation-x={0} material={st.mirror}><cylinderGeometry args={[0.35, 0.35, 0.02, 32]} /></mesh>
      <mesh position={[0.75, 1.55, 3.91]} rotation-x={Math.PI / 2} material={m.fixture}><torusGeometry args={[0.36, 0.02, 8, 40]} /></mesh>
      <mesh position={[0.75, 0.9, 3.85]} material={m.fixture}><cylinderGeometry args={[0.015, 0.015, 0.22]} /></mesh>
      {/* shower */}
      <B p={[1.55, 0.03, 1.85]} s={[0.8, 0.06, 1.4]} m={st.ceramic} />
      <mesh position={[1.15, 1.05, 1.85]} material={st.glass}><boxGeometry args={[0.02, 2.0, 1.4]} /></mesh>
      <mesh position={[1.85, 2.0, 1.85]} material={m.fixture}><cylinderGeometry args={[0.12, 0.12, 0.02, 20]} /></mesh>
      <B p={[1.9, 1.1, 1.85]} s={[0.03, 1.8, 0.03]} m={m.fixture} />
      {/* toilet */}
      <group position={[0.3, 0, 2.6]}>
        <B p={[0, 0.2, 0]} s={[0.4, 0.4, 0.55]} m={st.ceramic} />
        <B p={[-0.15, 0.55, 0]} s={[0.18, 0.4, 0.45]} m={st.ceramic} />
      </group>
      <B p={[0.08, 1.0, 1.6]} s={[0.04, 0.04, 0.5]} m={m.fixture} />
    </group>
  );
}
function Studio({ m, st }: { m: Mats["studio"]; st: Static }) {
  return (
    <group>
      <B p={[3.0, 0.74, 3.65]} s={[1.4, 0.04, 0.6]} m={m.cabinet} />
      <B p={[2.35, 0.37, 3.65]} s={[0.04, 0.74, 0.6]} m={m.cabinet} />
      <B p={[3.65, 0.37, 3.65]} s={[0.04, 0.74, 0.6]} m={m.cabinet} />
      <group position={[3.0, 0, 3.15]}>
        <B p={[0, 0.45, 0]} s={[0.45, 0.06, 0.45]} m={st.darkwood} />
        <B p={[0, 0.75, -0.2]} s={[0.45, 0.55, 0.05]} m={st.darkwood} />
        <mesh position={[0, 0.22, 0]} material={m.fixture}><cylinderGeometry args={[0.025, 0.025, 0.42]} /></mesh>
      </group>
      {/* shelving along east wall */}
      <B p={[3.82, 1.1, 2.2]} s={[0.3, 2.2, 1.5]} m={m.cabinet} />
      {[0.5, 1.0, 1.5, 2.0].map((y) => (
        <B key={y} p={[3.66, y, 2.2]} s={[0.02, 0.2, 1.3]} m={st.linen} />
      ))}
      {/* daybed */}
      <B p={[2.45, 0.22, 1.9]} s={[0.7, 0.3, 1.5]} m={st.wood} />
      <B p={[2.45, 0.42, 1.9]} s={[0.66, 0.12, 1.45]} m={st.forest} />
      <Lamp p={[3.5, 0.76, 3.75]} st={st} fix={m.fixture} h={0.4} />
    </group>
  );
}

const FURNITURE: Record<RoomId, (p: { m: Mats[RoomId]; st: Static }) => React.ReactElement> = {
  living: Living, kitchen: Kitchen, bedroom: Bedroom, bath: Bath, studio: Studio,
};

// ---------- House ----------
export interface HouseProps {
  design: DesignState;
  selected: RoomId | null;
  hovered: RoomId | null;
  roof: boolean;
  cutaway: boolean;
  evening: boolean;
  hiddenWalls: Set<string>;
  onPick?: (id: RoomId) => void;
  onHover?: (id: RoomId | null) => void;
  showHotspots?: boolean;
}

export function House({ design, selected, hovered, roof, cutaway, evening, hiddenWalls, onPick, onHover, showHotspots }: HouseProps) {
  const mats = useRoomMaterials(design);
  const st = useStatic();
  useEffect(() => {
    st.lamp.emissiveIntensity = evening ? 1.6 : 0;
  }, [evening, st]);
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __oakline?: unknown }).__oakline = { mats };
  }, [mats]);
  useEffect(() => () => Object.values(st).forEach((m) => (m as THREE.Material).dispose()), [st]);
  const hl = useMemo(() => new THREE.MeshBasicMaterial({ color: "#AD9270", transparent: true, opacity: 0.22, depthWrite: false }), []);
  const pick = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), []);
  const downAt = useRef(0);

  const click = (id: RoomId) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return; // was a drag, not a click
    onPick?.(id);
  };

  return (
    <group>
      {/* ground + patio */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0.5]} receiveShadow material={st.grass}>
        <planeGeometry args={[40, 40]} />
      </mesh>
      <B p={[0, -0.01, 0.5]} s={[8.4, 0.04, 7.4]} m={st.core} />
      <B p={[-5.2, 0.02, -1.2]} s={[2.4, 0.06, 3.6]} m={st.deck} />
      <group position={[-5.4, 0, -1.6]}>
        <B p={[0, 0.38, 0]} s={[0.9, 0.04, 0.9]} m={st.darkwood} />
        <B p={[0, 0.18, 0]} s={[0.1, 0.36, 0.1]} m={st.trim} />
        <B p={[0, 0.22, 0.85]} s={[0.55, 0.06, 0.55]} m={st.linen} />
        <B p={[0, 0.22, -0.85]} s={[0.55, 0.06, 0.55]} m={st.linen} />
      </group>
      <B p={[4.9, 0.03, 0.45]} s={[1.6, 0.06, 1.2]} m={st.exterior} />
      <Tree p={[-7, 0, 3]} s={1.2} st={st} />
      <Tree p={[6.8, 0, -3.5]} st={st} />
      <Tree p={[-6, 0, -5.5]} s={0.9} st={st} />
      <Tree p={[6.5, 0, 5]} s={1.1} st={st} />

      {/* rooms: floors, furniture, pick surfaces */}
      {ROOMS.map((r) => {
        const w = r.x[1] - r.x[0];
        const d = r.z[1] - r.z[0];
        const cx = (r.x[0] + r.x[1]) / 2;
        const cz = (r.z[0] + r.z[1]) / 2;
        const F = FURNITURE[r.id];
        const on = hovered === r.id || selected === r.id;
        return (
          <group key={r.id} name={`room-${r.id}`}>
            <mesh rotation-x={-Math.PI / 2} position={[cx, 0.012, cz]} receiveShadow material={mats[r.id].floor} name={`${r.id}:floor`}>
              <planeGeometry args={[w, d]} />
            </mesh>
            {on && !selected && (
              <mesh rotation-x={-Math.PI / 2} position={[cx, 0.03, cz]} material={hl}>
                <planeGeometry args={[w - 0.1, d - 0.1]} />
              </mesh>
            )}
            <F m={mats[r.id]} st={st} />
            <mesh
              rotation-x={-Math.PI / 2}
              position={[cx, 0.05, cz]}
              material={pick}
              onPointerDown={() => (downAt.current = performance.now())}
              onClick={click(r.id)}
              onPointerOver={(e) => { e.stopPropagation(); onHover?.(r.id); }}
              onPointerOut={() => onHover?.(null)}
            >
              <planeGeometry args={[w, d]} />
            </mesh>
            {evening && <pointLight position={[cx, 2.2, cz]} intensity={2.2} distance={4.5} color="#FFCF94" />}
            {showHotspots && !selected && (
              <Html position={[cx, roof && !cutaway ? 3.2 : 1.4, cz]} center zIndexRange={[20, 0]}>
                <button
                  type="button"
                  onClick={() => onPick?.(r.id)}
                  className="whitespace-nowrap border border-primary bg-card px-2.5 py-1.5 text-[13px] font-semibold text-primary shadow-sm hover:bg-primary hover:text-primary-foreground"
                >
                  {r.name}
                </button>
              </Html>
            )}
          </group>
        );
      })}

      {WALLS.map((w) => (
        <Wall key={w.id} w={w} mats={mats} st={st} hidden={hiddenWalls.has(w.id)} low={cutaway} />
      ))}

      {/* door slab at front door + interior trim */}
      {!hiddenWalls.has("east") && !cutaway && <B p={[4.02, 1.05, 0.45]} s={[0.05, 2.1, 0.88]} m={st.fascia} />}

      {roof && !cutaway && !selected && (
        <group name="roof">
          <B p={[0, WALL_H + 0.1, 0.5]} s={[8.8, 0.2, 7.8]} m={st.roof} />
          <B p={[0, WALL_H + 0.1, -3.39]} s={[8.82, 0.24, 0.04]} m={st.fascia} />
          <B p={[0, WALL_H + 0.1, 4.39]} s={[8.82, 0.24, 0.04]} m={st.fascia} />
          <B p={[-1, WALL_H + 0.55, -1]} s={[6.4, 0.7, 3.6]} m={st.roof} />
          <B p={[-1, WALL_H + 0.45, -2.81]} s={[6.0, 0.4, 0.02]} m={st.glass} />
          <B p={[-5.2, 2.3, -1.2]} s={[2.6, 0.1, 3.8]} m={st.fascia} />
        </group>
      )}
    </group>
  );
}

/** Walls whose 2D segment crosses the camera→target line get cut away in room mode. */
export function occludingWalls(cam: [number, number, number], target: [number, number, number]) {
  const set = new Set<string>();
  const inter = (p1: [number, number], p2: [number, number], p3: [number, number], p4: [number, number]) => {
    const d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
    if (Math.abs(d) < 1e-9) return false;
    const u = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d;
    const v = ((p3[0] - p1[0]) * (p2[1] - p1[1]) - (p3[1] - p1[1]) * (p2[0] - p1[0])) / d;
    return u > 0 && u < 1 && v > 0 && v < 1;
  };
  for (const w of WALLS) if (inter([cam[0], cam[2]], [target[0], target[2]], w.a, w.b)) set.add(w.id);
  return set;
}
