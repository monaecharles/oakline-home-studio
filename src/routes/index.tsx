import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/real-house.jpg.asset.json";
import { Figure } from "@/components/site/Figure";
import { HomeWalkthrough } from "@/components/site/HomeWalkthrough";
import { MaterialPhoto } from "@/components/site/MaterialPhoto";
import { FINISHES } from "@/lib/rooms";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "/",
      "Oakline Custom Homes | Custom home design and build in Atlanta",
      "Oakline designs and builds custom homes, major additions and whole-home renovations in Atlanta, Marietta and Roswell. Watch a real-home walkthrough and collect material inspiration.",
    ),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="wrap pt-4 lg:pt-8" aria-labelledby="hero-title">
        <div className="relative overflow-hidden">
          <img src={hero.url} alt="White contemporary house with a roof terrace and pool" width={1600} height={1067} fetchPriority="high" className="h-[490px] w-full object-cover md:h-[550px]" />
          <div className="hero-shade absolute inset-0 opacity-80" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground md:max-w-[620px] md:p-10">
            <p className="text-[14px]">Built around the way you live</p>
            <h1 id="hero-title" className="mt-3 text-[38px] md:text-[54px]">Oakline Custom Homes</h1>
            <p className="mt-3 text-[20px]">Your home, considered from every angle.</p>
            <p className="mt-3 max-w-lg text-[15px]">Custom homes, major additions and whole-home renovations across metro Atlanta. One team draws the plan, chooses the materials with you and coordinates the build.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
              <Link to="/explore-home" className="btn btn-solid">Explore the home in 3D</Link>
              <Link to="/residences" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">View residences</Link>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">Real-house photography from Unsplash. Outside inspiration, not an Oakline project.</p>
      </section>

      <section className="wrap section" aria-labelledby="spreads">
        <h2 id="spreads" className="sr-only">Residence design studies</h2>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Figure k="oakline-02" className="" caption="Crisp two-story massing with a roof terrace: one reference for the Alder House's simple volumes." />
          <div className="flex flex-col justify-center p-5 md:p-7">
            <p className="eyebrow">Design study</p>
            <h3 className="mt-2 text-[28px]">The Alder House</h3>
            <p className="mt-3 measure">
              A warm contemporary family home planned around one long kitchen island, a mudroom that actually holds backpacks and boots, and bedrooms grouped away from the living wing so early risers and late readers do not collide.
            </p>
            <Link to="/residences" hash="alder" className="mt-4 self-start text-[15px] font-semibold text-primary underline underline-offset-4">Read the Alder House study</Link>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <div className="order-2 flex flex-col justify-center p-5 md:p-7 lg:order-1">
            <p className="eyebrow">Design study</p>
            <h3 className="mt-2 text-[28px]">The Courtyard Residence</h3>
            <p className="mt-3 measure">
              Rooms wrap a planted courtyard so the dining table, the living room and the primary suite each get a view of the same garden. Wide sliding doors make the courtyard a room for nine months of the Georgia year.
            </p>
            <Link to="/residences" hash="courtyard" className="mt-4 self-start text-[15px] font-semibold text-primary underline underline-offset-4">Read the Courtyard study</Link>
          </div>
          <Figure k="oakline-09" ratio="16/9" className="order-1 lg:order-2" caption="Living room with a timber wall and the kitchen beyond, one open sightline." />
        </div>
      </section>

      <section id="preview" className="wrap section pt-0" aria-labelledby="preview-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="preview-title" className="text-[30px]">Watch a real home walkthrough</h2>
            <p className="mt-2 measure text-muted-foreground">Inside Alessandra Ambrosio’s home with Architectural Digest’s Open Door.</p>
          </div>
          <Link to="/explore-home" className="font-semibold text-primary underline underline-offset-4">Explore the 3D home</Link>
        </div>
        <HomeWalkthrough />
      </section>

      <section className="bg-card" aria-labelledby="materials-strip">
        <div className="wrap grid gap-5 py-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <h2 id="materials-strip" className="text-[26px]">The material library</h2>
            <p className="mt-2 text-muted-foreground">Floors, walls, cabinetry, counters and hardware we come back to because they age well in real houses.</p>
            <Link to="/materials" className="mt-3 inline-block font-semibold text-primary underline underline-offset-4">Browse materials</Link>
          </div>
          <ul className="grid grid-cols-3 gap-6 sm:grid-cols-6">
            {[FINISHES.floor.options[0], FINISHES.floor.options[1], FINISHES.wall.options[2], FINISHES.cabinet.options[2], FINISHES.counter.options[1], FINISHES.fixture.options[0]].filter((o) => !!o).map((o, i) => (
              <li key={i} className="min-w-0">
                <MaterialPhoto id={o.id} category={i < 2 ? "floor" : i === 2 ? "wall" : i === 3 ? "cabinet" : i === 4 ? "counter" : "fixture"} />
                <span className="mt-1 block text-[13px]">{o.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="philosophy">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="panel">
            <h2 id="philosophy" className="text-[30px]">Why design and build under one roof</h2>
            <p className="mt-3 measure">
              When the people drawing your home also price and coordinate it, decisions get tested against cost and schedule while they are still sketches. A window that would need a steel header shows up as a choice, with its cost, before it is in the drawings.
            </p>
            <p className="mt-3 measure">
              You get one point of contact from the first conversation through the final walkthrough, a written scope that changes only when you approve the change, and a finish schedule that the site crew builds from directly.
            </p>
            <Link to="/design-build" className="mt-4 inline-block font-semibold text-primary underline underline-offset-4">See how a project runs</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Figure k="oakline-07" ratio="3/4" caption="White cabinetry over a walnut island base." />
            <Figure k="oakline-10" ratio="3/4" caption="A house set among mature trees." />
          </div>
        </div>
      </section>

      <section className="wrap pb-12" aria-labelledby="invite">
        <div className="flex flex-col gap-4 bg-primary p-6 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 id="invite" className="text-[28px]">Thinking about a home or a major renovation?</h2>
            <p className="mt-2 max-w-xl opacity-90">Tell us where you are, what you want to change and when. We will set up a first conversation at the studio or on your property.</p>
          </div>
          <Link to="/contact" className="btn border-primary-foreground bg-primary-foreground text-primary hover:bg-secondary">Start your home</Link>
        </div>
      </section>
    </>
  );
}
