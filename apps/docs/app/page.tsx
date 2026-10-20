import type { Metadata } from "next";
import Link from "next/link";

/* SEO pass — 2026-10-20: home carries the frozen brand line, a canonical and
   OG/Twitter fields of its own. Next replaces (not deep-merges) a child's
   openGraph object, so the brand renders are re-pinned here — otherwise the
   per-page openGraph silently drops the root layout's og image. DOCS_BASE_PATH
   mirrors next.config.ts for raw asset URLs; metadataBase resolves absolute.
   `absolute` keeps the title template from doubling the brand. */
const brandBase = process.env.DOCS_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: { absolute: "AuraGlass — a liquid-glass design system for React 19" },
  description:
    "AuraGlass 5.0 platform documentation — components, registry, guides and migration.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AuraGlass — a liquid-glass design system for React 19",
    description:
      "AuraGlass 5.0 platform documentation — components, registry, guides and migration.",
    url: "/",
    images: [
      {
        url: `${brandBase}/brand/og-1200x630.png`,
        width: 1200,
        height: 630,
        alt: "AuraGlass — a liquid-glass design system for React 19",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${brandBase}/brand/twitter-1200x600.png`],
  },
};

export default function Home() {
  return (
    <article>
      <h1>AuraGlass 5.0</h1>
      <p>
        Glass-native component system, registry and docs. Start with the{" "}
        <Link href="/plat/introduction">introduction</Link> or the{" "}
        <Link href="/quickstart/next">Next quickstart</Link>.
      </p>
    </article>
  );
}
