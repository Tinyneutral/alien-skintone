import Color from "colorjs.io";
import ColorSpace from "colorjs.io/spaces";

/**
 * Convert to space and multiply each coord by its strength.
 * @param {Color} color
 * @param {ColorSpace} space
 * @param {number[]} strengths
 * @returns {Color}
 */
function toWeighted(color: Color, space: ColorSpace, strengths: number[]) {
	const weightedColor = color.to(space);
	weightedColor.coords.forEach((value: number | null, index: number) => {
		if (value === null) return;
		const strength = strengths[index] ?? 0;
		weightedColor.coords[index] = value * strength;
	});
	return weightedColor;
}

/**
 * @param {Color[]} palette
 * @param {Color} target
 * @param {ColorSpace} space
 * @param {number[]} strengths
 * @returns {number[]} sorted ascending by distance
 */
export function rankPaletteByColor(palette: Color[], target: Color, space: ColorSpace, strengths: number[]) {
	const weightedPalette = palette.map((color) => toWeighted(color, space, strengths));
	const weightedTarget = toWeighted(target, space, strengths);
	const rankMap = weightedPalette
		.map((color, index) => ({ color, index }))
		.sort((a, b) => a.color.distance(weightedTarget) - b.color.distance(weightedTarget))
		.map((entry, index) => ({ ...entry, rank: index + 1 }))
		.sort((a, b) => a.index - b.index)
		.map((entry) => ({ color: entry.color, rank: entry.rank }));
	const ranks = rankMap.map((entry) => entry.rank);
	return ranks;
}
