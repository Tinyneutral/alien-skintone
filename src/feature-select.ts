import Color from "colorjs.io";
import ColorSpace from "colorjs.io/spaces";

function clamp(val: number, min: number, max: number) {
	return Math.max(min, Math.min(max, val));
}

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   section: string,
 *   description: string,
 *   space: ColorSpace,
 *   strengths: number[]
 * }} Preset
 */

export const MODES = /** @type {const} */ ["default", "advanced"];

/** @type {Preset[]} */
export const DEFAULT_PRESETS = [
	{
		id: "hsv-001",
		name: "brightness",
		section: "fast & familiar",
		description: "The v in hsv. Basically grayscale.",
		space: "hsv",
		strengths: [0, 0, 1],
	},
	{
		id: "hsl-001",
		name: "light strength",
		section: "fast & familiar",
		description: "The l in hsl. Basically grayscale.",
		space: "hsl",
		strengths: [0, 0, 1],
	},
	{
		id: "hsl-011",
		name: "tone",
		section: "fast & familiar",
		description: "The s&l in hsl.",
		space: "hsl",
		strengths: [0, 1, 1],
	},
	{
		id: "hsv-011",
		name: "vibrance",
		section: "fast & familiar",
		description: "The s&v in hsv.",
		space: "hsv",
		strengths: [0, 1, 1],
	},
	{
		id: "oklab-100",
		name: "accurate light strength",
		section: "scientifically accurate but slow",
		description:
			"This uses oklab, which is designed to be as accurate as possible to your eyes.",
		space: "oklab",
		strengths: [1, 0, 0],
	},
	{
		id: "oklch-110",
		name: "accurate vibrance",
		section: "scientifically accurate but slow",
		description:
			"This uses oklch, which is designed to have the same color strength for all hues, making it useful for checking a color's vibrance.",
		space: "oklch",
		strengths: [1, 1, 0],
	},
];

/** @type {"default" | "advanced"} */
let mode = "default";

/** @type {ColorSpace} */
let space = Color.spaces["oklab"] as ColorSpace;

/** @type {number[]} */
const coordStrengths = [1, 1, 1];

/**
 * @param {string} id
 * @returns {{ space: ColorSpace, strengths: number[] }}
 */
function decodeId(id: string) {
	const [sSpace, sStrength] = id.split("-");
	const space = Color.spaces[sSpace] as ColorSpace;
	const strengths = sStrength.split("").map(Number);
	return { space, strengths };
}

/**
 * @param {ColorSpace} space
 * @param {number[]} strengths
 * @returns {string}
 */
function encodeId(space: ColorSpace, strengths: number[]) {
	return `${space.name}-${strengths.map(Boolean).join("")}`;
}

/**
 * @param {ColorSpace} space
 * @param {number} index
 * @returns {boolean}
 */
function coordExists(space: ColorSpace, index: number) {
	return index < Object.keys(space.coords).length;
}

/**
 * @param {"default" | "advanced"} next
 */
export function setMode(next: "default" | "advanced") {
	if (next !== "default" && next !== "advanced") {
		throw new TypeError('Mode must be "default" or "advanced"');
	}
	mode = next;
}

/**
 * @param {string} id
 */
export function setPreset(id: string) {
	const preset = DEFAULT_PRESETS.find((entry) => entry.id === id);
	if (!preset) {
		throw new Error(`Unknown preset: ${id}`);
	}
	const { space, strengths } = decodeId(id);
	setAdvancedSpace(space.name);
	for (let i = 0; i < strengths.length; i++) {
		setCoordStrength(i, strengths[i]);
	}
}

/**
 * @param {string} spaceId
 */
export function setAdvancedSpace(spaceId: string) {
	if (!Color.spaces[spaceId]) {
		throw new Error(`Unknown color space: ${spaceId}`);
	}
	space = Color.spaces[spaceId] as ColorSpace;
}

/**
 * @param {number} index
 * @param {number} value
 */
export function setCoordStrength(index: number, value: number) {
	if (!coordExists(space, index)) {
		throw new Error(`Coord does not exist: ${index}`);
	}
	if (
		!Number.isInteger(index) ||
		index < 0 ||
		index >= coordStrengths.length
	) {
		throw new RangeError(`Coord index out of range: ${index}`);
	}
	coordStrengths[index] = clamp(Number(value), 0, 1);
}

export function setCoordEnabled(index: number, enabled: boolean) {
	if (!coordExists(space, index)) {
		throw new Error(`Coord does not exist: ${index}`);
	}
	coordStrengths[index] = enabled ? 1 : 0;
}

export function getMode() {
	return mode;
}

export function getDefaultPreset() {
	const id = encodeId(space, coordStrengths);
	return DEFAULT_PRESETS.find((entry) => entry.id === id);
}

/**
 * @returns {string}
 */
export function getAdvancedSpace() {
	return space;
}

/**
 * @returns {number[]}
 */
export function getCoordStrengths() {
	return [...coordStrengths];
}

/**
 * @param {Rgb} color
 * @returns {Promise<void>}
 */
export async function copyHexToClipboard(color: Color) {
	const hex = color.to("hex").toString();
	await navigator.clipboard.writeText(hex);
}

/**
 * @returns {string[]}
 */
export function getSpaces() {
	return Object.keys(Color.spaces).sort();
}
