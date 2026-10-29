import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, Maximize, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { designStore } from "@/lib/design-store";
import { PANO, PANO_FLOORS, PANO_WALLS } from "./restyle-data";
import type { View } from "./PanoramaScene";

const PanoramaScene = lazy(() => import("./PanoramaScene"));
const START: View = { yaw: Math.PI, pitch: -0.12, fov: 75 };
const clampPitch = (p: number) => Math.max(-1.3, Math.min(1.3, p));

function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

function Swatch({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={`flex min-h-11 items-center gap-2 border px-2 py-1.5 text-left text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-primary bg-secondary font-semibold" : "border-border hover:bg-secondary/60"}`}>
      {children}<span className="flex-1">{label}</span>{active && <Check className="size-4 text-primary" aria-hidden />}
    </button>
  );
}

export function RoomRestyler() {
  const [mounted, setMounted] = useState(false);
  const [gl, setGl] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [floor, setFloor] = useState("original");
  const [wall, setWall] = useState("original");
  const [holding, setHolding] = useState(false);
  const [msg, setMsg] = useState("");
  const view = useRef<View>({ ...START });
  const invalidate = useRef<(() => void) | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => { setMounted(true); setGl(hasWebGL()); }, []);
  const redraw = () => invalidate.current?.();
  const turn = (dy: number, dp = 0) => { view.current.yaw += dy; view.current.pitch = clampPitch(view.current.pitch + dp); redraw(); };
  const zoom = (d: number) => { view.current.fov = Math.max(40, Math.min(90, view.current.fov + d)); redraw(); };
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  const f = PANO_FLOORS.find((o) => o.id === floor)!;
  const w = PANO_WALLS.find((o) => o.id === wall)!;
  const changed = floor !== "original" || wall !== "original";

  const save = () => {
    designStore.hydrate();
    if (f.designId) designStore.setFinish("living", "floor", f.designId);
    if (w.designId) designStore.setFinish("living", "wall", w.designId);
    setMsg("Saved to the Living Room in your finish schedule.");
  };

  const use3D = mounted && gl && !failed;

  return (
    <section className="wrap section" aria-labelledby="restyle-heading">
      <h2 id="restyle-heading" className="text-[28px]">Design a real room</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Stand in a real 360° photograph of a home. Drag to look around, then change the floor and wall finishes. The original light and shadows stay on every surface.</p>
      <div className="mt-5 grid gap-8 lg:grid-cols-[65fr_35fr]">
        <div className="min-w-0">
          <div ref={wrap} className="relative h-[360px] w-full overflow-hidden bg-secondary sm:h-[420px] lg:h-auto lg:aspect-[16/10]" style={{ touchAction: "pan-y" }}>
            {use3D ? (
              <div className="absolute inset-0 cursor-grab active:cursor-grabbing" tabIndex={0} role="application" aria-label="360° room view. Use arrow keys to look around, plus and minus to zoom."
                onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture?.(e.pointerId); }}
                onPointerMove={(e) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; drag.current = { x: e.clientX, y: e.clientY }; const k = view.current.fov / 75 * 0.005; turn(-dx * k, e.pointerType === "mouse" ? dy * k : 0); }}
                onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
                onWheel={(e) => { if (document.fullscreenElement) zoom(e.deltaY > 0 ? 4 : -4); }}
                onKeyDown={(e) => { const m: Record<string, () => void> = { ArrowLeft: () => turn(-0.12), ArrowRight: () => turn(0.12), ArrowUp: () => turn(0, 0.08), ArrowDown: () => turn(0, -0.08), "+": () => zoom(-5), "=": () => zoom(-5), "-": () => zoom(5) }; const fn = m[e.key]; if (fn) { e.preventDefault(); fn(); } }}>
                <Suspense fallback={null}>
                  <PanoramaScene view={view} invalidateRef={invalidate} floorTex={f.tex} floorScale={f.scale} wall={w.color} showOriginal={holding} onReady={onReady} onError={onError} />
                </Suspense>
                {!ready && <p className="absolute inset-0 grid place-items-center text-[14px] text-muted-foreground">Loading the room…</p>}
              </div>
            ) : (
              <>
                <img src={PANO.url} alt="Flattened 360° photograph of an empty house with tiled floor, tan walls, a front door and a kitchen" className="h-full w-full object-cover" />
                {mounted && <p className="absolute inset-x-0 bottom-0 bg-background/90 p-3 text-[14px]">The 360° view is unavailable on this device, so finishes cannot be previewed here. You can still save choices below.</p>}
              </>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => turn(-0.35)} disabled={!use3D}><ArrowLeft />Look left</Button>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => turn(0.35)} disabled={!use3D}><ArrowRight />Look right</Button>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => zoom(-8)} disabled={!use3D} aria-label="Zoom in"><Plus /></Button>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => zoom(8)} disabled={!use3D} aria-label="Zoom out"><Minus /></Button>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => { view.current = { ...START }; redraw(); }} disabled={!use3D}><RotateCcw />Reset view</Button>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : wrap.current?.requestFullscreen?.())} disabled={!use3D}><Maximize />Full screen</Button>
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground"><a href={PANO.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{PANO.credit}</a>. This is not an Oakline project. Finishes are applied digitally over the photograph; colors vary by display and lighting.</p>
        </div>

        <div className="space-y-6">
          <fieldset>
            <legend className="text-[20px]">Floor</legend>
            <div className="mt-3 grid gap-2">
              {PANO_FLOORS.map((o) => (
                <Swatch key={o.id} active={floor === o.id} label={o.name} onClick={() => setFloor(o.id)}>
                  {o.swatch ? <img src={o.swatch} alt="" className="size-8 object-cover" /> : <span className="size-8 border border-border" style={{ background: "#E6DCCB" }} aria-hidden />}
                </Swatch>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[20px]">Walls</legend>
            <div className="mt-3 grid gap-2">
              {PANO_WALLS.map((o) => (
                <Swatch key={o.id} active={wall === o.id} label={o.name} onClick={() => setWall(o.id)}>
                  <span className="size-8 border border-border" style={{ background: o.color ?? "#C9A96E" }} aria-hidden />
                </Swatch>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" disabled={!changed || !use3D}
              onPointerDown={() => setHolding(true)} onPointerUp={() => setHolding(false)} onPointerLeave={() => setHolding(false)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setHolding(true); }} onKeyUp={() => setHolding(false)} onBlur={() => setHolding(false)}>
              <Eye />Hold to see original
            </Button>
            <Button variant="ghost" className="min-h-11" disabled={!changed} onClick={() => { setFloor("original"); setWall("original"); setMsg(""); }}>Reset room</Button>
          </div>
          <div>
            <Button className="min-h-11" disabled={!f.designId && !w.designId} onClick={save}>Save to my finish schedule</Button>
            <p className="mt-2 text-[13px] text-muted-foreground" role="status">{msg || "Choices are saved in this browser only."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
