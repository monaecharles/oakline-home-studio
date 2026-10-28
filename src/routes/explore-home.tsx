import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeWalkthrough } from "@/components/site/HomeWalkthrough";
import { PageIntro } from "@/components/site/Figure";
import { ROOMS, type RoomId } from "@/lib/rooms";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/explore-home")({
  validateSearch: (s: Record<string, unknown>): { room?: RoomId } => {
    const room = ROOMS.find((r) => r.id === s["room"]);
    return room ? { room: room.id } : {};
  },
  head: () => pageHead("/explore-home", "Real home walkthrough | Oakline Custom Homes", "Watch Architectural Digest’s official tour of Alessandra Ambrosio’s home, an outside inspiration reference, and save separate material choices."),
  component: Explore,
});

function Explore() {
  return <>
    <PageIntro eyebrow="Real-home inspiration" title="Watch a real home walkthrough">
      Architectural Digest visits Alessandra Ambrosio’s home in its Open Door series. Watch the rooms, furnishings and outdoor spaces of an actual house.
    </PageIntro>
    <section className="wrap section"><HomeWalkthrough /></section>
    <section className="wrap pb-12">
      <h2 className="text-[28px]">Your material inspiration board</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Collect photographs of finishes for your own project. Your saved choices are separate from this video and do not change the house shown.</p>
      <Link to="/materials" className="mt-4 inline-block font-semibold text-primary underline underline-offset-4">Choose materials</Link>
    </section>
  </>;
}
