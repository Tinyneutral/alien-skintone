import Color from "colorjs.io";
import ColorSpace from "colorjs.io/spaces";

/**
 * Convert to space and multiply each coord by its strength.
 * @param {cssColor} color
 * @param {ColorSpace} space
 * @param {number[]} strengths
 * @returns {cssColor}
 */
export function toWeighted(
	color: cssColor,
	space: ColorSpace,
	strengths: number[]
): cssColor {
	const weightedColor = new Color(color).to(space);
	weightedColor.coords.forEach((value: number | null, index: number) => {
		if (value === null) return;
		const strength = strengths[index] ?? 0;
		weightedColor.coords[index] = value * strength;
	});
	return weightedColor.display();
}

/**
 * @param {cssColor} sColor1
 * @param {cssColor} sColor2
 * @returns {number} deltaE
 */
export function deltaE(sColor1: cssColor, sColor2: cssColor) {
	const color1 = new Color(sColor1);
	const color2 = new Color(sColor2);
	return color1.deltaEOK(color2);
}
