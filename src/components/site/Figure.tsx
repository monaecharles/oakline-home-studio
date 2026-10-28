import { useState } from "react";
import { PHOTOS, photoSrcSet, photoUrl } from "@/lib/photos";
import { cn } from "@/lib/utils";

export function Figure({
  k,
  caption,
  ratio = "3/2",
  className,
  priority,
  sizes = "(min-width:1024px) 50vw, 100vw",
}: {
  k: string;
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const p = PHOTOS[k]!;
  const [failed, setFailed] = useState(false);
  return (
    <figure className={cn("border border-border bg-card p-2", className)}>
      <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: ratio }}>
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[14px] text-muted-foreground">
            Photo could not load: {p.alt}
          </div>
        ) : (
          <img
            src={photoUrl(k, 1280)}
            srcSet={photoSrcSet(k)}
            sizes={sizes}
            alt={p.alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: p.focal }}
          />
        )}
      </div>
      {caption && <figcaption className="border-t border-border/60 px-1 pt-2 text-[14px] text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <header className="wrap section pb-0">
      <div className="panel max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-[34px] md:text-[46px]">{title}</h1>
        <div className="measure mt-3 text-[17px] text-muted-foreground">{children}</div>
      </div>
    </header>
  );
}
