// Central photo registry. Sources: Unsplash (https://unsplash.com/license).
export interface Photo {
  key: string;
  id: string;
  alt: string;
  focal: string; // CSS object-position
  placement: string;
}

const P = (key: string, id: string, alt: string, placement: string, focal = "50% 50%"): Photo => ({ key, id, alt, focal, placement });

export const PHOTOS: Record<string, Photo> = Object.fromEntries(
  [
    P("oakline-01", "photo-1600210492486-724fe5c67fb0", "Bright living room with a leather sofa, white armchairs, a gallery wall and tall windows", "home, explore"),
    P("oakline-02", "photo-1600596542815-ffad4c1539a9", "White contemporary house with a rooftop terrace and a pool under a clear sky", "home, residences"),
    P("oakline-03", "photo-1600607687920-4e2a09cf159d", "Dining area with a black table, a steel open stair and glass partitions", "residences, studio"),
    P("oakline-04", "photo-1600566753086-00f18fb6b3ea", "Open living room with a floating oak stair, gray sofa and floor-to-ceiling windows", "residences, guide"),
    P("oakline-05", "photo-1600566753190-17f0baa2a6c3", "Contemporary house with a timber-clad volume, black siding and a glazed entry", "design-build"),
    P("oakline-06", "photo-1556912172-45b7abe8b7e1", "White kitchen with a quartz island over a walnut base and wood stools", "materials, explore"),
    P("oakline-07", "photo-1556912167-f556f1f39fdf", "White shaker kitchen with globe pendants, hex tile and a walnut island", "materials, home"),
    P("oakline-08", "photo-1616046229478-9901c5536a45", "Living room with a sage wall, rattan console, round mirror and patterned rug", "studio, materials"),
    P("oakline-09", "photo-1600607687939-ce8a6c25118c", "Living room with a timber feature wall, white sofa and a kitchen beyond", "home, residences"),
    P("oakline-10", "photo-1600607688969-a5bfcd646154", "Two-story house in black and timber cladding with a lawn and a large tree", "residences, studio"),
    P("oakline-11", "photo-1620626011761-996317b8d101", "White bathroom with a freestanding tub, vessel sink and tall window", "explore, materials"),
    P("oakline-12", "photo-1600210491892-03d54c0aaf87", "Living room with exposed wood beams, arched black windows and a linear fireplace", "explore, guide"),
  ].map((p) => [p.key, p]),
);

export function photoUrl(key: string, w = 1600) {
  return `https://images.unsplash.com/${PHOTOS[key]!.id}?auto=format&fit=crop&w=${w}&q=80`;
}
export function photoSrcSet(key: string) {
  return [640, 960, 1280, 1600].map((w) => `${photoUrl(key, w)} ${w}w`).join(", ");
}
