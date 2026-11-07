/**
 * Server entry used only at build time to prerender the marketing pages
 * (see scripts/prerender.mjs). Mirrors the providers and landing routes of
 * main.tsx / App.tsx; the landing pages need no API, auth or query client.
 */
import { renderToString } from "react-dom/server";
import { Route, Routes, StaticRouter } from "react-router";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { ThemeProvider } from "../context/ThemeContext";
import LandingLayout from "../layout/LandingLayout";
import { LANDING_PAGES } from "../pages/landing/landing-pages";

export const paths = LANDING_PAGES.map((page) => page.path);

export function render(url: string): { html: string; head: string } {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <StaticRouter location={url}>
          <Routes>
            <Route element={<LandingLayout />}>
              {LANDING_PAGES.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Route>
          </Routes>
        </StaticRouter>
      </ThemeProvider>
    </HelmetProvider>,
  );
  const helmet = helmetContext.helmet;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script].map((tags) => tags.toString()).join("\n    ")
    : "";
  return { html, head };
}
