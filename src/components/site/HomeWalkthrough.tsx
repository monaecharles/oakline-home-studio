import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WALKTHROUGH } from "@/lib/walkthrough";

export function HomeWalkthrough() {
  return (
    <div>
      <div className="aspect-video w-full overflow-hidden bg-secondary">
        <iframe
          className="h-full w-full border-0"
          src={WALKTHROUGH.embedUrl}
          title={WALKTHROUGH.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-[14px] font-semibold">{WALKTHROUGH.credit}</p>
          <p className="mt-1 text-[14px] text-muted-foreground">Alessandra Ambrosio’s home is an outside reference, not an Oakline project. This is filmed footage, not an interactive 3D scan.</p>
        </div>
        <Button variant="link" asChild className="h-auto min-h-11 whitespace-normal px-0 text-left">
          <a href={WALKTHROUGH.watchUrl} target="_blank" rel="noopener noreferrer"><ExternalLink />Watch the original on YouTube</a>
        </Button>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">If playback is unavailable here, watch the original using the link above.</p>
    </div>
  );
}