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
    P("oakline-01", "photo-1600210492486-724fe5c67fb0", "Bright living room with a pale sofa, wood accents and large windows", "home, explore"),
    P("oakline-02", "photo-1600596542815-ffad4c1539a9", "Contemporary two-story house exterior with lawn and warm interior lights at dusk", "home, residences"),
    P("oakline-03", "photo-1600607687920-4e2a09cf159d", "Open living space with tall glazing, wood ceiling and modern furniture", "residences, studio"),
    P("oakline-04", "photo-1600566753086-00f18fb6b3ea", "Bright open interior with a kitchen island and light wood flooring", "residences, guide"),
    P("oakline-05", "photo-1600566753190-17f0baa2a6c3", "Close view of a contemporary home exterior with large windows and clean rooflines", "design-build"),
    P("oakline-06", "photo-1556912172-45b7abe8b7e1", "Kitchen with wood cabinetry, a long counter and pendant lighting", "materials, explore"),
    P("oakline-07", "photo-1556912167-f556f1f39fdf", "Detail of kitchen cabinetry and counter surfaces", "materials, home"),
    P("oakline-08", "photo-1616046229478-9901c5536a45", "Wood console with ceramics, books and a framed mirror against a neutral wall", "studio, materials"),
    P("oakline-09", "photo-1600607687939-ce8a6c25118c", "Living and dining area with a wood table, open shelving and soft daylight", "home, residences"),
    P("oakline-10", "photo-1600607688969-a5bfcd646154", "Modern house exterior with a lawn and mature trees around it", "residences, studio"),
    P("oakline-11", "photo-1620626011761-996317b8d101", "Bathroom with a stone vanity, round mirror and warm lighting", "explore, materials"),
    P("oakline-12", "photo-1600210491892-03d54c0aaf87", "Living room detail with a sofa, side table and layered neutral textiles", "explore, guide"),
  ].map((p) => [p.key, p]),
);

export function photoUrl(key: string, w = 1600) {
  return `https://images.unsplash.com/${PHOTOS[key].id}?auto=format&fit=crop&w=${w}&q=80`;
}
export function photoSrcSet(key: string) {
  return [640, 960, 1280, 1600].map((w) => `${photoUrl(key, w)} ${w}w`).join(", ");
}
