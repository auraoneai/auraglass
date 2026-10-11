//#region src/alpha.ts
// A comment naming feTurbulence, elementsFromPoint and new MutationObserver() is not code.
export function Alpha(el) {
	el.style.transition = 'opacity 0.14s, transform 0.2s';
	el.animate([{ opacity: 0, transform: 'scale(0.98)' }, { opacity: 1, transform: 'none' }], { duration: 120 });
	window.__agAlphaMounted = true;
	return 'alpha-'.repeat(40);
}
//#endregion
