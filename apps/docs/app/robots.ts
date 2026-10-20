// app/robots.ts — SEO pass — 2026-10-20.
//
// Placeholder-domain swap-note: the absolute sitemap URL is derived from
// PUBLIC_DOCS_URL (scripts/docs/paths.mjs): the GitLab Pages URL
// https://auraglass-48859d.gitlab.io/ until owner decision OD-12 lands the
// custom domain (https://auraglass.dev/). Swapping domains is a one-line
// change in paths.mjs — robots.ts, sitemap.ts, llms.txt and every canonical
// regenerate from it (npm run docs:sitemap / docs:llms); no other edits.
//
// Surface posture: apps/docs is a fully public static docs export — every
// content route is crawlable and in the sitemap. The only non-page route is
// /nav.json (site chrome JSON emitted for the docs UI, verified against the
// HTML export by scripts/docs/verify-docs-out.mjs); it is disallowed so
// crawlers spend budget on pages, not chrome.
//
// Named AI crawlers are explicitly welcome on all public content. In
// robots.txt the most specific user-agent group wins, so each named group
// repeats the private-path disallows instead of falling through to "*".
import type { MetadataRoute } from "next";
import { PUBLIC_DOCS_URL } from "../../../scripts/docs/paths.mjs";

const PRIVATE_PATHS = ["/nav.json"];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "cohere-ai",
  "CCBot",
];

const base = PUBLIC_DOCS_URL.endsWith("/")
  ? PUBLIC_DOCS_URL
  : `${PUBLIC_DOCS_URL}/`;

/* Static export: metadata routes must opt into force-static (same as
   app/nav.json/route.ts). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${base}sitemap.xml`,
    host: base.replace(/\/$/, ""),
  };
}
