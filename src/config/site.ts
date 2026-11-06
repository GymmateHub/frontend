/**
 * Public-site facts used for SEO: canonical URLs, social previews and
 * structured data. Keep these in line with what the landing pages show.
 */
export const SITE = {
  name: "GymMateHub",
  /** Canonical origin, no trailing slash. http and www already redirect here. */
  url: (import.meta.env.VITE_SITE_URL || "https://gymmatehub.com").replace(/\/+$/, ""),
  email: "support@gymmatehub.com",
  locality: "Lagos",
  countryCode: "NG",
  /** 1200x630 social preview, in public/. */
  ogImage: "/og-image.png",
  /** Square logo for structured data, in public/. */
  logo: "/icon-512.png",
} as const;

/** Absolute URL for a site path ("/" stays "/", others have no trailing slash). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE.url}${clean}`;
}
