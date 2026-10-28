import { createFileRoute, Link } from "@tanstack/react-router";
import { LazyViewer } from "@/components/three/LazyViewer";
import { Figure } from "@/components/site/Figure";
import { ROOMS, type RoomId } from "@/lib/rooms";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/explore-home")({
  validateSearch: (s: Record<string, unknown>): { room?: RoomId } => {
    const r = typeof s["room"] === "string" ? s["room"] : undefined;
    return ROOMS.some((x) => x.id === r) ? { room: r as RoomId } : {};
  },
  head: () =>
    pageHead(
      "/explore-home",
      "Explore the home in 3D | Oakline Custom Homes",
      "Rotate a furnished single-level Oakline home, step into five rooms, change floors, walls, cabinetry, counters and fixtures, and save a finish schedule.",
    ),
  component: Explore,
});

function Explore() {
  const { room } = Route.useSearch();
  return (
    <>
      <header className="wrap pt-6 lg:pt-10">
        <div className="grid gap-4 border-b border-primary pb-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Interactive study model</p>
            <h1 className="mt-2 text-[34px] md:text-[44px]">Explore the home in 3D</h1>
            <p className="measure mt-2 text-muted-foreground">
              A furnished single-level plan with a living room open to the kitchen, a primary bedroom, a bath and a studio. Choose a room to step inside and try finishes. Your choices stay in this browser.
            </p>
          </div>
          <Link to="/materials" className="btn btn-line">Read about each material</Link>
        </div>
      </header>
      <section className="wrap py-6">
        <LazyViewer initialRoom={room ?? null} />
      </section>
      <section className="wrap section pt-2" aria-labelledby="about-model">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel lg:col-span-1">
            <h2 id="about-model" className="text-[24px]">How to use the model</h2>
            <p className="mt-2">
              Drag to turn the house, pinch or scroll to zoom, or use the buttons under the view. Arrow keys rotate when the view has focus. Plan mode shows the same rooms as a drawing you can zoom and click.
            </p>
            <p className="mt-2">
              Finishes are rendered approximations. We confirm every selection with physical samples in the studio before anything is ordered.
            </p>
          </div>
          <Figure k="oakline-01" caption="Inspiration photograph: a bright living room with tall windows." />
          <Figure k="oakline-11" caption="Inspiration photograph for the bath: freestanding tub and vessel sink." />
        </div>
      </section>
    </>
  );
}
