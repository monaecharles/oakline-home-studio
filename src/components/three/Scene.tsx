import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitImpl } from "three-stdlib";
import { House, occludingWalls } from "./House";
import { roomById, type DesignState, type RoomId } from "@/lib/rooms";
import { disposeTextures } from "./textures";

export const HOME_VIEW = { position: [9.5, 8.5, 11] as [number, number, number], target: [0, 0.6, 0.5] as [number, number, number] };

export interface RigApi {
  rotate: (dir: 1 | -1) => void;
  zoom: (f: number) => void;
  reset: () => void;
  goTo: (pos: [number, number, number], target: [number, number, number]) => void;
}

const Rig = forwardRef<RigApi, { reduced: boolean; interior: boolean }>(function Rig({ reduced, interior }, ref) {
  const { camera, invalidate } = useThree();
  const controls = useRef<OrbitImpl>(null);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const set = (pos: THREE.Vector3, target: THREE.Vector3) => {
    if (reduced) {
      camera.position.copy(pos);
      controls.current?.target.copy(target);
      controls.current?.update();
      goal.current = null;
    } else goal.current = { pos, target };
    invalidate();
  };
  useImperativeHandle(ref, () => ({
    rotate(dir) {
      const c = controls.current;
      if (!c) return;
      const off = camera.position.clone().sub(c.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), (dir * Math.PI) / 6);
      set(c.target.clone().add(off), c.target.clone());
    },
    zoom(f) {
      const c = controls.current;
      if (!c) return;
      const off = camera.position.clone().sub(c.target).multiplyScalar(f);
      const len = THREE.MathUtils.clamp(off.length(), c.minDistance, c.maxDistance);
      set(c.target.clone().add(off.setLength(len)), c.target.clone());
    },
    reset() {
      set(new THREE.Vector3(...HOME_VIEW.position), new THREE.Vector3(...HOME_VIEW.target));
    },
    goTo(p, t) {
      set(new THREE.Vector3(...p), new THREE.Vector3(...t));
    },
  }));
  useFrame((_, dt) => {
    const g = goal.current;
    const c = controls.current;
    if (!g || !c) return;
    const k = 1 - Math.exp(-6 * Math.min(dt, 0.05));
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.target, k);
    c.update();
    if (camera.position.distanceTo(g.pos) < 0.01 && c.target.distanceTo(g.target) < 0.01) goal.current = null;
    invalidate();
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={HOME_VIEW.target}
      enableDamping={false}
      minDistance={interior ? 0.3 : 4}
      maxDistance={interior ? 6 : 24}
      maxPolarAngle={interior ? Math.PI * 0.62 : Math.PI * 0.47}
      enablePan={false}
    />
  );
});

export interface SceneProps {
  design: DesignState;
  selected: RoomId | null;
  hovered: RoomId | null;
  roof: boolean;
  cutaway: boolean;
  evening: boolean;
  active: boolean;
  reduced: boolean;
  onPick: (id: RoomId) => void;
  onHover: (id: RoomId | null) => void;
  onLost: () => void;
  onReady: () => void;
}

const Scene = forwardRef<RigApi, SceneProps>(function Scene(p, ref) {
  const room = roomById(p.selected);
  const hidden = useMemo(() => (room ? occludingWalls(room.camera.position, room.camera.target) : new Set<string>()), [room]);
  useEffect(() => () => disposeTextures(), []);
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={p.active ? "demand" : "never"}
      camera={{ position: HOME_VIEW.position, fov: 45, near: 0.05, far: 120 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          p.onLost();
        });
        requestAnimationFrame(() => p.onReady());
      }}
      style={{ touchAction: "none" }}
      onPointerMissed={() => p.onHover(null)}
    >
      <color attach="background" args={[p.evening ? "#2a2f2b" : "#dfe3dc"]} />
      <fog attach="fog" args={[p.evening ? "#2a2f2b" : "#dfe3dc", 22, 45]} />
      <hemisphereLight args={[p.evening ? "#556070" : "#fff6e8", p.evening ? "#2a2520" : "#b9b09a", p.evening ? 0.35 : 1.1]} />
      <directionalLight
        position={p.evening ? [-8, 4, -6] : [7, 12, 6]}
        intensity={p.evening ? 0.35 : 2.2}
        color={p.evening ? "#ffb070" : "#fff2dc"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0005}
      />
      <House
        design={p.design}
        selected={p.selected}
        hovered={p.hovered}
        roof={p.roof}
        cutaway={p.cutaway}
        evening={p.evening}
        hiddenWalls={hidden}
        onPick={p.onPick}
        onHover={p.onHover}
        showHotspots
      />
      <Rig ref={ref} reduced={p.reduced} interior={!!room} />
    </Canvas>
  );
});
export default Scene;
