/**
 * Build step after `vite build`: turns the SPA shell into static, indexable HTML
 * for the marketing pages, and writes the files crawlers ask for.
 *
 *   dist/index.html, features.html, ...  marketing pages, prerendered with their
 *                                        own <title>, meta, canonical and JSON-LD
 *   dist/app.html                        the plain SPA shell, marked noindex; nginx
 *                                        serves it for every other route
 *   dist/robots.txt, dist/sitemap.xml
 *
 * Needs the server bundle from `vite build --ssr src/prerender/entry-server.tsx`.
 * nginx.conf maps /features to features.html and falls back to app.html.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL || "https://gymmatehub.com").replace(/\/+$/, "");

const { render, paths } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const ROOT_DIV = '<div id="root"></div>';
if (!template.includes(ROOT_DIV)) {
  throw new Error("dist/index.html is not the fresh Vite shell; run `vite build` before prerendering.");
}

// Preload the self-hosted Outfit font (Latin subset) so text paints sooner.
const assets = await fs.readdir(path.join(dist, "assets"));
const font = assets.find((f) => /^outfit-latin-wght-normal-.*\.woff2$/.test(f));
const fontPreload = font
  ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />\n    `
  : "";
const withPreload = (html) => html.replace("</head>", `  ${fontPreload}</head>`);

// 1. SPA shell for app, auth and unknown routes. Never indexed.
const shell = withPreload(template).replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>');
await fs.writeFile(path.join(dist, "app.html"), shell);

// 2. Marketing pages.
const fileFor = (p) => (p === "/" ? "index.html" : `${p.replace(/^\//, "")}.html`);
for (const p of paths) {
  const { html, head } = render(p);
  const problems = [
    !/<h1[\s>]/.test(html) && "no <h1>",
    !head.includes('rel="canonical"') && "no canonical link",
    !head.includes('property="og:image"') && "no og:image",
  ].filter(Boolean);
  if (problems.length) throw new Error(`Prerender of ${p}: ${problems.join(", ")}`);

  const page = withPreload(template)
    .replace(/\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace(/\s*<!-- Default link preview[\s\S]*?-->/, "")
    .replace(/\s*<meta (?:property="og:|name="twitter:)[^>]*>/g, "")
    .replace("</head>", `  ${head}\n  </head>`)
    .replace(ROOT_DIV, `<div id="root">${html}</div>`);
  await fs.writeFile(path.join(dist, fileFor(p)), page);
  console.log(`prerendered ${p} -> dist/${fileFor(p)}`);
}

// 3. robots.txt and sitemap.xml. App screens stay crawlable so their noindex is seen.
const loc = (p) => `${siteUrl}${p === "/" ? "/" : p}`;
await fs.writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${loc(p)}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
console.log(`wrote dist/app.html, robots.txt and sitemap.xml (${paths.length} URLs)`);
