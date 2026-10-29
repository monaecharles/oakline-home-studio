import { createFileRoute, Link } from "@tanstack/react-router";
import { MatterportTour } from "@/components/site/MatterportTour";
import { PageIntro } from "@/components/site/Figure";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/explore-home")({
  head: () => pageHead("/explore-home", "Tour the home | Oakline Custom Homes", "Walk through a real home room by room in an interactive Matterport tour."),
  component: Explore,
});

function Explore() {
  return <>
    <PageIntro eyebrow="Real-home walkthrough" title="Explore the home">
      Walk through a real home room by room, look around each space and move at your own pace.
    </PageIntro>
    <MatterportTour />
    <section className="wrap pb-12">
      <h2 className="text-[28px]">Your material inspiration board</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Collect photographs of finishes for your own project. Your saved choices stay in this browser.</p>
      <Link to="/materials" className="mt-4 inline-block font-semibold text-primary underline underline-offset-4">Choose materials</Link>
    </section>
  </>;
}
