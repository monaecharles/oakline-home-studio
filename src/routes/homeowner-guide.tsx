import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Figure, PageIntro } from "@/components/site/Figure";
import { LazyCompare } from "@/components/three/LazyViewer";
import { download } from "@/lib/download";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/homeowner-guide")({
  head: () =>
    pageHead(
      "/homeowner-guide",
      "Homeowner Guide | Oakline Custom Homes",
      "Answers on planning, site information, design decisions, budget changes and construction scheduling, plus a downloadable project brief and printable checklist.",
    ),
  component: Guide,
});

const FAQ: { group: string; items: [string, string][] }[] = [
  {
    group: "Initial planning",
    items: [
      ["How early should we contact you?", "As soon as you are seriously considering a project, even before you own a lot. Site & Scope work is most useful before you commit to land or a house, because it shows what the property can realistically hold."],
      ["How long does a custom home take from first conversation to move-in?", "For most new homes, design and permitting take roughly six to nine months and construction another ten to sixteen months. Renovations and additions are usually shorter. We give you a project-specific schedule during Site & Scope."],
    ],
  },
  {
    group: "Site information",
    items: [
      ["What do you need to know about our property?", "A recent boundary survey if you have one, any HOA guidelines, and what you know about drainage, septic or sewer, and large trees. We do not need private documents at the first conversation; general information is enough to begin."],
      ["Does a sloped or wooded lot rule out a custom home?", "No. Slope and trees shape the plan and the foundation, and they affect cost, but many of the best homes are on difficult sites. The Ridge Retreat study shows one approach."],
    ],
  },
  {
    group: "Design decisions",
    items: [
      ["How many decisions will we need to make?", "Usually several hundred, from plan layout down to cabinet pulls. We group them by phase and room so you are never deciding everything at once, and we bring a short list of options to each meeting."],
      ["Can we use the 3D model to choose finishes?", "Yes, as a starting point. The model shows how floor, wall, cabinet and counter choices work together. Final selections are always confirmed with physical samples, because screens shift color."],
    ],
  },
  {
    group: "Budget changes",
    items: [
      ["What happens if we want to change something during construction?", "We write up the change with its cost and schedule effect. Nothing proceeds until you approve it in writing. Approved changes are added to a running log so the budget is always current."],
      ["How do you handle cost increases outside our control?", "We flag price movement on major materials as soon as we see it and offer alternatives. A contingency line in the budget covers unknowns such as rock or rot found once work begins."],
    ],
  },
  {
    group: "Construction scheduling",
    items: [
      ["How will we know what is happening on site?", "Your project lead sends a weekly update with photos, work completed, the next two weeks of work and any decisions due. You can also schedule site walks with us."],
      ["Do we need to move out for a renovation?", "For whole-home renovations, usually yes, because power, water and HVAC are interrupted. For additions, many families stay in place with a planned temporary kitchen or bath."],
    ],
  },
  {
    group: "Preparing for consultation",
    items: [
      ["What should we bring to the first conversation?", "Your project brief, a few photos of homes or rooms you like and dislike, a rough budget range and a sense of timing. Download the brief below and fill it in together."],
      ["Is there a cost for the first conversation?", "No. The first conversation is how we both decide whether the project is a good fit. Site & Scope is a paid phase with a written proposal."],
    ],
  },
];

const CHECKLIST = [
  "Write down who will live in the home and how that may change in ten years",
  "List the rooms you use most and what frustrates you about them",
  "Collect photos of homes and rooms you like, and a few you do not",
  "Note the property's general location, size and any HOA guidelines",
  "Decide on a broad budget range you are comfortable discussing",
  "Agree on a preferred move-in season",
  "Choose who in the household will make final decisions",
];

const BRIEF = `OAKLINE CUSTOM HOMES — PROJECT BRIEF
Fill this in before your first conversation. Keep it general; no private documents are needed.

PROJECT TYPE (custom home / major addition / interior renovation):

GENERAL AREA (city or neighborhood):

PROPERTY STATUS (own the lot or house / under contract / still looking):

WHO WILL LIVE HERE:

HOW YOU LIVE DAY TO DAY (mornings, cooking, work, guests):

ROOMS THAT MATTER MOST:

WHAT FRUSTRATES YOU ABOUT YOUR CURRENT HOME:

MATERIALS AND STYLES YOU ARE DRAWN TO:

BROAD BUDGET RANGE:

PREFERRED TIMING:

QUESTIONS FOR THE STUDIO:

Checklist
${CHECKLIST.map((c) => `[ ] ${c}`).join("\n")}
`;

function Guide() {
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  return (
    <>
      <PageIntro eyebrow="Before you build" title="Homeowner Guide">
        What to expect from planning through construction, and how to prepare so the first conversation is productive.
      </PageIntro>
      <section className="wrap section" aria-labelledby="faq">
        <h2 id="faq" className="text-[30px]">Questions homeowners ask</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            {FAQ.map((g) => (
              <div key={g.group} className="border border-border bg-card">
                <h3 className="border-b border-border px-4 py-3 text-[22px] md:px-6">{g.group}</h3>
                {g.items.map(([q, a]) => (
                  <details key={q} className="group border-b border-border/70 last:border-b-0">
                    <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold md:px-6">
                      {q}
                      <span aria-hidden className="text-brass group-open:rotate-45">+</span>
                    </summary>
                    <p className="measure px-4 pb-4 md:px-6">{a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
          <aside className="space-y-5" aria-label="Planning tools">
            <div className="panel">
              <h2 className="text-[24px]">Project brief</h2>
              <p className="mt-2">A one-page text file with the questions we will ask in the first conversation. Fill it in at your own pace.</p>
              <button className="btn btn-solid mt-3" onClick={() => download("oakline-project-brief.txt", BRIEF)}>Download project brief</button>
            </div>
            <div className="panel print-area">
              <h2 className="text-[24px]">Consultation checklist</h2>
              <ul className="mt-3 space-y-2">
                {CHECKLIST.map((c, i) => (
                  <li key={c}>
                    <label className="flex min-h-[44px] items-start gap-3 text-[15px]">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 accent-[var(--primary)]"
                        checked={checked[i]}
                        onChange={() => setChecked((p) => p.map((v, j) => (j === i ? !v : v)))}
                      />
                      {c}
                    </label>
                  </li>
                ))}
              </ul>
              <button className="btn btn-line no-print mt-3" onClick={() => window.print()}>Print checklist</button>
            </div>
            <Figure k="oakline-04" caption="An open kitchen and living area of the kind many first conversations begin with." ratio="4/3" />
          </aside>
        </div>
      </section>
      <section className="wrap section pt-0" aria-labelledby="compare">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div className="panel">
            <h2 id="compare" className="text-[26px]">Warm oak or deep walnut?</h2>
            <p className="mt-2">
              Both images are rendered from the same camera in our 3D study home, with only the floor and kitchen cabinetry changed. Drag the divider to compare. Oak keeps the room bright and lets furniture stand out; walnut makes the room feel more enclosed and puts the wood itself on display.
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">Colors vary by display and lighting.</p>
            <Link to="/explore-home" search={{ room: "kitchen" }} className="mt-3 inline-block font-semibold text-primary underline underline-offset-4">Try it yourself in the kitchen</Link>
          </div>
          <LazyCompare />
        </div>
      </section>
    </>
  );
}
