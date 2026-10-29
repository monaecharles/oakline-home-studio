import { createFileRoute, Link } from "@tanstack/react-router";
import { LazyViewer } from "@/components/three/LazyViewer";
import { MatterportTour } from "@/components/site/MatterportTour";
import { PageIntro } from "@/components/site/Figure";
import { ROOMS, type RoomId } from "@/lib/rooms";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/explore-home")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { room?: RoomId } => {
    const room = ROOMS.find((r) => r.id === s["room"]);
    return room ? { room: room.id } : {};
  },
  head: () => pageHead("/explore-home", "Explore the home in 3D | Oakline Custom Homes", "Explore furnished rooms in an interactive 3D home, with Architectural Digest’s official Alessandra Ambrosio tour as the filmed reference."),
  component: Explore,
});

function Explore() {
  const { room } = Route.useSearch();
  return <>
    <PageIntro eyebrow="Interactive home · filmed reference" title="Explore the home in 3D">
      Step inside furnished rooms and explore finishes. Architectural Digest’s tour of Alessandra Ambrosio’s home is the visual reference; this model is an interpretation, not an exact scan of her house.
    </PageIntro>
    <section className="wrap section"><LazyViewer initialRoom={room ?? null} /></section>
    <MatterportTour />
    <section className="wrap pb-12">
      <h2 className="text-[28px]">Your material inspiration board</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Collect photographs of finishes for your own project. Your saved choices also appear in the 3D model. They never change the house in the filmed reference.</p>
      <Link to="/materials" className="mt-4 inline-block font-semibold text-primary underline underline-offset-4">Choose materials</Link>
    </section>
  </>;
}
