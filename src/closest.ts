import Color from "colorjs.io";
import ColorSpace from "colorjs.io/spaces";

/**
 * Convert to space and multiply each coord by its strength.
 * @param {string} color hex
 * @param {ColorSpace} space
 * @param {number[]} strengths
 * @returns {string} hex
 */
export function toWeighted(
	color: string,
	space: ColorSpace,
	strengths: number[]
) {
	const weightedColor = new Color(color).to(space);
	weightedColor.coords.forEach((value: number | null, index: number) => {
		if (value === null) return;
		const strength = strengths[index] ?? 0;
		weightedColor.coords[index] = value * strength;
	});
	return weightedColor.toString({ format: "hex" });
}

/**
 * @param {string} sColor1 hex
 * @param {string} sColor2 hex
 * @returns {number} deltaE
 */
export function deltaE(sColor1: string, sColor2: string) {
	const color1 = new Color(sColor1);
	const color2 = new Color(sColor2);
	return color1.deltaEOK(color2);
}
