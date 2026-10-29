import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { designStore, useDesign, INQUIRY_PREFILL_KEY } from "@/lib/design-store";
import { ROOMS, designSummary, finishSchedule, roomById } from "@/lib/rooms";
import { download } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Swatches } from "@/components/three/Swatches";

export function TourControls() {
  const s = useDesign();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  useEffect(() => { designStore.hydrate(); if (!designStore.get?.().selected) designStore.select("living"); }, []);
  const room = roomById(s.selected);

  const toInquiry = () => {
    const text = `Finish selections:\n${designSummary(s.design)}`;
    try { sessionStorage.setItem(INQUIRY_PREFILL_KEY, text); } catch { (window as unknown as { __oaklinePrefill?: string }).__oaklinePrefill = text; }
    navigate({ to: "/contact" });
  };

  return (
    <div className="space-y-6">
      <section aria-label="Rooms">
        <h3 className="text-[20px]">Rooms</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ROOMS.map((r) => (
            <Button key={r.id} variant="ghost" aria-pressed={s.selected === r.id} onClick={() => designStore.select(r.id)}
              className={`min-h-[44px] justify-start border px-3 text-[14px] ${s.selected === r.id ? "border-primary bg-secondary font-semibold" : "border-border"}`}>
              {r.name}
            </Button>
          ))}
        </div>
      </section>
      {room && (
        <section aria-live="polite">
          <h3 className="text-[20px]">{room.name} finishes</h3>
          <p className="mt-2 mb-3 text-[15px] text-muted-foreground">{room.blurb}</p>
          <Swatches room={room.id} />
          <Button variant="link" className="mt-2 px-0" onClick={() => window.confirm(`Reset ${room.name} to its starting finishes?`) && designStore.resetRoom(room.id)}>Reset this room</Button>
        </section>
      )}
      <section aria-label="Your finish schedule">
        <h3 className="text-[20px]">Your finish schedule</h3>
        <ul className="mt-2 space-y-1 text-[14px]">{designSummary(s.design).split("\n").map((l) => <li key={l}>{l}</li>)}</ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={toInquiry}>Use this design in my inquiry</Button>
          <Button variant="outline" onClick={() => download("oakline-finish-schedule.json", JSON.stringify(finishSchedule(s.design), null, 2), "application/json")}>Download schedule</Button>
          <Button variant="outline" onClick={() => window.print()}>Print summary</Button>
          <Button variant="outline" onClick={() => { if (window.confirm("Return every room to its starting finishes?")) { designStore.resetHome(); setMsg("All rooms reset."); } }}>Reset home</Button>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground" role="status">{msg || (s.storageOk ? "Choices are saved in this browser only." : "This browser is not allowing storage, so choices will clear when the page closes.")}</p>
      </section>
    </div>
  );
}
