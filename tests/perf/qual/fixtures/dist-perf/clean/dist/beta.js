//#region src/beta.ts
const BETA_TABLE = Array.from({ length: 64 }, (_, i) => `beta-row-${i}`);
export function Beta(i) {
	return { style: { transition: 'opacity 120ms' }, label: BETA_TABLE[i % BETA_TABLE.length] };
}
//#endregion
