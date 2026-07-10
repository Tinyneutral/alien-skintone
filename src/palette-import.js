/**
 * @typedef {{ r: number, g: number, b: number }} PaletteColor
 */

const MIN_PIXEL_RATIO = 0.05;

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
function rgbKey(r, g, b) {
	return `${r},${g},${b}`;
}

/**
 * @param {string} key
 * @returns {PaletteColor}
 */
function keyToRgb(key) {
	const [r, g, b] = key.split(",").map(Number);
	return { r, g, b };
}

/**
 * @param {File} file
 * @returns {Promise<{ r: number[], g: number[], b: number[], a: number[] }>}
 */
async function imageFileToRgba(file) {
	if (!(file instanceof File)) {
		throw new TypeError("Expected a File object");
	}
	const bitmap = await createImageBitmap(file);

	try {
		const c = document.createElement("canvas");
		const ctx = c.getContext("2d");
		const w = bitmap.width;
		const h = bitmap.height;

		c.width = w;
		c.height = h;
		ctx.drawImage(bitmap, 0, 0, w, h);
		const { data } = ctx.getImageData(0, 0, w, h);

		const r = data.filter((_, i) => i % 4 === 0);
		const g = data.filter((_, i) => i % 4 === 1);
		const b = data.filter((_, i) => i % 4 === 2);
		const a = data.filter((_, i) => i % 4 === 3);
		return { r, g, b, a };
	} finally {
		bitmap.close();
	}
}

/**
 * @param {File} imageFile
 * @returns {Promise<Map<string, number>>}
 */
async function countPixelColors(imageFile) {
	/** @type {Map<string, number>} */
	const counts = new Map();

	const { r, g, b, a } = await imageFileToRgba(imageFile);
	const pixels = r.length;
	for (let i = 0; i < pixels; i++) {
		if (a[i] === 0) {
			continue;
		}

		const key = rgbKey(r[i], g[i], b[i]);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	return counts;
}

/**
 * @param {Map<string, number>} counts
 * @param {number} rate
 * @returns {Map<string, number>}
 */
function filterByRatio(counts, rate) {
	if (counts.size === 0) {
		return new Map();
	}

    // uses reduce for performance
    const maxCount = [...counts.values()].reduce(
        (max, count) => Math.max(max, count),
        0
    );
    const threshold = Math.floor(maxCount * rate);

	for (const [key, count] of counts.entries()) {
		if (count < threshold) {
			counts.delete(key);
		}
	}
	return counts;
}

/**
 * @param {File} imageFile
 * @returns {Promise<PaletteColor[]>}
 */
export async function extractPalette(imageFile) {
	const uniqueColorCounts = await countPixelColors(imageFile);
	const filteredColorCounts = filterByRatio(
		uniqueColorCounts,
		MIN_PIXEL_RATIO
	);
	return Array.from(filteredColorCounts.keys()).map(keyToRgb);
}
