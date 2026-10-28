import { createFileRoute, Link } from "@tanstack/react-router";
import { Figure, PageIntro } from "@/components/site/Figure";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/design-build")({
  head: () =>
    pageHead(
      "/design-build",
      "Design & Build process | Oakline Custom Homes",
      "How an Oakline project runs: Conversation, Site & Scope, Design Development, Build Coordination and Final Walkthrough, with deliverables and decisions at each phase.",
    ),
  component: DesignBuild,
});

const PHASES = [
  {
    name: "Conversation",
    what: "We meet at the studio or on your property for about ninety minutes. We talk through how you live now, what is not working, what you are hoping for and the budget range you are comfortable with.",
    deliver: "A written summary of goals, a list of open questions and a proposal for the Site & Scope phase.",
    decide: "Whether to move forward, and who in your household will make decisions.",
  },
  {
    name: "Site & Scope",
    what: "We review your survey, zoning, setbacks, trees, slope and utilities, or the existing house for a renovation. We sketch two or three planning directions and attach a preliminary cost range to each.",
    deliver: "Site analysis, concept sketches, a preliminary budget range and a draft schedule.",
    decide: "One planning direction, the target budget and the level of finish.",
  },
  {
    name: "Design Development",
    what: "The chosen direction becomes floor plans, elevations and sections, then permit drawings. In parallel we build your finish schedule room by room using physical samples and your saved material inspiration.",
    deliver: "Permit set, finish schedule, lighting plan, a detailed construction budget and a build agreement.",
    decide: "Final plan, every finish and fixture, and approval of the construction budget.",
  },
  {
    name: "Build Coordination",
    what: "We submit for permits, schedule trades and manage the site. You get a weekly update with photos, the next two weeks of work and any decision we need from you.",
    deliver: "Weekly reports, inspection results and a running log of approved changes.",
    decide: "Any change to scope. Each change is written up with its cost and schedule effect, and nothing proceeds until you approve it.",
  },
  {
    name: "Final Walkthrough",
    what: "We walk the home with you room by room and record anything that needs finishing or adjusting. We hand over manuals, paint and finish records, and show you how each system works.",
    deliver: "Completion list, closeout binder and a follow-up visit after the first season.",
    decide: "Sign-off on the completion list once every item is done.",
  },
];

function DesignBuild() {
  return (
    <>
      <PageIntro eyebrow="How we work" title="Design & Build">
        One team takes your project from first conversation to final walkthrough. Designing and building together means cost and schedule are part of every design decision, not a surprise after the drawings are done.
      </PageIntro>
      <section className="wrap section" aria-labelledby="phases">
        <h2 id="phases" className="text-[30px]">The five phases</h2>
        <ol className="mt-5 border-l-2 border-primary">
          {PHASES.map((p) => (
            <li key={p.name} className="relative pb-6 pl-6 last:pb-0">
              <span className="absolute -left-[7px] top-2 h-3 w-3 border-2 border-primary bg-background" aria-hidden />
              <div className="grid gap-6 py-4 md:py-6 lg:grid-cols-[1.2fr_1fr_1fr]">
                <div>
                  <h3 className="text-[24px]">{p.name}</h3>
                  <p className="mt-2">{p.what}</p>
                </div>
                <div className="pt-3 lg:pt-0">
                  <h4 className="text-[14px] font-semibold uppercase tracking-wider text-walnut">You receive</h4>
                  <p className="mt-1 text-[15px]">{p.deliver}</p>
                </div>
                <div className="pt-3 lg:pt-0">
                  <h4 className="text-[14px] font-semibold uppercase tracking-wider text-walnut">You decide</h4>
                  <p className="mt-1 text-[15px]">{p.decide}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap section pt-0" aria-labelledby="types">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid">
            <h2 id="types" className="border-b border-border p-4 text-[28px] md:p-6">What we build</h2>
            {[
              ["Custom homes", "New homes on your lot or a lot you are buying, from compact single-level plans to larger family homes."],
              ["Major additions", "Primary suites, kitchen and family room extensions and second stories, designed so the addition reads as part of the original house."],
              ["Comprehensive interior renovations", "Whole-floor or whole-house renovations that change layout, systems and finishes, usually while you live elsewhere."],
            ].map(([t, d]) => (
              <div key={t} className="border-b border-border p-4 last:border-b-0 md:p-6">
                <h3 className="text-[21px]">{t}</h3>
                <p className="mt-1 measure text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="panel">
              <h2 className="text-[24px]">Budgets</h2>
              <p className="mt-2">
                We do not publish fixed construction prices, because site conditions, size and finish level move cost more than anything else. We share a preliminary range during Site & Scope and a detailed budget before you sign a build agreement. Bring the range you have in mind to the first conversation and we will tell you plainly what it can cover.
              </p>
            </div>
            <Figure k="oakline-05" caption="Exterior detail: large windows and simple rooflines." ratio="4/3" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/contact" className="btn btn-solid">Start your home</Link>
          <Link to="/homeowner-guide" className="btn btn-line">Read the homeowner guide</Link>
        </div>
      </section>
    </>
  );
}
