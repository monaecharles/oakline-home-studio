import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOUR_URL = "https://my.matterport.com/show/?m=cLFn5pD1TtE";

export function MatterportTour() {
  return (
    <section className="wrap section" aria-labelledby="tour-heading">
      <h2 id="tour-heading" className="text-[28px]">Tour the Home</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Move through a real home room by room. Drag to look around and select a spot on the floor to walk there.</p>
      <div className="mt-5 aspect-[4/3] w-full overflow-hidden bg-secondary sm:aspect-video">
        <iframe
          className="h-full w-full border-0"
          src={`${TOUR_URL}&play=0`}
          title="Matterport 3D tour of a real home"
          loading="lazy"
          allow="fullscreen; xr-spatial-tracking; autoplay"
          allowFullScreen
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button asChild>
          <a href={TOUR_URL} target="_blank" rel="noopener noreferrer"><ExternalLink />Open Tour</a>
        </Button>
        <p className="text-[14px] text-muted-foreground">If the tour does not load here, open it in a new tab.</p>
      </div>
    </section>
  );
}
