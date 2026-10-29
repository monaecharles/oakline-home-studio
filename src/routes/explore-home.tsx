import { createFileRoute, Link } from "@tanstack/react-router";
import { MatterportTour } from "@/components/site/MatterportTour";
import { KitchenFloorTest } from "@/components/site/matterport/KitchenFloorTest";
import { RoomRestyler } from "@/components/restyle/RoomRestyler";
import { PageIntro } from "@/components/site/Figure";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/explore-home")({
  head: () => pageHead("/explore-home", "Tour and design a real home | Oakline Custom Homes", "Walk a real home in a 360° tour, then stand in a real room and change its floor and wall finishes."),
  component: Explore,
});

function Explore() {
  return <>
    <PageIntro eyebrow="Real-home walkthrough" title="Walk a real home, then design yours">
      Tour a real house room by room. Then step into a real 360° room and try floors and wall colors on it.
    </PageIntro>
    <MatterportTour />
    <RoomRestyler />
    <KitchenFloorTest />
    <section className="wrap pb-12">
      <h2 className="text-[28px]">Restyle a real kitchen</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Try cabinets and counters on a real kitchen photograph and compare it with the original.</p>
      <Link to="/materials" hash="kitchen-restyle" className="mt-4 inline-block font-semibold text-primary underline underline-offset-4">Go to the kitchen</Link>
    </section>
  </>;
}
