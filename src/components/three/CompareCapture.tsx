import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { House } from "./House";
import { DEFAULT_DESIGN, type DesignState } from "@/lib/rooms";

// Two captures from the same procedural kitchen/living camera, differing only in wood finishes.
const VARIANTS: { label: string; design: DesignState }[] = [
  { label: "Warm oak", design: { ...DEFAULT_DESIGN, living: { ...DEFAULT_DESIGN.living, floor: "oak" }, kitchen: { ...DEFAULT_DESIGN.kitchen, floor: "oak", cabinet: "oak" } } },
  { label: "Deep walnut", design: { ...DEFAULT_DESIGN, living: { ...DEFAULT_DESIGN.living, floor: "walnut" }, kitchen: { ...DEFAULT_DESIGN.kitchen, floor: "walnut", cabinet: "walnut" } } },
];
const CAM: [number, number, number] = [0.2, 1.8, 0.85];
const TARGET = new THREE.Vector3(3, 0.6, -2.6);

function Grab({ variant, onShot }: { variant: number; onShot: (i: number, url: string) => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    camera.lookAt(TARGET);
    let raf = 0;
    let n = 0;
    const tick = () => {
      gl.render(scene, camera);
      if (++n < 4) raf = requestAnimationFrame(tick);
      else onShot(variant, gl.domElement.toDataURL("image/jpeg", 0.88));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant, gl, scene, camera, onShot]);
  return null;
}

export default function CompareCapture() {
  const [shots, setShots] = useState<(string | null)[]>([null, null]);
  const [variant, setVariant] = useState(0);
  const [err, setErr] = useState(false);
  const done = shots[0] && shots[1];
  const onShot = (i: number, url: string) => {
    setShots((s) => {
      const n = [...s];
      n[i] = url;
      return n;
    });
    if (i === 0) setVariant(1);
  };
  if (err) return <p className="panel">The finish comparison needs 3D graphics, which this device is not providing.</p>;
  return (
    <div className="border border-border bg-card p-2">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-secondary">
        {done ? (
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={shots[0]!} alt="Kitchen and living room rendered with warm oak floor and cabinetry" />}
            itemTwo={<ReactCompareSliderImage src={shots[1]!} alt="The same kitchen and living room view rendered with deep walnut floor and cabinetry" />}
            style={{ height: "100%" }}
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-0">
              <Canvas
                dpr={1}
                gl={{ preserveDrawingBuffer: true, antialias: true }}
                camera={{ position: CAM, fov: 55 }}
                frameloop="never"
                onCreated={({ gl }) => {
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                }}
                onError={() => setErr(true)}
              >
                <color attach="background" args={["#dfe3dc"]} />
                <hemisphereLight args={["#fff6e8", "#b9b09a", 1.2]} />
                <directionalLight position={[7, 12, 6]} intensity={2} />
                <House design={VARIANTS[variant]!.design} selected="kitchen" hovered={null} roof={false} cutaway={false} evening={false} hiddenWalls={new Set()} />
                <Grab variant={variant} onShot={onShot} />
              </Canvas>
            </div>
            <p className="absolute inset-0 flex items-center justify-center text-muted-foreground">Rendering both finishes…</p>
          </>
        )}
      </div>
      <div className="flex justify-between border-t border-border/60 px-1 pt-2 text-[14px] font-semibold">
        <span>Warm oak</span>
        <span>Deep walnut</span>
      </div>
    </div>
  );
}
