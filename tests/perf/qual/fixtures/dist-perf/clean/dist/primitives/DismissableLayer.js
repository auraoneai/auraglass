//#region src/primitives/DismissableLayer.tsx
export function DismissableLayer(node, onChange) {
	const mo = new MutationObserver(onChange);
	mo.observe(node, { attributes: true });
	return () => mo.disconnect();
}
//#endregion
