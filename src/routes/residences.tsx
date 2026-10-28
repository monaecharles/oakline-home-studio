import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Figure, PageIntro } from "@/components/site/Figure";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/residences")({
  head: () =>
    pageHead(
      "/residences",
      "Residences | Oakline Custom Homes design studies",
      "Three Oakline design studies: The Alder House, The Courtyard Residence and The Ridge Retreat, with planning priorities, rooms and photographs.",
    ),
  component: Residences,
});

type Style = "Warm contemporary" | "Indoor-outdoor" | "Wooded retreat";
type Priority = "Family living" | "Entertaining" | "Compact footprint";

const STUDIES: {
  id: string;
  name: string;
  style: Style;
  priorities: Priority[];
  summary: string;
  body: string[];
  plan: string[];
  rooms: { id: string; name: string; note: string }[];
  photos: { k: string; caption: string }[];
}[] = [
  {
    id: "alder",
    name: "The Alder House",
    style: "Warm contemporary",
    priorities: ["Family living", "Entertaining"],
    summary: "A two-story family home of about 3,400 square feet on a suburban lot.",
    body: [
      "The Alder House starts from how a family of five moves through a weekday. The garage opens to a mudroom with a bench, cubbies and a laundry sink, so wet shoes and sports bags stop before the kitchen. The kitchen is the middle of the plan, with a 12-foot island that seats four on one side and leaves the cook facing the family room.",
      "Upstairs, the children's rooms share a bath with a split vanity and a separate shower room, and the primary suite sits over the garage, away from the stairs. The exterior is brick and painted board with deep window returns and a standing-seam porch roof. Interiors use white oak floors, greige walls and walnut in the places hands touch: stair rail, island end panels and the built-in desk.",
    ],
    plan: ["Mudroom between garage and kitchen", "Island facing the family room", "Primary suite away from the stair", "Homework desk within sight of the kitchen"],
    rooms: [
      { id: "alder-kitchen", name: "Kitchen", note: "12-foot island, walk-in pantry behind a pocket door." },
      { id: "alder-mudroom", name: "Mudroom", note: "Bench, five cubbies, laundry sink and a dog wash." },
      { id: "alder-primary", name: "Primary suite", note: "Over the garage, with a dressing room between bed and bath." },
    ],
    photos: [
      { k: "oakline-02", caption: "Two-story massing with a lit interior at dusk." },
      { k: "oakline-04", caption: "Open kitchen and living space with light wood floors." },
      { k: "oakline-07", caption: "Cabinetry and counter detail." },
    ],
  },
  {
    id: "courtyard",
    name: "The Courtyard Residence",
    style: "Indoor-outdoor",
    priorities: ["Entertaining", "Family living"],
    summary: "A single-level home of about 2,900 square feet arranged around a planted courtyard.",
    body: [
      "The Courtyard Residence is a U-shaped plan wrapped around a garden about 30 by 24 feet. Living, dining and the primary suite each face the courtyard through wide sliding doors, while the street side stays quiet with smaller, higher windows. On a mild evening the doors open and the courtyard becomes the largest room in the house.",
      "Deep roof overhangs shade the glass from the high summer sun and let low winter light reach the floors. The kitchen sits at the corner where the two wings meet, so it serves the dining room and a covered outdoor kitchen equally. Limestone-look porcelain runs from inside to out at the same level, and ceilings are lined in oak to warm the long sightlines.",
    ],
    plan: ["Every main room faces the courtyard", "Level threshold from inside to out", "Covered outdoor kitchen", "Quiet street elevation"],
    rooms: [
      { id: "courtyard-living", name: "Living room", note: "Two walls of sliding glass, oak-lined ceiling." },
      { id: "courtyard-dining", name: "Dining room", note: "Seats ten, opens to the outdoor kitchen." },
      { id: "courtyard-garden", name: "Courtyard", note: "Planted beds, a shade tree and a gravel terrace." },
    ],
    photos: [
      { k: "oakline-03", caption: "Tall glazing and a wood ceiling in an open living space." },
      { k: "oakline-09", caption: "Living and dining under one ceiling." },
      { k: "oakline-05", caption: "Clean rooflines and large windows on a contemporary exterior." },
    ],
  },
  {
    id: "ridge",
    name: "The Ridge Retreat",
    style: "Wooded retreat",
    priorities: ["Compact footprint"],
    summary: "A compact home of about 1,800 square feet for a sloped, wooded lot.",
    body: [
      "The Ridge Retreat is designed to disturb as little of its site as possible. The footprint is narrow and set along the contour, so most of the hillside and its hardwoods stay in place. The entry is at road level and the living spaces step down half a level toward the view, with a screened porch cantilevered over the slope.",
      "Two bedrooms and a flexible studio fit within one compact wing, sharing a generous bath. Storage is built into window seats, stair risers and a long hall wall. Materials are chosen to sit quietly in the woods: dark stained cladding, black window frames, walnut cabinetry and a sage-painted reading nook. Everything is sized to be heated, cooled and cleaned without effort.",
    ],
    plan: ["Footprint follows the contour", "Living steps down toward the view", "Screened porch over the slope", "Built-in storage throughout"],
    rooms: [
      { id: "ridge-living", name: "Living room", note: "Half a level down, facing the trees." },
      { id: "ridge-porch", name: "Screened porch", note: "Cantilevered, with a ceiling fan and daybed." },
      { id: "ridge-studio", name: "Studio", note: "Desk, guest daybed and a window seat." },
    ],
    photos: [
      { k: "oakline-10", caption: "A modern house set among mature trees." },
      { k: "oakline-12", caption: "Layered textiles and a quiet seating corner." },
      { k: "oakline-08", caption: "Wood console, ceramics and books." },
    ],
  },
];

