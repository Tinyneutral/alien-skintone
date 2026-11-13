export type PaletteData = {
	colors: cssColor[];
	closenesses: number[];
};
export const initialPalette: PaletteData = {
	colors: [],
	closenesses: [],
};

export const INITIAL_CLOSENESS = Number.POSITIVE_INFINITY;
