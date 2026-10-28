import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { designStore, useDesign, INQUIRY_PREFILL_KEY } from "@/lib/design-store";
import { DEFAULT_DESIGN, FINISHES, ROOMS, designSummary, finishSchedule, roomById, type RoomId } from "@/lib/rooms";
import { PHOTOS, photoUrl } from "@/lib/photos";
import { FloorPlan } from "./FloorPlan";
import type { RigApi } from "./Scene";
import { HOME_VIEW } from "./scene-constants";
import { Button } from "@/components/ui/button";
import { HomeWalkthrough } from "@/components/site/HomeWalkthrough";
import { MaterialPhoto } from "@/components/site/MaterialPhoto";
import { ArrowLeft, ArrowRight, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize } from "lucide-react";

const Scene = lazy(() => import("./Scene"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { err: boolean }> {
  override state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.err ? null : this.props.children;
  }
}

export function download(name: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Swatches({ room }: { room: RoomId }) {
  const s = useDesign();
  const r = roomById(room);
  if (!r) return null;
  return (
    <div className="space-y-4">
      {r.categories.map((cat) => (
        <fieldset key={cat}>
          <legend className="text-[14px] font-semibold">{FINISHES[cat].label}</legend>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={`${FINISHES[cat].label} for ${r.name}`}>
            {FINISHES[cat].options.map((o) => {
              const on = s.design[room][cat] === o.id;
              return (
                <Button variant="ghost"
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => designStore.setFinish(room, cat, o.id)}
                  className={`flex min-h-[44px] items-center gap-2 border px-2 py-1 text-[14px] ${on ? "border-2 border-primary bg-secondary font-semibold" : "border-border bg-card"}`}
                >
                  <span className="h-8 w-8 overflow-hidden" aria-hidden><MaterialPhoto category={cat} id={o.id} /></span>
                  {o.name}
                  {on && <span aria-hidden>✓</span>}
                </Button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <p className="text-[13px] text-muted-foreground">Colors vary by display and lighting.</p>
    </div>
  );
}

export default function Viewer({ initialRoom, compact }: { initialRoom?: RoomId | null; compact?: boolean }) {
  const s = useDesign();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion() ?? false;
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<RoomId | null>(null);
  const [visible, setVisible] = useState(true);
  const [full, setFull] = useState(false);
  const [tab, setTab] = useState<"finishes" | "photo">("finishes");
  const [reference, setReference] = useState(false);
  const [compare, setCompare] = useState(false);
  const [msg, setMsg] = useState("");
  const rig = useRef<RigApi>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const wrap = useRef<HTMLDivElement>(null);
  const fullBtn = useRef<HTMLButtonElement>(null);
  const sel = s.selected;
  const room = roomById(sel);

  useEffect(() => {
    designStore.hydrate();
    setWebgl(hasWebGL());
    if (initialRoom !== undefined) designStore.select(initialRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Camera follows selection.
  useEffect(() => {
    if (!ready) return;
    const r = roomById(sel);
    if (r) rig.current?.goTo(r.camera.position, r.camera.target);
    else rig.current?.goTo(HOME_VIEW.position, HOME_VIEW.target);
  }, [sel, ready, s.mode]);

  useEffect(() => {
    if (!full) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
      fullBtn.current?.focus();
    };
  }, [full]);

  const shownDesign = useMemo(() => (compare && sel ? { ...s.design, [sel]: DEFAULT_DESIGN[sel] } : s.design), [compare, sel, s.design]);
  const canUse3D = webgl && !failed;
  const select = (id: RoomId | null) => {
    designStore.select(id);
    setCompare(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") rig.current?.rotate(-1);
    else if (e.key === "ArrowRight") rig.current?.rotate(1);
    else if (e.key === "+" || e.key === "=") rig.current?.zoom(0.8);
    else if (e.key === "-") rig.current?.zoom(1.25);
    else return;
    e.preventDefault();
  };

  const useInInquiry = () => {
    const text = `Finish selections from the 3D home:\n${designSummary(s.design)}`;
    try {
      sessionStorage.setItem(INQUIRY_PREFILL_KEY, text);
    } catch {
      (window as unknown as { __oaklinePrefill?: string }).__oaklinePrefill = text;
    }
    navigate({ to: "/contact" });
  };

  const tool = "min-h-11 bg-card px-3 text-[14px] text-foreground";
  const stopIndex = ROOMS.findIndex((r) => r.id === sel);

  return (
    <div
      className={full ? "fixed inset-0 z-50 flex flex-col bg-background" : "bg-background"}
      role={full ? "dialog" : undefined}
      aria-modal={full || undefined}
      aria-label={full ? "3D home viewer, full screen" : undefined}
    >
      {full && (
        <div className="flex items-center justify-between border-b border-primary px-4 py-2">
          <span className="font-display text-lg">Oakline home in 3D</span>
          <Button variant="ghost" className="btn btn-solid" onClick={() => setFull(false)} autoFocus>Exit full screen</Button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 pb-4" aria-label="Home walkthrough">
        <Button variant="outline" onClick={() => { select("living"); designStore.set({ mode: "3d" }); }}>Enter the home</Button>
        <Button variant="ghost" aria-label="Previous room" title="Previous room" disabled={stopIndex <= 0} onClick={() => { const previous = ROOMS[stopIndex - 1]; if (previous) select(previous.id); }}><ArrowLeft /></Button>
        <Button variant="ghost" aria-label="Next room" title="Next room" disabled={stopIndex === ROOMS.length - 1} onClick={() => { const next = ROOMS[stopIndex + 1]; if (next) select(next.id); }}><ArrowRight /></Button>
        <Button variant="ghost" aria-expanded={reference} onClick={() => setReference((v) => !v)}>{reference ? "Hide filmed reference" : "Watch the filmed reference"}</Button>
      </div>
      {reference && <div className="pb-6"><HomeWalkthrough /></div>}
      <div className={`grid ${full ? "min-h-0 flex-1" : ""} ${compact ? "" : "lg:grid-cols-[65fr_35fr]"}`}>
        {/* Canvas column */}
        <div className="flex min-w-0 flex-col">
          <nav aria-label="Viewer location" className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-[14px]">
            <Button variant="ghost" className={`underline-offset-4 ${sel ? "underline" : "font-semibold"}`} onClick={() => select(null)}>Whole home</Button>
            {room && (
              <>
                <span aria-hidden>/</span>
                <span className="font-semibold" aria-current="location">{room.name}</span>
              </>
            )}
            <span className="ml-auto flex gap-1" role="group" aria-label="View mode">
              {(["3d", "plan"] as const).map((m) => (
                <Button variant="ghost" key={m} aria-pressed={s.mode === m} onClick={() => designStore.set({ mode: m })} className={`min-h-[36px] border px-3 text-[14px] ${s.mode === m ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {m === "3d" ? "3D" : "Plan"}
                </Button>
              ))}
            </span>
          </nav>
          <div
            ref={wrap}
            className={`relative ${full ? "min-h-0 flex-1" : "h-[360px] sm:h-[420px] lg:h-[560px]"} bg-secondary`}
            tabIndex={canUse3D && s.mode === "3d" ? 0 : -1}
            onKeyDown={onKey}
            aria-label="3D view. Arrow keys rotate, plus and minus zoom."
            data-scene-ready={ready ? "" : undefined}
          >
            {(s.mode === "plan" || !canUse3D) && (
              <div className="absolute inset-0 z-10">
                <FloorPlan selected={sel} onSelect={(id) => select(id)} />
              </div>
            )}
            {canUse3D && (
              <Boundary onError={() => setFailed(true)}>
                <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading the 3D home…</div>}>
                  <Scene
                    ref={rig}
                    design={shownDesign}
                    selected={sel}
                    hovered={hovered}
                    roof={s.roof}
                    cutaway={s.cutaway}
                    evening={s.evening}
                    active={visible && s.mode === "3d"}
                    reduced={reduceMotion}
                    onPick={(id) => select(id)}
                    onHover={setHovered}
                    onLost={() => mounted.current && setFailed(true)}
                    onReady={() => setReady(true)}
                  />
                </Suspense>
              </Boundary>
            )}
            {webgl !== null && !canUse3D && (
              <p role="status" className="absolute bottom-2 left-2 right-2 border border-primary bg-card p-2 text-[14px]">
                3D view unavailable on this device. The plan, room photos and finish choices below still work.
              </p>
            )}
          </div>
          {s.mode === "3d" && canUse3D && (
            <div className="flex flex-wrap gap-2 border-t border-border p-2" role="toolbar" aria-label="Camera controls">
              <Button variant="ghost" className={tool} onClick={() => rig.current?.rotate(-1)} aria-label="Rotate left" title="Rotate left"><RotateCcw /></Button>
              <Button variant="ghost" className={tool} onClick={() => rig.current?.rotate(1)} aria-label="Rotate right" title="Rotate right"><RotateCw /></Button>
              <Button variant="ghost" className={tool} onClick={() => rig.current?.zoom(0.8)} aria-label="Zoom in" title="Zoom in"><ZoomIn /></Button>
              <Button variant="ghost" className={tool} onClick={() => rig.current?.zoom(1.25)} aria-label="Zoom out" title="Zoom out"><ZoomOut /></Button>
              <Button variant="ghost" className={tool} onClick={() => { if (room) rig.current?.goTo(room.camera.position, room.camera.target); else rig.current?.reset(); }}>Reset view</Button>
              <Button variant="ghost" className={tool} aria-pressed={s.roof} onClick={() => designStore.set({ roof: !s.roof })}>{s.roof ? "Roof on" : "Roof off"}</Button>
              <Button variant="ghost" className={tool} aria-pressed={s.cutaway} onClick={() => designStore.set({ cutaway: !s.cutaway })}>Cutaway</Button>
              <Button variant="ghost" className={tool} aria-pressed={s.evening} onClick={() => designStore.set({ evening: !s.evening })}>{s.evening ? "Evening" : "Daylight"}</Button>
              {!full && <Button ref={fullBtn} className={tool} onClick={() => setFull(true)} aria-label="View full screen" title="View full screen"><Maximize /></Button>}
            </div>
          )}
        </div>

        {/* Controls column */}
        {!compact && (
          <div className={`min-w-0 ${full ? "overflow-y-auto" : ""}`}>
            <section className="p-4 md:p-5" aria-label="Rooms">
              <h2 className="text-[20px]">Rooms</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ROOMS.map((r) => (
                  <Button variant="ghost"
                    key={r.id}
                    aria-pressed={sel === r.id}
                    onClick={() => select(r.id)}
                    onFocus={() => setHovered(r.id)}
                    onBlur={() => setHovered(null)}
                    className={`min-h-[44px] border px-3 text-left text-[14px] ${sel === r.id ? "border-2 border-primary bg-secondary font-semibold" : "border-border"}`}
                  >
                    {r.name}
                  </Button>
                ))}
              </div>
            </section>
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={sel ?? "home"}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-5"
                aria-live="polite"
              >
                {room ? (
                  <>
                    <h2 className="text-[22px]">{room.name}</h2>
                    <p className="mt-2 text-[15px] text-muted-foreground">{room.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="ghost" className="btn btn-line" onClick={() => select(null)}>Back to whole home</Button>
                      <Button variant="ghost" className="btn btn-line" aria-pressed={compare} onClick={() => setCompare((c) => !c)}>
                        {compare ? "Showing original" : "Compare with original"}
                      </Button>
                    </div>
                    <div className="mt-4 flex border-b border-border" role="tablist">
                      {(["finishes", "photo"] as const).map((t) => (
                        <Button variant="ghost" key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-[44px] px-4 text-[14px] ${tab === t ? "border-b-2 border-primary font-semibold" : ""}`}>
                          {t === "finishes" ? "Finishes" : "Room photo"}
                        </Button>
                      ))}
                    </div>
                    <div className="pt-4" role="tabpanel">
                      {tab === "finishes" ? (
                        <Swatches room={room.id} />
                      ) : (
                        <figure className="">
                          <img src={photoUrl(room.photo, 960)} alt={PHOTOS[room.photo]?.alt ?? ""} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                          <figcaption className="pt-2 text-[13px] text-muted-foreground">Inspiration photograph, not the 3D room.</figcaption>
                        </figure>
                      )}
                    </div>
                    <Button variant="ghost"
                      className="mt-4 text-[14px] underline"
                      onClick={() => window.confirm(`Reset ${room.name} to its starting finishes?`) && designStore.resetRoom(room.id)}
                    >
                      Reset this room
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-[22px]">Whole home</h2>
                    <p className="mt-2 text-[15px] text-muted-foreground">
                      An explorable architectural interpretation inspired by the filmed home. The layout and dimensions are not a measured reconstruction of Alessandra Ambrosio’s house.
                    </p>
                  </>
                )}
              </motion.section>
            </AnimatePresence>
            <section className="p-4 md:p-5" aria-label="Your finish schedule">
              <h2 className="text-[20px]">Your finish schedule</h2>
              <ul className="mt-2 space-y-1 text-[14px]">
                {designSummary(s.design).split("\n").map((l) => <li key={l}>{l}</li>)}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="ghost" className="btn btn-solid" onClick={useInInquiry}>Use this design in my inquiry</Button>
                <Button variant="ghost" className="btn btn-line" onClick={() => download("oakline-finish-schedule.json", JSON.stringify(finishSchedule(s.design), null, 2), "application/json")}>
                  Download schedule
                </Button>
                <Button variant="ghost" className="btn btn-line" onClick={() => window.print()}>Print summary</Button>
                <Button variant="ghost"
                  className="btn btn-line"
                  onClick={() => {
                    if (window.confirm("Clear every saved finish choice and return the home to its starting finishes?")) {
                      designStore.resetHome();
                      setMsg("All rooms reset.");
                    }
                  }}
                >
                  Reset home
                </Button>
              </div>
              <p className="mt-2 text-[13px] text-muted-foreground" role="status">
                {msg || (s.storageOk ? "Choices are saved in this browser only." : "This browser is not allowing storage, so choices will clear when the page closes.")}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