const STYLES: Style[] = ["Warm contemporary", "Indoor-outdoor", "Wooded retreat"];
const PRIORITIES: Priority[] = ["Family living", "Entertaining", "Compact footprint"];

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button aria-pressed={on} onClick={onClick} className={`min-h-[44px] border px-3 text-[14px] ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
      {children}
    </button>
  );
}

function Residences() {
  const [style, setStyle] = useState<Style | null>(null);
  const [prio, setPrio] = useState<Priority | null>(null);
  const reduce = useReducedMotion();
  const list = STUDIES.filter((s) => (!style || s.style === style) && (!prio || s.priorities.includes(prio)));
  return (
    <>
      <PageIntro eyebrow="Design studies" title="Residences">
        Three homes we have designed in full as studies of how different households and sites shape a plan. Each one shows the priorities we planned around, the rooms that carry them and the materials we would specify.
      </PageIntro>
      <section className="wrap mt-6" aria-label="Filter design studies">
        <div className="flex flex-col gap-3 border-y border-border py-3 md:flex-row md:flex-wrap md:items-center">
          <span className="text-[14px] font-semibold">Style</span>
          <div className="flex flex-wrap gap-2">
            <Chip on={!style} onClick={() => setStyle(null)}>All</Chip>
            {STYLES.map((s) => <Chip key={s} on={style === s} onClick={() => setStyle(s)}>{s}</Chip>)}
          </div>
          <span className="text-[14px] font-semibold md:ml-4">Living priority</span>
          <div className="flex flex-wrap gap-2">
            <Chip on={!prio} onClick={() => setPrio(null)}>All</Chip>
            {PRIORITIES.map((p) => <Chip key={p} on={prio === p} onClick={() => setPrio(p)}>{p}</Chip>)}
          </div>
        </div>
        <p className="mt-2 text-[14px] text-muted-foreground" role="status">Showing {list.length} of 3 studies</p>
      </section>
      <div className="wrap pb-10">
        <AnimatePresence initial={false}>
          {list.length === 0 && (
            <p className="panel mt-6">No study matches both filters. Try a different living priority.</p>
          )}
          {list.map((s) => (
            <motion.article
              key={s.id}
              id={s.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              className="section scroll-mt-20 border-b border-primary"
              aria-labelledby={`${s.id}-t`}
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <div className="panel">
                  <p className="eyebrow">Design study · {s.style}</p>
                  <h2 id={`${s.id}-t`} className="mt-2 text-[32px]">{s.name}</h2>
                  <p className="mt-2 font-semibold">{s.summary}</p>
                  {s.body.map((p, i) => <p key={i} className="mt-3 measure">{p}</p>)}
                  <h3 className="mt-5 border-t border-border pt-3 font-sans text-[15px] font-semibold">Planning priorities</h3>
                  <ul className="mt-2 list-disc pl-5 text-[15px]">
                    {s.plan.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <nav aria-label={`${s.name} rooms`} className="mt-4 flex flex-wrap gap-2">
                    {s.rooms.map((r) => <a key={r.id} href={`#${r.id}`} className="text-[14px] font-semibold text-primary underline underline-offset-4">{r.name}</a>)}
                  </nav>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Figure k={s.photos[0]!.k} caption={s.photos[0]!.caption} className="col-span-2" ratio="16/9" />
                  <Figure k={s.photos[1]!.k} caption={s.photos[1]!.caption} ratio="4/3" sizes="(min-width:1024px) 25vw, 50vw" />
                  <Figure k={s.photos[2]!.k} caption={s.photos[2]!.caption} ratio="4/3" sizes="(min-width:1024px) 25vw, 50vw" />
                </div>
              </div>
              <dl className="mt-6 grid border border-border md:grid-cols-3">
                {s.rooms.map((r) => (
                  <div key={r.id} id={r.id} className="scroll-mt-20 border-border p-4 md:[&:not(:last-child)]:border-r [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0">
                    <dt className="font-display text-[19px]">{r.name}</dt>
                    <dd className="mt-1 text-[15px] text-muted-foreground">{r.note}</dd>
                  </div>
                ))}
              </dl>
            </motion.article>
          ))}
        </AnimatePresence>
        <div className="panel mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="measure">Want to see how finishes change a room? The 3D study home lets you swap floors, walls and cabinetry room by room.</p>
          <Link to="/explore-home" className="btn btn-solid">Explore the home in 3D</Link>
        </div>
      </div>
    </>
  );
}
