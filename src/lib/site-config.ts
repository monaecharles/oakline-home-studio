// Private configuration. Leave values empty until a real service is approved.
export const SITE_CONFIG = {
  /** Canonical base URL. Empty until a real domain is connected. */
  canonicalBase: "",
  /** Portfolio build: keep out of search indexes until launch. */
  noindex: true,
  /** Optional hosted URL for the separately delivered original hero image. */
  customHeroUrl: "",
  /** Approved external booking page. Empty = local-only scheduling preference. */
  BOOKING_URL: "",
  /** Approved existing form service endpoint. Empty = save on device only. */
  INQUIRY_FORM_ENDPOINT: "",
  /** Social links render only when filled in. */
  social: {} as Partial<Record<"instagram" | "pinterest" | "houzz", string>>,
};

export const ROUTE_MANIFEST = [
  "/", "/residences", "/explore-home", "/materials", "/design-build", "/studio", "/homeowner-guide", "/contact",
] as const;

export function pageHead(path: string, title: string, description: string) {
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (SITE_CONFIG.noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  const links = SITE_CONFIG.canonicalBase ? [{ rel: "canonical", href: SITE_CONFIG.canonicalBase + path }] : [];
  return { meta, links };
}
