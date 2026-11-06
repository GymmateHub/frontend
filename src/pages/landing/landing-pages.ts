import type { ComponentType } from "react";
import LandingHome from "./LandingHome";
import LandingFeatures from "./LandingFeatures";
import LandingPricing from "./LandingPricing";
import LandingAbout from "./LandingAbout";
import LandingContact from "./LandingContact";

/**
 * The public marketing pages. App.tsx routes them, and the build prerenders
 * each one to static HTML and lists it in sitemap.xml (scripts/prerender.mjs).
 * Adding a page here is enough to get all three.
 */
export type LandingPage = { path: string; Component: ComponentType };

export const LANDING_PAGES: LandingPage[] = [
  { path: "/", Component: LandingHome },
  { path: "/features", Component: LandingFeatures },
  { path: "/pricing", Component: LandingPricing },
  { path: "/about", Component: LandingAbout },
  { path: "/contact", Component: LandingContact },
];
