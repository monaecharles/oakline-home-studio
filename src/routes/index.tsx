import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/oakline-hero.jpg";
import { Figure } from "@/components/site/Figure";
import { LazyViewer } from "@/components/three/LazyViewer";
import { FINISHES } from "@/lib/rooms";
import { pageHead, SITE_CONFIG } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "/",
      "Oakline Custom Homes | Custom home design and build in Atlanta",
      "Oakline designs and builds custom homes, major additions and whole-home renovations in Atlanta, Marietta and Roswell. Explore our home study in 3D.",
    ),
  component: Home,
});

function Home() {
  const [show3d, setShow3d] = useState(false);
  return (
    <>
      <section className="wrap pt-4 lg:pt-8" aria-labelledby="hero-title">
        <div className="relative border border-primary bg-card p-2">
          <img
            src={SITE_CONFIG.customHeroUrl || hero}
            alt="Open living room and kitchen with oak cabinetry, a pale quartz island, a forest green sofa and black-framed windows in morning light"
            width={1536}
            height={1024}
            fetchPriority="high"
            className="aspect-[16/10] max-h-[640px] w-full object-cover lg:aspect-[16/8]"
          />
          <div className="border-t border-primary bg-card p-5 md:absolute md:bottom-8 md:left-8 md:max-w-[460px] md:border md:p-6">
            <p className="eyebrow">Built around the way you live</p>
            <h1 id="hero-title" className="mt-2 text-[34px] md:text-[44px]">Your home, considered from every angle.</h1>
            <p className="mt-3 text-[16px] text-muted-foreground">
              Oakline is a design-and-build studio for custom homes, major additions and whole-home renovations across metro Atlanta. One team draws the plan, chooses the materials with you and coordinates the build.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn btn-solid" onClick={() => { setShow3d(true); setTimeout(() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" }), 50); }}>
                Explore the home in 3D
              </button>
              <Link to="/residences" className="btn btn-line">View residences</Link>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">Studio rendering of a living room and kitchen in warm oak and ivory.</p>
      </section>

      <section className="wrap section" aria-labelledby="spreads">
        <h2 id="spreads" className="sr-only">Residence design studies</h2>
        <div className="grid gap-0 border border-border lg:grid-cols-[1.4fr_1fr]">
          <Figure k="oakline-02" className="border-0 lg:border-r" caption="Contemporary two-story massing at dusk, the kind of street presence we start from for The Alder House." />
          <div className="flex flex-col justify-center p-5 md:p-7">
            <p className="eyebrow">Design study</p>
            <h3 className="mt-2 text-[28px]">The Alder House</h3>
            <p className="mt-3 measure">
              A warm contemporary family home planned around one long kitchen island, a mudroom that actually holds backpacks and boots, and bedrooms grouped away from the living wing so early risers and late readers do not collide.
            </p>
            <Link to="/residences" hash="alder" className="mt-4 self-start text-[15px] font-semibold text-primary underline underline-offset-4">Read the Alder House study</Link>
          </div>
        </div>
        <div className="mt-6 grid gap-0 border border-border lg:grid-cols-[1fr_1.6fr]">
          <div className="order-2 flex flex-col justify-center p-5 md:p-7 lg:order-1 lg:border-r">
            <p className="eyebrow">Design study</p>
            <h3 className="mt-2 text-[28px]">The Courtyard Residence</h3>
            <p className="mt-3 measure">
              Rooms wrap a planted courtyard so the dining table, the living room and the primary suite each get a view of the same garden. Wide sliding doors make the courtyard a room for nine months of the Georgia year.
            </p>
            <Link to="/residences" hash="courtyard" className="mt-4 self-start text-[15px] font-semibold text-primary underline underline-offset-4">Read the Courtyard study</Link>
          </div>
          <Figure k="oakline-09" ratio="16/9" className="order-1 border-0 lg:order-2" caption="Living and dining under one ceiling, with open shelving and daylight from two sides." />
        </div>
      </section>

      <section id="preview" className="wrap section pt-0" aria-labelledby="preview-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-primary pb-3">
          <div>
            <h2 id="preview-title" className="text-[30px]">Walk the home in 3D</h2>
            <p className="mt-2 measure text-muted-foreground">A furnished single-level study model. Turn it, lift the roof and step into each room.</p>
          </div>
          <Link to="/explore-home" className="btn btn-line">Open the full viewer</Link>
        </div>
        {show3d ? (
          <LazyViewer compact />
        ) : (
          <button onClick={() => setShow3d(true)} className="group relative block w-full border border-primary bg-card p-2 text-left">
            <img src={`https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=70`} alt="Living room detail with a sofa and layered neutral textiles" loading="lazy" className="aspect-[21/9] w-full object-cover opacity-80" />
            <span className="absolute inset-x-6 bottom-6 border border-primary bg-card p-4 md:right-auto md:max-w-sm">
              <span className="block font-display text-[22px]">Load the 3D home</span>
              <span className="mt-1 block text-[15px] text-muted-foreground">The interactive model loads only when you ask for it, so this page stays quick.</span>
            </span>
          </button>
        )}
      </section>

      <section className="border-y border-border bg-card" aria-labelledby="materials-strip">
        <div className="wrap grid gap-5 py-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <h2 id="materials-strip" className="text-[26px]">The material library</h2>
            <p className="mt-2 text-muted-foreground">Floors, walls, cabinetry, counters and hardware we come back to because they age well in real houses.</p>
            <Link to="/materials" className="mt-3 inline-block font-semibold text-primary underline underline-offset-4">Browse materials</Link>
          </div>
          <ul className="grid grid-cols-3 gap-0 border border-border sm:grid-cols-6">
            {[FINISHES.floor.options[0], FINISHES.floor.options[1], FINISHES.wall.options[2], FINISHES.cabinet.options[2], FINISHES.counter.options[1], FINISHES.fixture.options[0]].map((o, i) => (
              <li key={i} className="border-border p-2 [&:not(:last-child)]:border-r">
                <span className="block aspect-square border border-ink/20" style={{ background: o.color }} />
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
            <Figure k="oakline-07" ratio="3/4" caption="Cabinet and counter detail." />
            <Figure k="oakline-10" ratio="3/4" caption="A house set among mature trees." />
          </div>
        </div>
      </section>

      <section className="wrap pb-12" aria-labelledby="invite">
        <div className="flex flex-col gap-4 border border-primary bg-primary p-6 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-8">
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
