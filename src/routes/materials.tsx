import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Figure, PageIntro } from "@/components/site/Figure";
import { MaterialPhoto } from "@/components/site/MaterialPhoto";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import { designStore, useDesign } from "@/lib/design-store";
import { materialPhoto } from "@/lib/material-photos";
import { FINISHES, ROOMS, type Category } from "@/lib/rooms";
import { pageHead } from "@/lib/site-config";
import { KitchenRestyle } from "@/components/restyle/KitchenRestyle";

export const Route = createFileRoute("/materials")({
  head: () =>
    pageHead(
      "/materials",
      "Materials & Finishes | Oakline Custom Homes",
      "Save a room-by-room inspiration board with real photographs of wood grain, painted plaster, stone tile, stone surfaces and brushed metal.",
    ),
  component: Materials,
});

const CARE: Record<Category, { intro: string; care: string; photo: string; caption: string }> = {
  floor: {
    intro: "Floors cover the most area in a house, so their tone sets the whole palette. Light wood keeps the palette bright; richer brown wood has more visible movement. Stone tile adds variation and suits baths and entries.",
    care: "Wood floors take wear best with a matte finish that hides fine scratches and can be screened and recoated in place. Expect wood to shift slightly in color with sunlight over the first year. Stone and tile need sealed grout lines in wet rooms.",
    photo: "oakline-04",
    caption: "Light oak floors and stair treads in an open living room.",
  },
  wall: {
    intro: "Wall surfaces change with the light. Compare pale painted plaster, warm gray plaster and muted green paint with your flooring and furniture before choosing actual products.",
    care: "We generally recommend a washable eggshell in halls and kitchens and a flat or matte finish in bedrooms. Darker colors show touch-up patches more, so keep a labeled can for each room.",
    photo: "oakline-12",
    caption: "Warm white walls with dark wood beams overhead.",
  },
  cabinet: {
    intro: "Cabinetry occupies a large part of the room. Compare light wood grain, richer brown grain and muted green paint as starting points; these photographs do not specify a cabinet species or product.",
    care: "Wood cabinet faces are wiped with a damp cloth and dried; avoid abrasive pads. Painted doors can chip at edges over years of use, and those chips can be touched up. Wood darkens or warms gradually with light.",
    photo: "oakline-07",
    caption: "Painted shaker cabinets beside a walnut island.",
  },
  counter: {
    intro: "Stone varies from one slab or tile to another. These pale and dark surface photographs show tonal movement, not a specified countertop product. Confirm suitability, finish and maintenance with the supplier.",
    care: "Engineered quartz is non-porous but should not take hot pans directly. Natural stone usually needs periodic sealing; honed finishes develop a patina rather than staying uniform.",
    photo: "oakline-06",
    caption: "Pale quartz counters on white cabinets and a walnut base.",
  },
  fixture: {
    intro: "Hardware and fixtures are touched every day. The photographed silver-toned metal shows the fine lines of a brushed surface; the alloy and product are not specified.",
    care: "Clean metal finishes with the product manufacturer’s approved method. Avoid abrasive pads that can alter brushed detail or damage a protective coating.",
    photo: "oakline-11",
    caption: "Wall-mounted fixtures over a vessel sink.",
  },
};

function Materials() {
  const state = useDesign();
  const [selectedRoom, setSelectedRoom] = useState<(typeof ROOMS)[number]["id"]>("kitchen");
  const [notice, setNotice] = useState("");
  useEffect(() => designStore.hydrate(), []);
  const apply = (cat: Category, value: string, roomId: string) => {
    const room = ROOMS.find((r) => r.id === roomId);
    if (!room) return;
    designStore.setFinish(room.id, cat, value);
    setNotice(`${FINISHES[cat].options.find((o) => o.id === value)?.name} saved for ${room.name}.`);
  };
  return (
    <>
      <PageIntro eyebrow="Material library" title="Materials & Finishes">
        Photographs of real materials for your own home. These are references, not specified products. Try cabinets and counters on a real kitchen, then save choices room by room.
      </PageIntro>
      <KitchenRestyle />
      <section className="wrap mt-8" aria-labelledby="board-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="board-title" className="text-[28px]">Your inspiration board</h2>
          <Button variant="ghost" onClick={() => { designStore.resetHome(); setNotice("Choices reset to the starting palette."); }}><Trash2 />Reset choices</Button>
        </div>
        <label htmlFor="board-room" className="mt-4 block text-[14px] font-semibold">Room</label>
        <select id="board-room" className="field mt-1 max-w-xs" value={selectedRoom} onChange={(e) => { const room = ROOMS.find((r) => r.id === e.target.value); if (room) setSelectedRoom(room.id); }}>
          {ROOMS.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
        </select>
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ROOMS.find((room) => room.id === selectedRoom)?.categories.map((cat) => {
            const option = FINISHES[cat].options.find((o) => o.id === state.design[selectedRoom][cat]);
            return option ? <li key={cat}><MaterialPhoto category={cat} id={option.id} /><p className="mt-2 text-[13px] text-muted-foreground">{FINISHES[cat].label}</p><p className="text-[14px] font-semibold">{option.name}</p></li> : null;
          })}
        </ul>
        <p role="status" className="mt-3 text-[14px] text-muted-foreground">{!state.storageOk ? "This browser blocks storage; choices stay on this page only." : notice || "Choices are saved in this browser on this device."}</p>
      </section>
      <div className="wrap section">
        {(Object.keys(FINISHES) as Category[]).map((cat) => {
          const rooms = ROOMS.filter((r) => r.categories.includes(cat));
          return (
            <section key={cat} className="border-t border-primary py-8 first:border-t-0 first:pt-0" aria-labelledby={`m-${cat}`}>
              <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                <div>
                  <div className="panel">
                    <h2 id={`m-${cat}`} className="text-[28px]">{FINISHES[cat].label}</h2>
                    <p className="mt-2">{CARE[cat].intro}</p>
                    <h3 className="mt-4 font-sans text-[15px] font-semibold">Living with it</h3>
                    <p className="mt-1 text-[15px] text-muted-foreground">{CARE[cat].care}</p>
                  </div>
                  <Figure k={CARE[cat].photo} caption={CARE[cat].caption} className="mt-4" ratio="16/10" />
                </div>
                <ul className="grid content-start items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {FINISHES[cat].options.map((o) => (
                    <li key={o.id} className="flex min-w-0 flex-col">
                      <MaterialPhoto category={cat} id={o.id} />
                      <h3 className="mt-3 font-display text-[20px]">{o.name}</h3>
                      <p className="mt-1 text-[15px] text-muted-foreground">{o.note}</p>
                      <a className="mt-2 text-[12px] text-muted-foreground underline underline-offset-4" href={materialPhoto(cat, o.id).source} target="_blank" rel="noopener noreferrer">Photo source</a>
                      <label className="mt-3 text-[14px] font-semibold" htmlFor={`apply-${cat}-${o.id}`}>Save for room</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <select id={`apply-${cat}-${o.id}`} className="field min-w-0 basis-full text-[15px]" defaultValue={rooms[0]?.id}>
                          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <Button
                          className="min-h-11 px-3"
                          onClick={() => {
                            const sel = document.getElementById(`apply-${cat}-${o.id}`);
                            if (sel instanceof HTMLSelectElement) apply(cat, o.id, sel.value);
                          }}
                        >
                          <Bookmark />Save
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground">Colors vary by display and lighting. We confirm every finish with physical samples.</p>
            </section>
          );
        })}
      </div>
    </>
  );
}
