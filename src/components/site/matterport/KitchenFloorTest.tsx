// Internal feasibility harness. Renders nothing unless FLOOR_TEST is fully configured AND ?floorTest=1 is present.
import { useEffect, useRef, useState } from "react";
import { FLOOR_TEST, TOUR_MODEL_ID, floorTestReadiness } from "@/lib/matterport-floor-test";
import { MATERIAL_PHOTOS } from "@/lib/material-photos";
import { attachKitchenFloorOverlay, type FloorOverlay } from "./kitchenFloorOverlay";

export function KitchenFloorTest() {
  const [requested, setRequested] = useState(false);
  useEffect(() => { setRequested(new URLSearchParams(window.location.search).get("floorTest") === "1"); }, []);
  if (!requested || !floorTestReadiness(FLOOR_TEST).ready) return null;
  return <Harness />;
}

function Harness() {
  const frame = useRef<HTMLIFrameElement>(null);
  const overlay = useRef<FloorOverlay | null>(null);
  const sdkRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState("Loading test tour…");
  const src = `${FLOOR_TEST.bundlePath}/showcase.html?m=${TOUR_MODEL_ID}&applicationKey=${encodeURIComponent(FLOOR_TEST.sdkKey)}&play=1`;

  useEffect(() => {
    const el = frame.current; if (!el) return;
    const onLoad = async () => {
      try {
        const w = el.contentWindow as unknown as { MP_SDK: { connect(w: unknown): Promise<unknown> } };
        const sdk = await w.MP_SDK.connect(w);
        sdkRef.current = sdk;
        overlay.current = await attachKitchenFloorOverlay(sdk, FLOOR_TEST);
        setStatus("Connected. Overlay hidden; original floor showing.");
      } catch (e) { setStatus(`Could not connect: ${(e as Error).message}`); }
    };
    el.addEventListener("load", onLoad);
    return () => { el.removeEventListener("load", onLoad); overlay.current?.dispose(); };
  }, []);

  const apply = (url: string, label: string) => overlay.current?.setTexture(url).then(() => setStatus(`Test overlay: ${label}`), () => setStatus("Texture failed to load."));
  const go = (sweep: string) => sdkRef.current?.Sweep.moveTo(sweep, { transition: sdkRef.current.Sweep.Transition.FLY });

  return (
    <section className="wrap section" aria-label="Kitchen floor feasibility test">
      <h2 className="text-[22px]">Kitchen floor test (internal)</h2>
      <div className="mt-3 aspect-video w-full bg-secondary">
        <iframe ref={frame} className="h-full w-full border-0" src={src} title="Kitchen floor overlay test" allow="fullscreen; xr-spatial-tracking" allowFullScreen />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[14px]">
        {FLOOR_TEST.sweeps.map((s, i) => <button key={s} className="min-h-11 border px-3" onClick={() => go(s)}>Kitchen position {i + 1}</button>)}
        <button className="min-h-11 border px-3" onClick={() => apply(MATERIAL_PHOTOS.lightWood.url, "Light wood")}>Light wood</button>
        <button className="min-h-11 border px-3" onClick={() => apply(MATERIAL_PHOTOS.darkWood.url, "Rich brown wood")}>Rich brown wood</button>
        <button className="min-h-11 border px-3" onClick={() => { overlay.current?.reset(); setStatus("Reset: original floor showing."); }}>Reset</button>
      </div>
      <p className="mt-2 text-[13px]" role="status">{status}</p>
    </section>
  );
}
