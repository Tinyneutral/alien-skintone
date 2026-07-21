import { diff, rgbaToLab } from "color-diff";

/**
 * @param {{ r: number, g: number, b: number }} a
 * @param {{ r: number, g: number, b: number }} b
 * @returns {number}
 */
function labDiff(a, b) {
	// needed to fit color-diff API
	const properA = { R: a.r, G: a.g, B: a.b };
	const properB = { R: b.r, G: b.g, B: b.b };
	return diff(rgbaToLab(properA), rgbaToLab(properB));
}

/**
 * @param {{ r: number, g: number, b: number }[]} palette
 * @param {{ r: number, g: number, b: number }} targetColor
 * @returns {number[]}
 */
export function rankPaletteByColor(palette, targetColor) {
	const rankMap = palette
		.map((color, index) => ({ color, index, rank: 0 }))
		.sort(
			(a, b) =>
				labDiff(a.color, targetColor) - labDiff(b.color, targetColor)
		)
		.map((entry, index) => ({ ...entry, rank: index + 1 }))
		.sort((a, b) => a.index - b.index);
	const ranks = rankMap.map((entry) => entry.rank);
	return ranks;
}
