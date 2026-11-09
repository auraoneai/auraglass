import type { Metadata } from "next";
import Link from "next/link";

/* SEO launch-readiness: branded 404 for the static export (GitLab Pages
   serves 404.html for unmatched paths). noindex keeps dead URLs out of the
   index; the sitemap only lists real routes. */
export const metadata: Metadata = {
  title: { absolute: "Page not found · AuraGlass 5.0" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <article>
      <h1>Page not found</h1>
      <p>
        The AuraGlass docs page you asked for does not exist or has moved.
      </p>
      <p>
        <Link href="/">Back to the AuraGlass docs home</Link>.
      </p>
    </article>
  );
}
