import { createFileRoute, Link } from "@tanstack/react-router";
import { Figure, PageIntro } from "@/components/site/Figure";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/studio")({
  head: () =>
    pageHead(
      "/studio",
      "Our Studio | Oakline Custom Homes",
      "Meet Julian Mercer, Nadia Brooks and Evan Cole, the team behind Oakline Custom Homes in metro Atlanta.",
    ),
  component: Studio,
});

const TEAM = [
  {
    name: "Julian Mercer",
    role: "Founder and design director",
    photo: "oakline-03",
    caption: "Glass partitions and an open stair keep a dining room connected to the house.",
    bio: "Julian starts every project with a tape measure and a notebook, not a portfolio. He asks where the morning light lands, where groceries get set down and which room gets used for homework. His plans favor fewer, better-proportioned rooms over more square footage. He leads concept design on every Oakline home and stays involved through the final walkthrough, because he believes a drawing is only as good as the room it becomes.",
  },
  {
    name: "Nadia Brooks",
    role: "Project lead",
    photo: "oakline-10",
    caption: "A house among mature trees, where site work is planned around the roots.",
    bio: "Nadia is your main contact once design turns into construction. She builds the schedule, coordinates trades and inspections, and writes the weekly update every client receives. She is known for turning a change request into a clear one-page note with cost, time and a decision date. Her goal is simple: no surprises on site, and no question from a homeowner left waiting more than a day for an answer.",
  },
  {
    name: "Evan Cole",
    role: "Materials coordinator",
    photo: "oakline-08",
    caption: "Sage paint, rattan and oak working together in one room.",
    bio: "Evan runs the material library and the finish schedule. He pulls physical samples for each room, lays them out under daylight and warm evening light, and records every choice so the site crew builds exactly what was selected. He tracks lead times early so a backordered tile does not hold up a kitchen. He also keeps the 3D model's finishes in step with the samples clients approve.",
  },
];

function Studio() {
  return (
    <>
      <PageIntro eyebrow="Who you will work with" title="Our Studio">
        Oakline is a small studio by design. The same three people you meet in the first conversation are the ones drawing your plan, choosing materials with you and running the site.
      </PageIntro>
      <section className="wrap section" aria-label="Team">
        <div className="space-y-6">
          {TEAM.map((t, i) => (
            <article key={t.name} className={`grid gap-0 border border-border lg:grid-cols-2 ${i % 2 ? "lg:[&>figure]:order-2" : ""}`}>
              <Figure k={t.photo} caption={t.caption} className="border-0" ratio="16/10" />
              <div className="flex flex-col justify-center p-5 md:p-7 lg:border-l">
                <p className="eyebrow">{t.role}</p>
                <h2 className="mt-2 text-[30px]">{t.name}</h2>
                <p className="mt-3 measure">{t.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap section pt-0" aria-labelledby="values">
        <div className="grid gap-0 border-y border-primary md:grid-cols-3">
          {[
            ["Plans that fit the site", "We design to the lot you have, keeping trees, drainage and sun angles in mind from the first sketch."],
            ["Decisions in writing", "Every selection and every change is recorded, with its cost, before work proceeds."],
            ["Materials that age well", "We favor wood, stone and metal finishes that wear in rather than wear out."],
          ].map(([t, d]) => (
            <div key={t} className="border-border p-5 md:[&:not(:last-child)]:border-r">
              <h2 id={t === "Plans that fit the site" ? "values" : undefined} className="text-[21px]">{t}</h2>
              <p className="mt-2 text-[15px] text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/contact" className="btn btn-solid">Request a consultation</Link>
        </div>
      </section>
    </>
  );
}
