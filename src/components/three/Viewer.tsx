import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { designStore, useDesign, INQUIRY_PREFILL_KEY } from "@/lib/design-store";
import { DEFAULT_DESIGN, FINISHES, ROOMS, designSummary, finishSchedule, roomById, type RoomId } from "@/lib/rooms";
import { PHOTOS, photoUrl } from "@/lib/photos";
import { FloorPlan } from "./FloorPlan";
import type { RigApi } from "./Scene";
import { HOME_VIEW } from "./scene-constants";

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
  const r = roomById(room)!;
  return (
    <div className="space-y-4">
      {r.categories.map((cat) => (
        <fieldset key={cat}>
          <legend className="text-[14px] font-semibold">{FINISHES[cat].label}</legend>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={`${FINISHES[cat].label} for ${r.name}`}>
            {FINISHES[cat].options.map((o) => {
              const on = s.design[room][cat] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => designStore.setFinish(room, cat, o.id)}
                  className={`flex min-h-[44px] items-center gap-2 border px-2 py-1 text-[14px] ${on ? "border-2 border-primary bg-secondary font-semibold" : "border-border bg-card"}`}
                >
                  <span className="h-6 w-6 border border-ink/30" style={{ background: o.color }} aria-hidden />
                  {o.name}
                  {on && <span aria-hidden>✓</span>}
                </button>
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

  const tool = "btn btn-line min-h-[44px] bg-card px-3 text-[14px]";

  return (
    <div
      className={full ? "fixed inset-0 z-50 flex flex-col bg-background" : "border border-primary bg-card"}
      role={full ? "dialog" : undefined}
      aria-modal={full || undefined}
      aria-label={full ? "3D home viewer, full screen" : undefined}
    >
      {full && (
        <div className="flex items-center justify-between border-b border-primary px-4 py-2">
          <span className="font-display text-lg">Oakline home in 3D</span>
          <button className="btn btn-solid" onClick={() => setFull(false)} autoFocus>Exit full screen</button>
        </div>
      )}
      <div className={`grid ${full ? "min-h-0 flex-1" : ""} ${compact ? "" : "lg:grid-cols-[65fr_35fr]"}`}>
        {/* Canvas column */}
        <div className="flex min-w-0 flex-col border-b border-primary lg:border-b-0 lg:border-r">
          <nav aria-label="Viewer location" className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-[14px]">
            <button className={`underline-offset-4 ${sel ? "underline" : "font-semibold"}`} onClick={() => select(null)}>Whole home</button>
            {room && (
              <>
                <span aria-hidden>/</span>
                <span className="font-semibold" aria-current="location">{room.name}</span>
              </>
            )}
            <span className="ml-auto flex gap-1" role="group" aria-label="View mode">
              {(["3d", "plan"] as const).map((m) => (
                <button key={m} aria-pressed={s.mode === m} onClick={() => designStore.set({ mode: m })} className={`min-h-[36px] border px-3 text-[14px] ${s.mode === m ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {m === "3d" ? "3D" : "Plan"}
                </button>
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
              <button className={tool} onClick={() => rig.current?.rotate(-1)}>Rotate left</button>
              <button className={tool} onClick={() => rig.current?.rotate(1)}>Rotate right</button>
              <button className={tool} onClick={() => rig.current?.zoom(0.8)} aria-label="Zoom in">Zoom in</button>
              <button className={tool} onClick={() => rig.current?.zoom(1.25)} aria-label="Zoom out">Zoom out</button>
              <button className={tool} onClick={() => (sel ? rig.current?.goTo(room!.camera.position, room!.camera.target) : rig.current?.reset())}>Reset view</button>
              <button className={tool} aria-pressed={s.roof} onClick={() => designStore.set({ roof: !s.roof })}>{s.roof ? "Roof on" : "Roof off"}</button>
              <button className={tool} aria-pressed={s.cutaway} onClick={() => designStore.set({ cutaway: !s.cutaway })}>Cutaway</button>
              <button className={tool} aria-pressed={s.evening} onClick={() => designStore.set({ evening: !s.evening })}>{s.evening ? "Evening" : "Daylight"}</button>
              {!full && <button ref={fullBtn} className={tool} onClick={() => setFull(true)}>View full screen</button>}
            </div>
          )}
        </div>

        {/* Controls column */}
        {!compact && (
          <div className={`min-w-0 ${full ? "overflow-y-auto" : ""}`}>
            <section className="border-b border-border p-4 md:p-5" aria-label="Rooms">
              <h2 className="text-[20px]">Rooms</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ROOMS.map((r) => (
                  <button
                    key={r.id}
                    aria-pressed={sel === r.id}
                    onClick={() => select(r.id)}
                    onFocus={() => setHovered(r.id)}
                    onBlur={() => setHovered(null)}
                    className={`min-h-[44px] border px-3 text-left text-[14px] ${sel === r.id ? "border-2 border-primary bg-secondary font-semibold" : "border-border"}`}
                  >
                    {r.name}
                  </button>
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
                className="border-b border-border p-4 md:p-5"
                aria-live="polite"
              >
                {room ? (
                  <>
                    <h2 className="text-[22px]">{room.name}</h2>
                    <p className="mt-2 text-[15px] text-muted-foreground">{room.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="btn btn-line" onClick={() => select(null)}>Back to whole home</button>
                      <button className="btn btn-line" aria-pressed={compare} onClick={() => setCompare((c) => !c)}>
                        {compare ? "Showing original" : "Compare with original"}
                      </button>
                    </div>
                    <div className="mt-4 flex border-b border-border" role="tablist">
                      {(["finishes", "photo"] as const).map((t) => (
                        <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-[44px] px-4 text-[14px] ${tab === t ? "border-b-2 border-primary font-semibold" : ""}`}>
                          {t === "finishes" ? "Finishes" : "Room photo"}
                        </button>
                      ))}
                    </div>
                    <div className="pt-4" role="tabpanel">
                      {tab === "finishes" ? (
                        <Swatches room={room.id} />
                      ) : (
                        <figure className="border border-border p-2">
                          <img src={photoUrl(room.photo, 960)} alt={PHOTOS[room.photo]?.alt ?? ""} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                          <figcaption className="pt-2 text-[13px] text-muted-foreground">Inspiration photograph, not the 3D room.</figcaption>
                        </figure>
                      )}
                    </div>
                    <button
                      className="mt-4 text-[14px] underline"
                      onClick={() => window.confirm(`Reset ${room.name} to its starting finishes?`) && designStore.resetRoom(room.id)}
                    >
                      Reset this room
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-[22px]">Whole home</h2>
                    <p className="mt-2 text-[15px] text-muted-foreground">
                      A single-level plan of about 600 square feet of conditioned space shown here as a study model. Drag to rotate, then choose a room on the model, in the list or on the plan to step inside and change its finishes.
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
                <button className="btn btn-solid" onClick={useInInquiry}>Use this design in my inquiry</button>
                <button className="btn btn-line" onClick={() => download("oakline-finish-schedule.json", JSON.stringify(finishSchedule(s.design), null, 2), "application/json")}>
                  Download schedule
                </button>
                <button className="btn btn-line" onClick={() => window.print()}>Print summary</button>
                <button
                  className="btn btn-line"
                  onClick={() => {
                    if (window.confirm("Clear every saved finish choice and return the home to its starting finishes?")) {
                      designStore.resetHome();
                      setMsg("All rooms reset.");
                    }
                  }}
                >
                  Reset home
                </button>
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
