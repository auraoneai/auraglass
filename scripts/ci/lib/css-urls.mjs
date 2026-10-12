/** Read complete CSS url() values so an SVG data URL's internal url(#id)
 * is not mistaken for a relative file in the package. */
export function cssUrls(css) {
  const pattern = /url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^\s'"()]+))\s*\)/gi;
  return [...css.matchAll(pattern)].map((match) => match[1] ?? match[2] ?? match[3]);
}
