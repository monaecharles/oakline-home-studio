import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Figure, PageIntro } from "@/components/site/Figure";
import { designStore } from "@/lib/design-store";
import { FINISHES, ROOMS, type Category } from "@/lib/rooms";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/materials")({
  head: () =>
    pageHead(
      "/materials",
      "Materials & Finishes | Oakline Custom Homes",
      "Oak and walnut floors, ivory, greige and sage walls, oak, walnut and forest cabinetry, quartz and charcoal stone counters, brass and black hardware.",
    ),
  component: Materials,
});

const CARE: Record<Category, { intro: string; care: string; photo: string; caption: string }> = {
  floor: {
    intro: "Floors cover the most area in a house, so their tone sets the whole palette. Oak reads light and even; walnut is darker with more movement; limestone-look tile is cool underfoot and suits baths and entries.",
    care: "Wood floors take wear best with a matte finish that hides fine scratches and can be screened and recoated in place. Expect wood to shift slightly in color with sunlight over the first year. Stone and tile need sealed grout lines in wet rooms.",
    photo: "oakline-04",
    caption: "Light oak flooring through an open kitchen and living area.",
  },
  wall: {
    intro: "Wall color changes more with light than any other finish. Ivory stays warm in north light, greige settles down in the evening, and sage pairs well with oak and brass.",
    care: "We generally recommend a washable eggshell in halls and kitchens and a flat or matte finish in bedrooms. Darker colors show touch-up patches more, so keep a labeled can for each room.",
    photo: "oakline-12",
    caption: "Soft neutral walls with layered textiles.",
  },
  cabinet: {
    intro: "Cabinetry is the largest piece of furniture you will buy. Oak gives an even linear grain, walnut is richer and darker, and a painted forest green makes the kitchen the focal point of an open plan.",
    care: "Wood cabinet faces are wiped with a damp cloth and dried; avoid abrasive pads. Painted doors can chip at edges over years of use, and those chips can be touched up. Wood darkens or warms gradually with light.",
    photo: "oakline-07",
    caption: "Cabinetry fronts with integrated hardware.",
  },
  counter: {
    intro: "Ivory quartz brightens a kitchen and shows little pattern. Charcoal stone has a soft matte surface that feels quieter and hides crumbs, but shows water rings and fingerprints more readily.",
    care: "Engineered quartz is non-porous but should not take hot pans directly. Natural stone usually needs periodic sealing; honed finishes develop a patina rather than staying uniform.",
    photo: "oakline-06",
    caption: "Long kitchen counter with wood cabinetry below.",
  },
  fixture: {
    intro: "Hardware and fixtures are small but they are touched every day. Brushed brass is warm and softens with use; matte black is graphic and reads clearly against light walls.",
    care: "Unlacquered brass develops a living patina; lacquered brass stays brighter. Matte black hides water spots better than polished finishes but can show wear on edges after many years of heavy use.",
    photo: "oakline-11",
    caption: "Vanity with a round mirror and warm metal accents.",
  },
};

function Grain({ color, cat, id }: { color: string; cat: Category; id: string }) {
  const wood = (cat === "floor" && id !== "limestone") || (cat === "cabinet" && id !== "forest");
  const bg = wood
    ? `repeating-linear-gradient(0deg, ${color} 0 7px, color-mix(in oklab, ${color} 86%, black) 7px 8px, ${color} 8px 15px, color-mix(in oklab, ${color} 92%, white) 15px 17px)`
    : cat === "fixture"
      ? `linear-gradient(135deg, color-mix(in oklab, ${color} 80%, white), ${color} 45%, color-mix(in oklab, ${color} 75%, black))`
      : `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${color} 92%, white), ${color} 60%)`;
  return <span className="block aspect-[4/3] border border-ink/25" style={{ background: bg }} aria-hidden />;
}

function Materials() {
  const navigate = useNavigate();
  useEffect(() => designStore.hydrate(), []);
  const apply = (cat: Category, value: string, roomId: string) => {
    const room = ROOMS.find((r) => r.id === roomId);
    if (!room) return;
    designStore.setFinish(room.id, cat, value);
    designStore.select(room.id);
    designStore.set({ mode: "3d" });
    navigate({ to: "/explore-home", search: { room: room.id } });
  };
  return (
    <>
      <PageIntro eyebrow="Material library" title="Materials & Finishes">
        The palette we start most homes from. Every finish below can be tried in the 3D home. Choose a room next to a finish and the viewer opens with it applied.
      </PageIntro>
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
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {FINISHES[cat].options.map((o) => (
                    <li key={o.id} className="flex flex-col border border-border bg-card p-3">
                      <Grain color={o.color} cat={cat} id={o.id} />
                      <h3 className="mt-3 font-display text-[20px]">{o.name}</h3>
                      <p className="mt-1 flex-1 text-[15px] text-muted-foreground">{o.note}</p>
                      <label className="mt-3 text-[14px] font-semibold" htmlFor={`apply-${cat}-${o.id}`}>Apply in room</label>
                      <div className="mt-1 flex gap-2">
                        <select id={`apply-${cat}-${o.id}`} className="field min-w-0 flex-1 text-[15px]" defaultValue={rooms[0].id}>
                          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <button
                          className="btn btn-solid px-3"
                          onClick={() => {
                            const sel = document.getElementById(`apply-${cat}-${o.id}`) as HTMLSelectElement;
                            apply(cat, o.id, sel.value);
                          }}
                        >
                          Apply
                        </button>
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
