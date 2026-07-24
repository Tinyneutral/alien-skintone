import Color from "colorjs.io";

/**
 * Convert to space and multiply each coord by its strength.
 * @param {{ r: number, g: number, b: number }} rgb
 * @param {string} space
 * @param {number[]} strengths
 * @returns {Color}
 */
function toWeightedColor(rgb, space, strengths) {
	const color = new Color("srgb", [rgb.r / 255, rgb.g / 255, rgb.b / 255])
		.to(space);
	color.coords.forEach((value, index) => {
		const strength = strengths[index] ?? 0;
		color.coords[index] = value * strength;
	});
	return color;
}

/**
 * @param {{ r: number, g: number, b: number }[]} palette
 * @param {{ r: number, g: number, b: number }} target
 * @param {string} space
 * @param {number[]} strengths
 * @returns {number[]} sorted ascending by distance
 */
export function rankPaletteByColor(palette, target, space, strengths) {
	const cPalette = palette.map((rgb) => toWeightedColor(rgb, space, strengths));
	const cTarget = toWeightedColor(target, space, strengths);
	const rankMap = cPalette
		.map((color, index) => ({ color, index, rank: 0 }))
		.sort(
			(a, b) =>
				a.color.distance(cTarget) - b.color.distance(cTarget)
		)
		.map((entry, index) => ({ ...entry, rank: index + 1 }))
		.sort((a, b) => a.index - b.index);
	const ranks = rankMap.map((entry) => entry.rank);
	return ranks;
}
