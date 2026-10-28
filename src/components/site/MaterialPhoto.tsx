import { useState } from "react";
import { materialPhoto } from "@/lib/material-photos";
import type { Category } from "@/lib/rooms";

export function MaterialPhoto({ category, id }: { category: Category; id: string }) {
  const photo = materialPhoto(category, id);
  const [failed, setFailed] = useState(false);
  return <div className="aspect-[4/3] overflow-hidden bg-secondary">
    {failed ? <p className="p-3 text-[13px] text-muted-foreground">Photograph unavailable</p> : <img src={photo.url} alt={photo.alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />}
  </div>;
}